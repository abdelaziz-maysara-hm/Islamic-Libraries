import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import vm from 'node:vm';

const root = resolve(import.meta.dirname, '..');
const jsRoot = join(root, 'assets', 'js');
const naturalSort = new Intl.Collator('en', { numeric: true }).compare;

function fail(message) {
  throw new Error(message);
}

function runBrowserDataFiles(files, initialWindow = {}) {
  const context = vm.createContext({ window: initialWindow, console });
  for (const file of files) {
    const source = readFileSync(join(jsRoot, file), 'utf8');
    new vm.Script(source, { filename: file }).runInContext(context);
  }
  return context.window;
}

function duplicates(values) {
  const seen = new Set();
  const repeated = new Set();
  values.forEach((value) => (seen.has(value) ? repeated.add(value) : seen.add(value)));
  return [...repeated];
}

const dataFiles = readdirSync(jsRoot);
const fatwaFiles = dataFiles
  .filter((file) => file === 'fatawa-data.js' || /^fatawa-(?:expand-old|extra)\d*\.js$/.test(file))
  .sort(naturalSort);
const fatwaWindow = runBrowserDataFiles(fatwaFiles);
const fatwas = fatwaWindow.FATAWA_DATA || [];
const categories = new Set((fatwaWindow.FATAWA_CATEGORIES || []).map((category) => category.id));

if (!fatwas.length) fail('No fatwas were loaded');
const duplicateFatwaIds = duplicates(fatwas.map((fatwa) => String(fatwa.id)));
if (duplicateFatwaIds.length) fail(`Duplicate fatwa IDs: ${duplicateFatwaIds.join(', ')}`);

const requiredFatwaFields = ['id', 'category', 'q', 'a', 'source', 'sourceUrl'];
for (const fatwa of fatwas) {
  const missing = requiredFatwaFields.filter((field) => !String(fatwa[field] ?? '').trim());
  if (missing.length) fail(`Fatwa ${fatwa.id ?? '(unknown)'} is missing: ${missing.join(', ')}`);
  if (!categories.has(fatwa.category)) fail(`Fatwa ${fatwa.id} uses unknown category: ${fatwa.category}`);
  try {
    const url = new URL(fatwa.sourceUrl);
    if (url.protocol !== 'https:') fail(`Fatwa ${fatwa.id} source URL must use HTTPS`);
  } catch {
    fail(`Fatwa ${fatwa.id} has an invalid source URL`);
  }
}

const homeSource = readFileSync(join(root, 'index.html'), 'utf8');
const advertisedFatwaCount = Number(homeSource.match(/<span class="count">(\d+)\+ فتوى<\/span>/)?.[1]);
if (!Number.isFinite(advertisedFatwaCount)) fail('Homepage fatwa count was not found');
if (advertisedFatwaCount !== fatwas.length) {
  fail(`Homepage advertises ${advertisedFatwaCount}+ fatwas, but the data files contain ${fatwas.length}`);
}

const bookWindow = runBrowserDataFiles(['books-extra.js'], { ALL_BOOKS: [] });
const localBooks = bookWindow.ALL_BOOKS || [];
const duplicateLocalBookIds = duplicates(localBooks.map((book) => String(book.id)));
if (duplicateLocalBookIds.length) fail(`Duplicate local book IDs: ${duplicateLocalBookIds.join(', ')}`);

const searchWindow = runBrowserDataFiles(['search-data.js']);
const searchEntries = searchWindow.SITE_INDEX || [];
const articleFiles = readdirSync(join(root, 'articles')).filter((file) => file.endsWith('.html'));

const inventory = {
  fatwas: fatwas.length,
  fatwaCategories: categories.size,
  localBookAdditions: localBooks.length,
  articles: articleFiles.length,
  searchEntries: searchEntries.length,
};

if (process.argv.includes('--json')) console.log(JSON.stringify(inventory, null, 2));
else console.log(`Content inventory passed: ${inventory.fatwas} fatwas in ${inventory.fatwaCategories} categories, ${inventory.localBookAdditions} local book additions, ${inventory.articles} articles, ${inventory.searchEntries} search entries.`);
