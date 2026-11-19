import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const outputPath = join(root, 'sitemap.xml');
const ignoredDirectories = new Set(['.git', 'node_modules', '.wrangler']);
const excludedPages = new Set([
  '_template.html',
  'book.html',
  'google13bfab5b748f9e58.html',
  'googlec09262aa424a656e.html',
  'quran-reciters.html',
  'go/miprova.html',
  'go/miprova/index.html',
]);

function collectFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) return [];
    const absolutePath = join(directory, entry.name);
    return entry.isDirectory() ? collectFiles(absolutePath) : [absolutePath];
  });
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

const staticUrls = collectFiles(root)
  .filter((file) => extname(file) === '.html')
  .filter((file) => !excludedPages.has(relative(root, file).replaceAll('\\', '/')))
  .map((file) => readFileSync(file, 'utf8'))
  .filter((source) => !/<meta\b[^>]*\bname=["']robots["'][^>]*\bcontent=["'][^"']*noindex/i.test(source))
  .map((source) => source.match(/<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']([^"']+)["']/i)?.[1])
  .filter(Boolean);

const catalogPath = join(root, 'assets', 'js', 'search-catalog.js');
if (!existsSync(catalogPath)) throw new Error('assets/js/search-catalog.js is missing');
const catalogSource = readFileSync(catalogPath, 'utf8');
const catalogJson = catalogSource.match(/window\.SEARCH_CATALOG\s*=\s*(\[[\s\S]*\]);?\s*$/)?.[1];
if (!catalogJson) throw new Error('Could not parse window.SEARCH_CATALOG');
const catalog = JSON.parse(catalogJson);

const bookUrls = catalog
  .map((entry) => String(entry.url || ''))
  .filter((url) => /^book\.html\?book=[^&#]+$/.test(url))
  .map((url) => 'https://islamiclibraries.com/' + url);

const urls = [...new Set([...staticUrls, ...bookUrls])].sort((a, b) => a.localeCompare(b, 'en'));
const output = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map((url) => '  <url><loc>' + escapeXml(url) + '</loc></url>'),
  '</urlset>',
  '',
].join('\n');

if (process.argv.includes('--check')) {
  const current = existsSync(outputPath) ? readFileSync(outputPath, 'utf8') : '';
  if (current !== output) {
    console.error('sitemap.xml is out of date. Run: npm run generate:sitemap');
    process.exit(1);
  }
  console.log('Sitemap is current: ' + urls.length + ' URLs.');
} else {
  writeFileSync(outputPath, output, 'utf8');
  console.log('Generated sitemap: ' + staticUrls.length + ' static pages and ' + bookUrls.length + ' book pages (' + urls.length + ' URLs).');
}
