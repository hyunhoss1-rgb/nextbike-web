const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { parseNaverResults, parseGoogleResults } = require('./result-parser');
const { readResult } = require('./scanner');
const { summarizeItems, exportRow } = require('./measurement');

const domain = 'www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr';
function card(id, url, kind = 'w', text = 'Result') {
  return `<a href="${url}" data-nlog-area="urB_coR.${kind}.link" data-nlog-params="{&quot;gdid&quot;:&quot;${id}&quot;,&quot;cr_rank_legacy&quot;:&quot;1&quot;}">${text}</a>`;
}

test('Naver counts result cards, not profile/title/body duplicate anchors or navigation', () => {
  const html = `<a href="https://unrelated.example/">Menu</a>`
    + card('first', 'https://competitor.example/') + card('first', 'https://competitor.example/region', 'w', 'Title')
    + card('blog', 'https://blog.naver.com/a/1', 'b')
    + card('ours', `https://${domain}/`) + card('ours', `https://${domain}/regions/seoul`, 'w', 'Seoul');
  const result = parseNaverResults(html);
  assert.equal(result.exposed, true);
  assert.equal(result.webOnlyRank, 2);
  assert.equal(result.rank, 3);
  assert.equal(result.link, `https://${domain}/regions/seoul`);
  assert.equal(result.parsedWebCards, 2);
});

test('Naver keeps a genuine twelfth card instead of clamping it to ten', () => {
  const html = Array.from({ length: 11 }, (_, i) => card('doc' + i, `https://competitor.example/post/${i}`)).join('')
    + card('ours', `https://${domain}/`);
  assert.equal(parseNaverResults(html).webOnlyRank, 12);
});

test('Naver ignores script JSON, ads, AI source anchors and unmarked arbitrary links', () => {
  const html = `<script>${card('hidden', `https://${domain}/`)}</script>`
    + `<a href="https://${domain}/" data-nlog-area="ai_briefing.link">AI citation</a>`
    + `<a href="https://${domain}/" data-nlog-area="ad.link">Ad</a>`;
  assert.equal(parseNaverResults(html).exposed, null);
  assert.equal(parseNaverResults(html).status, 'unparsed');
});

test('Naver distinguishes absence in parsed results from a domain reference needing review', () => {
  const html = card('competitor', 'https://competitor.example/');
  assert.equal(parseNaverResults(html).exposed, false);
  const reference = html + `<script>const source = "https://${domain}/";</script>`;
  assert.equal(parseNaverResults(reference).exposed, null);
  assert.equal(parseNaverResults(reference).status, 'domain_reference');
});

test('Naver does not accept a lookalike host containing our domain', () => {
  const result = parseNaverResults(card('spoof', `https://${domain}.evil.example/`));
  assert.notEqual(result.exposed, true);
});

test('a changed HTML format and malformed card metadata remain unknown', () => {
  assert.equal(parseNaverResults('<html>CAPTCHA</html>').exposed, null);
  assert.equal(parseNaverResults(`<a href="https://${domain}/" data-nlog-area="urB_coR.w.link" data-nlog-params="invalid">Title</a>`).exposed, null);
});

test('request failures are never classified as unexposed', () => {
  for (const response of [{ status: 0, html: '' }, { status: 403, html: 'denied' }, { status: 200, html: '' }]) {
    const result = readResult(response, parseNaverResults);
    assert.equal(result.exposed, null);
    assert.equal(result.rank, null);
    assert.equal(result.status, 'request_error');
  }
});

test('Google requires actual result headings and preserves positions beyond ten', () => {
  assert.equal(parseGoogleResults(`<script>"https://${domain}/"</script>`).exposed, null);
  const html = Array.from({ length: 11 }, (_, i) => `<a href="https://competitor.example/${i}"><h3>Title ${i}</h3></a>`).join('')
    + `<a href="/url?q=https%3A%2F%2F${domain}%2F"><h3>Ours</h3></a>`;
  assert.equal(parseGoogleResults(html).rank, 12);
});

test('summary denominator excludes errors and unparsed observations', () => {
  const summary = summarizeItems({ a: { exposed: true }, b: { exposed: false }, c: { exposed: null, status: 'request_error' } }, 3);
  assert.deepEqual(summary, { totalKeywords: 3, measuredCount: 2, unknownCount: 1, exposedCount: 1, exposedRate: '50.0%' });
  assert.equal(summarizeItems({ a: { exposed: null } }, 1).exposedRate, null);
});

test('CSV preserves unknown state and escapes quotes', () => {
  const row = exportRow('a"b', { exposed: null, status: 'request_error' });
  assert.equal(row[1], '"a""b"');
  assert.equal(row[2], '"미확인"');
  assert.match(row[5], /조회 실패/);
});

test('retired synthetic seed command refuses to overwrite existing history', () => {
  const file = path.join(__dirname, 'data/history.json');
  const before = fs.readFileSync(file);
  const result = spawnSync(process.execPath, [path.join(__dirname, 'data/seed_history.js')], { encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.deepEqual(fs.readFileSync(file), before);
});
