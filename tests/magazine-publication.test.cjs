const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { spawnSync } = require('node:child_process');
const test = require('node:test');
const ts = require('typescript');

const root = path.join(__dirname, '..');
const compiled = new Map();
const NOT_FOUND = 'PUBLICATION_TEST_NOT_FOUND';

function compile(filename) {
  if (!compiled.has(filename)) {
    compiled.set(filename, ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
      },
    }).outputText);
  }
  return compiled.get(filename);
}

// Execute the actual selectors and route functions with one controllable clock.
// Client components are opaque JSX children; no real network implementation exists.
function appAt(instant) {
  let clock = Date.parse(instant);
  class ClockDate extends Date {
    constructor(...args) { super(...(args.length ? args : [clock])); }
    static now() { return clock; }
  }
  const modules = new Map();
  const jsx = (type, props, key) => ({ type, props, key });
  const notFound = () => {
    const error = new Error('Article is not publicly available');
    error.code = NOT_FOUND;
    throw error;
  };

  function load(relative) {
    let filename = path.isAbsolute(relative) ? relative : path.join(root, relative);
    if (!path.extname(filename)) {
      filename = ['.ts', '.tsx'].map(ext => filename + ext).find(fs.existsSync);
    }
    assert.ok(filename && filename.startsWith(root + path.sep), 'Only repository modules may load');
    if (modules.has(filename)) return modules.get(filename).exports;
    const module = { exports: {} };
    modules.set(filename, module);
    const context = {
      module, exports: module.exports, Date: ClockDate, Intl,
      require(name) {
        if (name === 'react/jsx-runtime') return { jsx, jsxs: jsx, Fragment: 'Fragment' };
        if (name === 'react') return { __esModule: true, default: {} };
        if (name === 'next/navigation') return { notFound };
        if (name === 'next/link') return { __esModule: true, default: 'Link' };
        if (name === 'lucide-react') return new Proxy({}, { get: (_, icon) => String(icon) });
        if (name.startsWith('@/components/')) {
          const component = name.split('/').at(-1);
          return new Proxy({ __esModule: true, default: component }, {
            get: (target, key) => Object.hasOwn(target, key) ? target[key] : `${component}.${String(key)}`,
          });
        }
        if (name.startsWith('@/')) return load(path.join(root, 'src', name.slice(2)));
        if (name.startsWith('.')) return load(path.resolve(path.dirname(filename), name));
        throw new Error(`Unexpected runtime dependency: ${name}`);
      },
    };
    vm.runInNewContext(compile(filename), context, { filename });
    return module.exports;
  }
  return {
    load,
    setNow(value) { clock = Date.parse(value); },
    now() { return new ClockDate(); },
  };
}

const slugs = values => Array.from(values, item => item.slug);
const isNotFound = error => error?.code === NOT_FOUND;
const articleUrl = slug => `https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/magazine/${slug}`;

function linksIn(node) {
  if (Array.isArray(node)) return node.flatMap(linksIn);
  if (!node || typeof node !== 'object') return [];
  const own = typeof node.props?.href === 'string' ? [node.props.href] : [];
  return own.concat(linksIn(node.props?.children));
}

test('publication changes at midnight in Korea, including month and year boundaries', () => {
  const app = appAt('2026-11-10T00:00:00Z');
  const date = app.load('src/lib/publication-date.ts');
  assert.equal(date.getKstDateString(new Date('2026-11-10T14:59:59.999Z')), '2026-11-10');
  assert.equal(date.getKstDateString(new Date('2026-11-10T15:00:00.000Z')), '2026-11-11');
  assert.equal(date.getKstDateString(new Date('2026-11-30T15:00:00.000Z')), '2026-12-01');
  assert.equal(date.getKstDateString(new Date('2026-12-31T15:00:00.000Z')), '2027-01-01');
  assert.equal(date.isPublicationDateReached('2026-11-11', new Date('2026-11-10T14:59:59.999Z')), false);
  assert.equal(date.isPublicationDateReached('2026-11-11', new Date('2026-11-10T15:00:00.000Z')), true);
  assert.equal(date.isPublicationDateReached('2026-1-1', app.now()), false);
  assert.equal(date.isPublicationDateReached('not-a-date', app.now()), false);
});

test('real UTC, Korean and Los Angeles processes produce the same Korean publication dates', () => {
  const code = compile(path.join(root, 'src/lib/publication-date.ts'));
  const script = `
    const module = { exports: {} };
    new Function('exports', 'module', ${JSON.stringify(code)})(module.exports, module);
    const instants = ['2026-11-10T14:59:59.999Z', '2026-11-10T15:00:00.000Z'];
    process.stdout.write(JSON.stringify({
      dates: instants.map(value => module.exports.getKstDateString(new Date(value))),
      offset: new Date(instants[0]).getTimezoneOffset()
    }));
  `;
  const offsets = new Set();
  for (const TZ of ['UTC', 'Asia/Seoul', 'America/Los_Angeles']) {
    const child = spawnSync(process.execPath, ['-e', script], {
      env: { ...process.env, TZ }, encoding: 'utf8', timeout: 10_000,
    });
    assert.equal(child.status, 0, child.stderr);
    const value = JSON.parse(child.stdout);
    offsets.add(value.offset);
    assert.deepEqual(value.dates, ['2026-11-10', '2026-11-11'], TZ);
  }
  assert.equal(offsets.size, 3, 'The child processes must actually use distinct local timezones');
});

test('public selectors, recent articles and related articles use the same publication set', () => {
  const app = appAt('2026-11-10T00:00:00Z');
  const data = app.load('src/data/magazine.ts');
  const now = app.now();
  const all = data.getAllArticles();
  const published = data.getPublishedArticles(now);
  const expected = Array.from(all).filter(article => article.publishDate <= '2026-11-10');
  assert.deepEqual(slugs(published).sort(), slugs(expected).sort());
  assert.ok(all.some(article => article.publishDate > '2026-11-10'), 'Fixture must include scheduled articles');
  assert.ok(published.some(article => article.publishDate === '2026-11-10'));
  assert.ok(published.every((article, index) => !index || published[index - 1].publishDate >= article.publishDate));
  for (const article of all) {
    assert.equal(Boolean(data.getArticleBySlug(article.slug, now)), article.publishDate <= '2026-11-10', article.slug);
  }
  assert.equal(data.getArticleBySlug('does-not-exist', now), undefined);
  assert.deepEqual(slugs(data.getRecentArticles(3, now)), slugs(published.slice(0, 3)));
  const current = published[0];
  const related = data.getRelatedArticles(current.slug, all.length, now);
  assert.deepEqual(slugs(related).sort(), slugs(published.filter(article => article.slug !== current.slug)).sort());
  assert.ok(related.every(article => article.publishDate <= '2026-11-10' && article.slug !== current.slug));
});

test('the same loaded selectors make a scheduled article public when the Korean date advances', () => {
  const app = appAt('2026-11-10T14:59:59.999Z');
  const data = app.load('src/data/magazine.ts');
  const article = data.getAllArticles().find(item => item.publishDate === '2026-11-11');
  assert.ok(article, 'Fixture must include an article due at the next Korean midnight');
  assert.equal(data.getArticleBySlug(article.slug), undefined);
  assert.equal(data.getPublishedArticles().some(item => item.slug === article.slug), false);
  app.setNow('2026-11-10T15:00:00.000Z');
  assert.equal(data.getArticleBySlug(article.slug)?.slug, article.slug);
  assert.ok(data.getPublishedArticles().some(item => item.slug === article.slug));
  assert.equal(data.getRecentArticles(1)[0].slug, article.slug);
});

test('the server magazine list sends published previews and a stable Korean date, not full or future articles', () => {
  const app = appAt('2026-11-10T00:00:00Z');
  const data = app.load('src/data/magazine.ts');
  const page = app.load('src/app/magazine/page.tsx').default;
  const node = page();
  assert.equal(node.type, 'MagazineIndexClient');
  assert.equal(node.props.todayStr, '2026-11-10');
  assert.deepEqual(slugs(node.props.articles), slugs(data.getPublishedArticles()));
  assert.deepEqual(Array.from(node.props.categories), Array.from(data.MAGAZINE_CATEGORIES));
  const allowed = new Set(['slug', 'title', 'excerpt', 'category', 'publishDate', 'readingTime', 'tags', 'featured']);
  for (const preview of node.props.articles) {
    assert.ok(preview.publishDate <= '2026-11-10');
    assert.ok(Object.keys(preview).every(key => allowed.has(key)));
    assert.equal('sections' in preview, false);
    assert.equal('faq' in preview, false);
    assert.equal('quickInfo' in preview, false);
  }
  app.setNow('2026-11-10T15:00:00.000Z');
  const next = page();
  assert.equal(next.props.todayStr, '2026-11-11');
  assert.ok(next.props.articles.some(article => article.publishDate === '2026-11-11'));
});

test('home article links follow publication rather than the raw scheduled inventory', () => {
  const app = appAt('2026-11-10T00:00:00Z');
  const data = app.load('src/data/magazine.ts');
  const home = app.load('src/app/page.tsx').default;
  const articleLinks = linksIn(home()).filter(href => href.startsWith('/magazine/'));
  assert.deepEqual(articleLinks, slugs(data.getRecentArticles(3)).map(slug => `/magazine/${slug}`));
  assert.ok(articleLinks.length > 0);
  for (const href of articleLinks) assert.ok(data.getArticleBySlug(href.slice('/magazine/'.length)));
});

test('sitemap matches the public article set and does not manufacture changing modification times', () => {
  const app = appAt('2026-11-10T00:00:00Z');
  const data = app.load('src/data/magazine.ts');
  const sitemap = app.load('src/app/sitemap.ts').default;
  const first = sitemap();
  const articles = first.filter(item => item.url.includes('/magazine/'));
  assert.deepEqual(Array.from(articles, item => item.url).sort(), slugs(data.getPublishedArticles()).map(articleUrl).sort());
  for (const item of articles) {
    const article = data.getArticleBySlug(item.url.split('/').at(-1));
    assert.equal(item.lastModified.toISOString(), new Date(`${article.publishDate}T00:00:00+09:00`).toISOString());
    assert.ok(item.lastModified.getTime() <= app.now().getTime());
  }
  const otherPages = first.filter(item => !item.url.includes('/magazine/'));
  assert.ok(otherPages.length > 1000, 'Actual region/model/static pages should also be covered');
  assert.ok(otherPages.every(item => !Object.hasOwn(item, 'lastModified')));
  const snapshot = rows => Array.from(rows, item => [item.url, item.lastModified?.toISOString() ?? null]);
  app.setNow('2026-11-10T10:00:00Z');
  assert.deepEqual(snapshot(sitemap()), snapshot(first), 'No content changed within the publication day');
  app.setNow('2026-11-10T15:00:00Z');
  const next = sitemap();
  const scheduled = data.getAllArticles().find(article => article.publishDate === '2026-11-11');
  assert.ok(next.some(item => item.url === articleUrl(scheduled.slug)), 'The next due URL must enter without rebuilding the module');
});

test('detail metadata and page reject future and unknown articles without exposing article content', async () => {
  const app = appAt('2026-11-10T00:00:00Z');
  const data = app.load('src/data/magazine.ts');
  const detail = app.load('src/app/magazine/[slug]/page.tsx');
  const future = data.getAllArticles().find(article => article.publishDate > '2026-11-10');
  for (const slug of [future.slug, 'does-not-exist']) {
    await assert.rejects(() => detail.generateMetadata({ params: Promise.resolve({ slug }) }), isNotFound);
    await assert.rejects(() => detail.default({ params: Promise.resolve({ slug }) }), isNotFound);
  }
  const published = data.getPublishedArticles()[0];
  const metadata = await detail.generateMetadata({ params: Promise.resolve({ slug: published.slug }) });
  assert.ok(metadata.title.includes(published.title));
  assert.equal(metadata.alternates.canonical, articleUrl(published.slug));
  assert.ok(await detail.default({ params: Promise.resolve({ slug: published.slug }) }));
});

test('a previously unavailable detail becomes available at its publication boundary without reloading its module', async () => {
  const app = appAt('2026-11-10T14:59:59.999Z');
  const data = app.load('src/data/magazine.ts');
  const detail = app.load('src/app/magazine/[slug]/page.tsx');
  const scheduled = data.getAllArticles().find(article => article.publishDate === '2026-11-11');
  const props = { params: Promise.resolve({ slug: scheduled.slug }) };
  await assert.rejects(() => detail.generateMetadata(props), isNotFound);
  await assert.rejects(() => detail.default(props), isNotFound);
  app.setNow('2026-11-10T15:00:00.000Z');
  const metadata = await detail.generateMetadata(props);
  assert.equal(metadata.openGraph.publishedTime, scheduled.publishDate);
  assert.equal(metadata.alternates.canonical, articleUrl(scheduled.slug));
  assert.ok(await detail.default(props));
});
