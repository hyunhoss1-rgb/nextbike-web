const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const ts = require('typescript');

const root = path.join(__dirname, '..');

function load(relativePath, imports = {}) {
  const filename = path.join(root, relativePath);
  const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const module = { exports: {} };
  const context = {
    module,
    exports: module.exports,
    require(name) {
      if (name === 'react/jsx-runtime') return { jsx: (type, props) => ({ type, props }) };
      if (Object.hasOwn(imports, name)) return imports[name];
      throw new Error(`Unexpected runtime dependency: ${name}`);
    },
  };
  vm.runInNewContext(source, context, { filename });
  return module.exports;
}

const regionData = load('src/data/regions.ts');
const modelData = load('src/data/models.ts');
const search = load('src/lib/bike-model-search.ts');

const RegionTableGrid = load('src/components/RegionTableGrid.tsx', {
  '@/data/regions': regionData,
  './RegionTableGridClient': { __esModule: true, default: 'RegionTableGridClient' },
}).default;
const ModelLinkGrid = load('src/components/ModelLinkGrid.tsx', {
  '@/data/models': modelData,
  '@/lib/bike-model-search': search,
  './ModelLinkGridClient': { __esModule: true, default: 'ModelLinkGridClient' },
}).default;

function slugs(items) {
  return Array.from(items, item => item.slug);
}

function regionMatches(items, query) {
  const q = query.trim().toLowerCase();
  return items.filter(region => [region.name, region.fullName, region.province, ...(region.subDistricts || [])]
    .join(' ').toLowerCase().includes(q));
}

test('region server boundary preserves ordered default links and all search results', () => {
  const props = RegionTableGrid({ title: 'custom title', subtitle: 'custom subtitle' }).props;
  assert.equal(props.title, 'custom title');
  assert.equal(props.subtitle, 'custom subtitle');
  assert.deepEqual(slugs(props.default60Regions), slugs(regionData.getTable60Regions()));
  const original = regionData.getMainRegions();
  const queries = new Set(['', ' 시흥 ', '서울', '해운대', '없는지역']);
  for (const region of original) {
    queries.add(region.name);
    queries.add(region.fullName);
    for (const district of region.subDistricts || []) queries.add(district);
  }
  for (const query of queries) {
    assert.deepEqual(slugs(regionMatches(props.allMainRegions, query)), slugs(regionMatches(original, query)), query);
  }
  assert.equal(props.allMainRegions.some(item => 'editorialArticles' in item || 'description' in item), false);
});

test('model server boundary preserves card fields and search semantics with compact data', () => {
  const props = ModelLinkGrid({ currentSlug: 'pcx125' }).props;
  assert.equal(props.currentSlug, 'pcx125');
  assert.deepEqual(slugs(props.models), slugs(modelData.BIKE_MODELS));
  const queries = new Set(['', ' 피씨엑스 ', '엔맥스', '엑스맥스', '알삼', '340만', '국민', 'BMW 1250', '없는모델']);
  for (const model of modelData.BIKE_MODELS) {
    for (const field of ['slug', 'name', 'brand', 'category', 'displacement', 'summary', 'priceRange']) {
      queries.add(model[field]);
      for (const token of model[field].split(/\s+/)) queries.add(token);
    }
  }
  for (const query of queries) {
    assert.deepEqual(
      slugs(props.models.filter(model => search.matchBikeModel(model, query))),
      slugs(modelData.BIKE_MODELS.filter(model => search.matchBikeModel(model, query))),
      query,
    );
  }
  assert.equal(props.models.some(item => 'description' in item || 'checkPoints' in item || 'meritPoints' in item), false);
});

test('model aliases, price and summary searches remain available', () => {
  const models = ModelLinkGrid({}).props.models;
  const results = query => slugs(models.filter(model => search.matchBikeModel(model, query)));
  assert.ok(results('피씨엑스').includes('pcx125'));
  assert.ok(results('엔맥스').some(slug => slug.includes('nmax')));
  assert.ok(results('국민').includes('pcx125'));
  assert.ok(results('340만').includes('pcx125'));
  assert.deepEqual(results('없는모델'), []);
});
