const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

const source = fs.readFileSync(path.join(__dirname, '../src/app/api/estimate/route.ts'), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function loadRoute({ configured = true, env, responses = [] } = {}) {
  const calls = [];
  const logs = [];
  const deadlines = [];
  const module = { exports: {} };
  const context = vm.createContext({
    module, exports: module.exports,
    require(name) {
      assert.equal(name, 'next/server');
      return require(name);
    },
    process: { env: env ?? (configured ? { TELEGRAM_BOT_TOKEN: 'test-token-not-real', TELEGRAM_CHAT_ID: 'test-chat' } : {}) },
    console: { error: (...args) => logs.push(args.join(' ')), warn: (...args) => logs.push(args.join(' ')) },
    FormData, File, Date, Intl,
    AbortSignal: { timeout(ms) { deadlines.push(ms); return AbortSignal.timeout(ms); } },
    async fetch(url, options) {
      calls.push({ url, options });
      assert.ok(responses.length, 'Every outbound request must have a mocked response; real fetch is unavailable');
      const response = responses.shift();
      if (response instanceof Error) throw response;
      return typeof response === 'function' ? response(url, options) : response;
    },
  });
  vm.runInContext(compiled, context, { filename: 'estimate-route.js' });
  return { ...module.exports, calls, logs, deadlines };
}

const payload = { phone: '010-0000-0000', model: '혼다 PCX125', region: '시흥', memo: '테스트' };
const jsonRequest = (data = payload) => new Request('http://localhost/api/estimate', {
  method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data),
});
const telegram = (ok = true, status = 200) => Response.json({ ok, result: [] }, { status });
function photoRequest(count, { size = 4, type = 'image/jpeg', name = 'bike.jpg', fields = payload } = {}) {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.set(key, value);
  for (let i = 0; i < count; i++) form.append('photos', new File([new Uint8Array(size)], name, { type }));
  return new Request('http://localhost/api/estimate', { method: 'POST', body: form });
}

test('GET health check remains available without credentials', async () => {
  const route = loadRoute({ configured: false });
  const response = await route.GET();
  assert.equal(response.status, 200);
  assert.equal((await response.json()).status, 'ok');
  assert.equal(route.calls.length, 0);
});

for (const env of [{}, { TELEGRAM_BOT_TOKEN: 'test-token-not-real' }, { TELEGRAM_CHAT_ID: 'test-chat' }]) {
  test(`missing Telegram binding (${Object.keys(env).join(',') || 'both'}) never reports success`, async () => {
    const route = loadRoute({ env });
    const response = await route.POST(jsonRequest());
    assert.equal(response.status, 503);
    assert.equal((await response.json()).success, false);
    assert.equal(route.calls.length, 0);
  });
}

test('text estimate succeeds only after Telegram acknowledges delivery', async () => {
  const route = loadRoute({ responses: [telegram()] });
  const response = await route.POST(jsonRequest({ ...payload, phone: ' 010-0000-0000 ' }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true, photosDelivered: true });
  assert.match(route.calls[0].url, /\/sendMessage$/);
  const body = JSON.parse(route.calls[0].options.body);
  assert.equal(body.chat_id, 'test-chat');
  assert.match(body.text, /010-0000-0000/);
  assert.match(body.text, /혼다 PCX125/);
  assert.ok(body.text.length < 4096);
  assert.equal(route.deadlines.length, 1);
  assert.ok(route.deadlines[0] <= 10_000);
  assert.ok(route.calls[0].options.signal instanceof AbortSignal);
});

for (const [name, result] of [
  ['HTTP failure', () => telegram(false, 502)],
  ['HTTP 200 with Telegram ok:false', () => telegram(false)],
  ['invalid upstream JSON', () => new Response('not JSON')],
  ['missing upstream acknowledgement', () => Response.json({ result: {} })],
  ['network failure', () => new Error('fetch failed https://api.telegram.org/bottest-token-not-real/sendMessage')],
  ['timeout', () => new DOMException('deadline exceeded', 'TimeoutError')],
]) {
  test(`${name} returns failure and does not expose credentials`, async () => {
    const route = loadRoute({ responses: [result()] });
    const response = await route.POST(jsonRequest());
    assert.equal(response.status, 502);
    const body = await response.json();
    assert.equal(body.success, false);
    assert.ok(body.error);
    assert.doesNotMatch(JSON.stringify(body) + route.logs.join(' '), /test-token-not-real|api\.telegram\.org/);
  });
}

for (const count of [1, 2, 5]) {
  test(`${count} photo(s) use the supported Telegram media method`, async () => {
    const route = loadRoute({ responses: [telegram()] });
    const response = await route.POST(photoRequest(count));
    assert.equal(response.status, 200);
    assert.equal((await response.json()).photosDelivered, true);
    assert.match(route.calls[0].url, count === 1 ? /\/sendPhoto$/ : /\/sendMediaGroup$/);
    const form = route.calls[0].options.body;
    assert.ok(form instanceof FormData);
    assert.equal(form.get('chat_id'), 'test-chat');
    if (count === 1) {
      assert.ok(form.get('photo') instanceof File);
      assert.ok(form.get('caption').length <= 1024);
    } else {
      const media = JSON.parse(form.get('media'));
      assert.equal(media.length, count);
      for (const item of media) assert.ok(form.get(item.media.replace('attach://', '')) instanceof File);
      assert.ok(media[0].caption.length <= 1024);
    }
  });
}

for (const count of [1, 3]) {
  test(`${count} photo(s) falling back to delivered text report the missing photos`, async () => {
    const route = loadRoute({ responses: count === 1
      ? [telegram(false), telegram(false), telegram()]
      : [telegram(false), telegram()] });
    const response = await route.POST(photoRequest(count));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { success: true, photosDelivered: false });
    const textCall = route.calls.at(-1);
    assert.match(textCall.url, /\/sendMessage$/);
    const body = JSON.parse(textCall.options.body);
    assert.match(body.text, /전송 실패/);
    assert.doesNotMatch(body.text, /장 첨부됨/);
    assert.equal(route.calls.length, count === 1 ? 3 : 2);
    if (count === 1) assert.match(route.calls[1].url, /\/sendDocument$/);
    assert.equal(new Set(route.calls.map(call => call.options.signal)).size, route.calls.length,
      'each fallback retains its own usable timeout after an earlier upload fails');
    assert.deepEqual(route.deadlines, count === 1 ? [10_000, 8_000, 8_000] : [10_000, 8_000]);
  });
}

test('failed photo and text fallback cannot produce a success receipt', async () => {
  const route = loadRoute({ responses: [telegram(false, 500), telegram(false), telegram(false)] });
  const response = await route.POST(photoRequest(1));
  assert.equal(response.status, 502);
  assert.equal((await response.json()).success, false);
  assert.equal(route.calls.length, 3);
  assert.match(route.calls[1].url, /\/sendDocument$/);
  assert.match(route.calls[2].url, /\/sendMessage$/);
});

test('a single non-standard image can recover as a document with the complete lead caption', async () => {
  const route = loadRoute({ responses: [telegram(false), telegram()] });
  const response = await route.POST(photoRequest(1, { type: 'image/heic', name: 'iphone.heic' }));
  assert.deepEqual(await response.json(), { success: true, photosDelivered: true });
  assert.equal(route.calls.length, 2);
  assert.match(route.calls[1].url, /\/sendDocument$/);
  const form = route.calls[1].options.body;
  assert.equal(form.get('document').name, 'iphone.heic');
  for (const value of Object.values(payload)) assert.ok(form.get('caption').includes(value));
  assert.notStrictEqual(route.calls[0].options.signal, route.calls[1].options.signal);
});

test('media network failure can recover with acknowledged text', async () => {
  const route = loadRoute({ responses: [new Error('connection closed'), telegram()] });
  const response = await route.POST(photoRequest(2));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).photosDelivered, false);
});

const longMemo = `메모 시작 ${'상세한 정비 이력과 요청사항. '.repeat(65)} 메모 마지막 문장`;

for (const count of [1, 3]) {
  test(`${count} photo(s) preserve the entire long memo in an acknowledged text message`, async () => {
    const route = loadRoute({ responses: [telegram(), telegram()] });
    const response = await route.POST(photoRequest(count, { fields: { ...payload, year: '2024', mileage: '12000', memo: longMemo } }));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { success: true, photosDelivered: true });
    assert.equal(route.calls.length, 2);
    assert.match(route.calls[0].url, /\/sendMessage$/);
    const fullText = JSON.parse(route.calls[0].options.body).text;
    assert.ok(fullText.includes(longMemo), 'all customer memo text must survive the caption limit');
    for (const value of [payload.region, '2024', '12000']) assert.ok(fullText.includes(value));
    assert.match(fullText, /별도 전송 예정/);
    const media = route.calls[1].options.body;
    const caption = count === 1 ? media.get('caption') : JSON.parse(media.get('media'))[0].caption;
    assert.ok(caption.length <= 1024);
    assert.match(caption, /010-0000-0000/);
    assert.notStrictEqual(route.calls[0].options.signal, route.calls[1].options.signal);
    assert.deepEqual(route.deadlines, [8_000, 10_000]);
  });
}

test('a long-memo text failure stops before media and cannot report a successful lead', async () => {
  const route = loadRoute({ responses: [telegram(false), telegram()] });
  const response = await route.POST(photoRequest(1, { fields: { ...payload, memo: longMemo } }));
  assert.equal(response.status, 502);
  assert.equal((await response.json()).success, false);
  assert.equal(route.calls.length, 1);
  assert.match(route.calls[0].url, /\/sendMessage$/);
});

test('long-memo text delivered before media failure remains a lead without claiming photo delivery', async () => {
  const route = loadRoute({ responses: [telegram(), telegram(false)] });
  const response = await route.POST(photoRequest(2, { fields: { ...payload, memo: longMemo } }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true, photosDelivered: false });
  assert.equal(route.calls.length, 2, 'do not duplicate a full text notification that is already acknowledged');
  assert.ok(JSON.parse(route.calls[0].options.body).text.includes(longMemo));
});

for (const [name, data] of [
  ['missing model', { ...payload, model: ' ' }],
  ['missing phone', { ...payload, phone: '' }],
  ['array body', []],
  ['null body', null],
]) {
  test(`${name} is rejected before contacting Telegram`, async () => {
    const route = loadRoute();
    const response = await route.POST(jsonRequest(data));
    assert.equal(response.status, 400);
    assert.equal((await response.json()).success, false);
    assert.equal(route.calls.length, 0);
  });
}

test('nonempty contact text follows the current permissive policy and is preserved', async () => {
  const route = loadRoute({ responses: [telegram()] });
  const response = await route.POST(jsonRequest({ ...payload, phone: '  +82 (0)10 1234 5678 / 문자 먼저  ' }));
  assert.equal(response.status, 200);
  assert.match(JSON.parse(route.calls[0].options.body).text, /\+82 \(0\)10 1234 5678 \/ 문자 먼저/);
  assert.equal(route.calls.length, 1);
});

test('non-string fields follow bounded string coercion without breaking lead delivery', async () => {
  const route = loadRoute({ responses: [telegram()] });
  const response = await route.POST(jsonRequest({ ...payload, year: 2024, mileage: 12000, model: { name: 'PCX' } }));
  assert.equal(response.status, 200);
  const text = JSON.parse(route.calls[0].options.body).text;
  assert.match(text, /2024/);
  assert.match(text, /12000/);
  assert.match(text, /\[object Object\]/);
  assert.equal(route.calls.length, 1);
});

test('memo uses the current 2000-character accepted limit and stays within a Telegram message', async () => {
  const route = loadRoute({ responses: [telegram()] });
  const response = await route.POST(jsonRequest({ ...payload, memo: 'x'.repeat(2000) + 'OUTSIDE_LIMIT' }));
  assert.equal(response.status, 200);
  const text = JSON.parse(route.calls[0].options.body).text;
  assert.ok(text.includes('x'.repeat(2000)));
  assert.ok(!text.includes('OUTSIDE_LIMIT'));
  assert.ok(text.length <= 4096);
  assert.equal(route.calls.length, 1);
});

for (const [name, request] of [
  ['malformed JSON', () => new Request('http://localhost/api/estimate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{' })],
  ['malformed multipart', () => new Request('http://localhost/api/estimate', { method: 'POST', headers: { 'content-type': 'multipart/form-data; boundary=broken' }, body: 'invalid' })],
]) {
  test(`${name} returns a client error without delivery`, async () => {
    const route = loadRoute();
    const response = await route.POST(request());
    assert.equal(response.status, 400);
    assert.equal((await response.json()).success, false);
    assert.equal(route.calls.length, 0);
  });
}

test('a sixth photo does not discard the lead but is reported as not fully delivered', async () => {
  const route = loadRoute({ responses: [telegram()] });
  const response = await route.POST(photoRequest(6));
  assert.deepEqual(await response.json(), { success: true, photosDelivered: false });
  assert.equal(route.calls.length, 1);
  const media = JSON.parse(route.calls[0].options.body.get('media'));
  assert.equal(media.length, 5);
  assert.match(media[0].caption, /1장은 용량 또는 개수 제한으로 전달되지 않았습니다/);
});

test('an oversize photo preserves the text lead but cannot claim photo delivery', async () => {
  const route = loadRoute({ responses: [telegram()] });
  const response = await route.POST(photoRequest(1, { size: 15 * 1024 * 1024 + 1 }));
  assert.deepEqual(await response.json(), { success: true, photosDelivered: false });
  assert.equal(route.calls.length, 1);
  assert.match(route.calls[0].url, /\/sendMessage$/);
  const text = JSON.parse(route.calls[0].options.body).text;
  for (const value of Object.values(payload)) assert.ok(text.includes(value));
  assert.match(text, /1장은 용량 또는 개수 제한으로 전달되지 않았습니다/);
  assert.doesNotMatch(text, /장 첨부됨/);
});

test('a non-standard attachment requires an acknowledged document fallback', async () => {
  const route = loadRoute({ responses: [telegram(false), telegram()] });
  const response = await route.POST(photoRequest(1, { type: 'application/pdf', name: 'file.pdf' }));
  assert.deepEqual(await response.json(), { success: true, photosDelivered: true });
  assert.equal(route.calls.length, 2);
  assert.match(route.calls[1].url, /\/sendDocument$/);
  assert.equal(route.calls[1].options.body.get('document').name, 'file.pdf');
});

test('an empty multipart photo field does not create a fake media delivery', async () => {
  const route = loadRoute({ responses: [telegram()] });
  const response = await route.POST(photoRequest(1, { size: 0 }));
  assert.equal(response.status, 200);
  assert.match(route.calls[0].url, /\/sendMessage$/);
});
