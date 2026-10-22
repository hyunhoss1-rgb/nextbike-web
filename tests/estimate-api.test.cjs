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
    const route = loadRoute({ responses: [telegram(false), telegram()] });
    const response = await route.POST(photoRequest(count));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { success: true, photosDelivered: false });
    assert.match(route.calls[1].url, /\/sendMessage$/);
    const body = JSON.parse(route.calls[1].options.body);
    assert.match(body.text, /전송 실패/);
    assert.doesNotMatch(body.text, /장 첨부됨/);
    assert.strictEqual(route.calls[0].options.signal, route.calls[1].options.signal);
    assert.equal(route.deadlines.length, 1, 'fallback shares the original overall deadline');
  });
}

test('failed photo and text fallback cannot produce a success receipt', async () => {
  const route = loadRoute({ responses: [telegram(false, 500), telegram(false)] });
  const response = await route.POST(photoRequest(1));
  assert.equal(response.status, 502);
  assert.equal((await response.json()).success, false);
  assert.equal(route.calls.length, 2);
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
    const response = await route.POST(photoRequest(count, { fields: { ...payload, memo: longMemo } }));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { success: true, photosDelivered: true });
    assert.equal(route.calls.length, 2);
    assert.match(route.calls[0].url, /\/sendMessage$/);
    const fullText = JSON.parse(route.calls[0].options.body).text;
    assert.ok(fullText.includes(longMemo), 'all customer memo text must survive the caption limit');
    assert.match(fullText, /별도 전송 예정/);
    const media = route.calls[1].options.body;
    const caption = count === 1 ? media.get('caption') : JSON.parse(media.get('media'))[0].caption;
    assert.ok(caption.length <= 1024);
    assert.match(caption, /010-0000-0000/);
    assert.strictEqual(route.calls[0].options.signal, route.calls[1].options.signal);
  });
}

test('a long-memo text failure stops before media and cannot report a successful lead', async () => {
  const route = loadRoute({ responses: [telegram(false)] });
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
  ['invalid phone', { ...payload, phone: 'no phone' }],
  ['object field', { ...payload, model: { name: 'PCX' } }],
  ['overlong memo', { ...payload, memo: 'x'.repeat(1501) }],
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

for (const [name, request] of [
  ['malformed JSON', () => new Request('http://localhost/api/estimate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{' })],
  ['malformed multipart', () => new Request('http://localhost/api/estimate', { method: 'POST', headers: { 'content-type': 'multipart/form-data; boundary=broken' }, body: 'invalid' })],
  ['more than five photos', () => photoRequest(6)],
  ['photo exceeding Telegram limit', () => photoRequest(1, { size: 10 * 1024 * 1024 + 1 })],
  ['non-image attachment', () => photoRequest(1, { type: 'application/pdf', name: 'file.pdf' })],
]) {
  test(`${name} returns a client error without delivery`, async () => {
    const route = loadRoute();
    const response = await route.POST(request());
    assert.equal(response.status, 400);
    assert.equal((await response.json()).success, false);
    assert.equal(route.calls.length, 0);
  });
}

test('an empty multipart photo field does not create a fake media delivery', async () => {
  const route = loadRoute({ responses: [telegram()] });
  const response = await route.POST(photoRequest(1, { size: 0 }));
  assert.equal(response.status, 200);
  assert.match(route.calls[0].url, /\/sendMessage$/);
});
