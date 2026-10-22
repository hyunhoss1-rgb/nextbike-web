const OUR_DOMAIN = 'xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr';

function decodeHtml(value) {
  return value.replace(/&quot;|&#34;|&apos;|&#39;|&#x27;|&amp;|&lt;|&gt;/gi, entity => ({
    '&quot;': '"', '&#34;': '"', '&apos;': "'", '&#39;': "'", '&#x27;': "'",
    '&amp;': '&', '&lt;': '<', '&gt;': '>',
  })[entity.toLowerCase()]);
}

function getAttributes(tag) {
  const attributes = {};
  for (const match of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
    attributes[match[1].toLowerCase()] = decodeHtml(match[2] ?? match[3]);
  }
  return attributes;
}

function stripTags(value) { return decodeHtml(value.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim(); }
function host(url) {
  try { return new URL(url).hostname.replace(/^(www\.|m\.)/i, ''); } catch { return ''; }
}

function unknownResult(status = 'unparsed', rankDesc = '검색결과 판독 필요 — 노출 여부 미확인') {
  return { exposed: null, status, rank: null, webOnlyRank: null, rankDesc, link: '', title: '' };
}

function parseNaverResults(html) {
  // Only marked organic result cards; arbitrary links and script JSON are not ranks.
  const body = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  const cards = [];
  const seen = new Map();
  for (const match of body.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const attributes = getAttributes(match[1]);
    const area = attributes['data-nlog-area'] || '';
    const kind = area.match(/\.(w|b|c|kin|news)\.link$/)?.[1];
    const url = attributes.href || '';
    if (!kind || !/^https?:\/\//i.test(url) || !host(url)) continue;
    let params;
    try { params = JSON.parse(attributes['data-nlog-params'] || '{}'); } catch { continue; }
    if (!params.gdid) continue;
    const key = `${area.replace(/\.[^.]+\.link$/, '')}:${params.gdid}`;
    const title = stripTags(match[2]);
    if (seen.has(key)) {
      const card = seen.get(key);
      // Prefer a document destination over the same card's root-domain profile link.
      if (new URL(card.url).pathname === '/' && new URL(url).pathname !== '/') {
        card.url = url;
        card.title = title;
      }
      continue;
    }
    const card = { kind, url, title, host: host(url), blockRank: params.cr_rank_legacy || null };
    cards.push(card);
    seen.set(key, card);
  }
  const webCards = cards.filter(card => card.kind === 'w');
  if (!webCards.length) return unknownResult();
  const index = cards.findIndex(card => card.kind === 'w' && card.host === OUR_DOMAIN);
  if (index === -1) {
    if (html.includes(OUR_DOMAIN) || html.includes('전국중고오토바이매입.kr')) {
      return { ...unknownResult('domain_reference', '도메인 참조만 발견 — 웹문서 판독 필요'), parsedWebCards: webCards.length };
    }
    return { exposed: false, status: 'not_found', rank: null, webOnlyRank: null,
      rankDesc: '가져온 웹문서 결과에서 미확인', link: '', title: '', parsedWebCards: webCards.length };
  }
  const card = cards[index];
  const preceding = cards.slice(0, index);
  const webBefore = preceding.filter(item => item.kind === 'w');
  const webRank = webBefore.length + 1;
  return { exposed: true, status: 'confirmed', rank: index + 1, webOnlyRank: webRank,
    rankDesc: `가져온 웹문서 카드 ${webRank}번째 (광고·지도 제외)`,
    link: card.url, title: card.title, parsedWebCards: webCards.length,
    competitorsBefore: preceding.map(item => item.host), webCompetitorsBefore: webBefore.map(item => item.host) };
}

function parseGoogleResults(html) {
  const body = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  const cards = [];
  const seen = new Set();
  for (const match of body.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    if (!/<h3\b/i.test(match[2])) continue;
    const attributes = getAttributes(match[1]);
    let url = attributes.href || '';
    if (url.startsWith('/url?')) {
      const params = new URL(url, 'https://www.google.co.kr').searchParams;
      url = params.get('q') || params.get('url') || '';
    }
    if (!/^https?:\/\//i.test(url) || !host(url) || /(^|\.)google\./i.test(host(url)) || seen.has(url)) continue;
    seen.add(url);
    cards.push({ url, title: stripTags(match[2]), host: host(url) });
  }
  if (!cards.length) return unknownResult();
  const index = cards.findIndex(card => card.host === OUR_DOMAIN);
  if (index === -1) return { exposed: false, status: 'not_found', rank: null, webOnlyRank: null,
    rankDesc: '가져온 제목 카드에서 미확인', link: '', title: '' };
  return { exposed: true, status: 'confirmed', rank: index + 1, webOnlyRank: null,
    rankDesc: `가져온 제목 카드 ${index + 1}번째`, link: cards[index].url, title: cards[index].title };
}

module.exports = { parseNaverResults, parseGoogleResults, unknownResult };
