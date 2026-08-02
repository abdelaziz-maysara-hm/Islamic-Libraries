import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const ignoredDirectories = new Set(['.git', 'node_modules', '.wrangler']);
const nonPageHtmlFiles = new Set(['_template.html', 'google13bfab5b748f9e58.html', 'quran-reciters.html']);

function collectFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) return [];
    const absolutePath = join(directory, entry.name);
    return entry.isDirectory() ? collectFiles(absolutePath) : [absolutePath];
  });
}

function fail(message) {
  throw new Error(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function resolveInternalTarget(htmlFile, href) {
  const cleanHref = href.split('#')[0].split('?')[0];
  if (!cleanHref) return null;
  if (/^(?:[a-z]+:|\/\/)/i.test(cleanHref)) return null;

  let target = cleanHref.startsWith('/')
    ? join(root, cleanHref.slice(1))
    : resolve(dirname(htmlFile), cleanHref);

  if (target.endsWith('/') || (existsSync(target) && statSync(target).isDirectory())) {
    target = join(target, 'index.html');
  }

  return target;
}

const files = collectFiles(root);
const htmlFiles = files.filter((file) =>
  extname(file) === '.html' && !nonPageHtmlFiles.has(relative(root, file).replaceAll('\\', '/')),
);
const jsFiles = files.filter((file) => extname(file) === '.js');

for (const jsFile of jsFiles) {
  execFileSync(process.execPath, ['--check', jsFile], { stdio: 'pipe' });
}

const brokenLinks = [];
const canonicalUrls = [];
for (const htmlFile of htmlFiles) {
  const source = readFileSync(htmlFile, 'utf8');
  const label = relative(root, htmlFile);

  assert(/<!doctype html>/i.test(source), `${label}: missing HTML doctype`);
  assert(/<html\b[^>]*\blang=["'][^"']+["']/i.test(source), `${label}: missing document language`);
  assert(/<title>\s*[^<]+\s*<\/title>/i.test(source), `${label}: missing title`);
  assert(/<meta\b[^>]*\bname=["']description["']/i.test(source), `${label}: missing meta description`);
  assert(/<link\b[^>]*\brel=["']canonical["']/i.test(source), `${label}: missing canonical URL`);
  assert(/<main(?:\s|>)/i.test(source), `${label}: missing main landmark`);
  const canonicalMatches = [...source.matchAll(/<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']([^"']+)["'][^>]*>/gi)];
  assert(canonicalMatches.length === 1, `${label}: expected exactly one canonical URL`);
  const canonicalUrl = canonicalMatches[0][1];
  assert(canonicalUrl.startsWith('https://islamiclibraries.com/'), `${label}: canonical URL uses an unexpected domain`);
  canonicalUrls.push(canonicalUrl);

  const requiredSocialMetadata = [
    ['Open Graph type', /<meta\b[^>]*\bproperty=["']og:type["'][^>]*\bcontent=["'][^"']+["']/i],
    ['Open Graph title', /<meta\b[^>]*\bproperty=["']og:title["'][^>]*\bcontent=["'][^"']+["']/i],
    ['Open Graph description', /<meta\b[^>]*\bproperty=["']og:description["'][^>]*\bcontent=["'][^"']+["']/i],
    ['Open Graph locale', /<meta\b[^>]*\bproperty=["']og:locale["'][^>]*\bcontent=["'][^"']+["']/i],
    ['Twitter card', /<meta\b[^>]*\bname=["']twitter:card["'][^>]*\bcontent=["'][^"']+["']/i],
    ['Twitter title', /<meta\b[^>]*\bname=["']twitter:title["'][^>]*\bcontent=["'][^"']+["']/i],
    ['Twitter description', /<meta\b[^>]*\bname=["']twitter:description["'][^>]*\bcontent=["'][^"']+["']/i],
  ];
  for (const [metadataName, pattern] of requiredSocialMetadata) {
    assert(pattern.test(source), `${label}: missing ${metadataName}`);
  }
  const ogUrl = source.match(/<meta\b[^>]*\bproperty=["']og:url["'][^>]*\bcontent=["']([^"']+)["']/i)?.[1];
  assert(ogUrl === canonicalUrl, `${label}: og:url must match the canonical URL`);

  const structuredDataBlocks = [...source.matchAll(/<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  assert(structuredDataBlocks.length > 0, `${label}: missing JSON-LD structured data`);
  for (const block of structuredDataBlocks) {
    assert(!block[1].includes('yourdomain.com'), `${label}: structured data contains a placeholder domain`);
    try {
      JSON.parse(block[1]);
    } catch (error) {
      fail(`${label}: invalid JSON-LD (${error.message})`);
    }
  }

  for (const match of source.matchAll(/\bhref\s*=\s*["']([^"']+)["']/gi)) {
    const href = match[1].trim();
    if (href.includes('${')) continue;
    const target = resolveInternalTarget(htmlFile, href);
    if (target && !existsSync(target)) brokenLinks.push(`${label} -> ${href}`);
  }
}

const manifestPath = join(root, 'manifest.webmanifest');
const serviceWorkerPath = join(root, 'sw.js');
assert(existsSync(manifestPath), 'manifest.webmanifest is missing');
assert(existsSync(serviceWorkerPath), 'sw.js is missing');

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
assert(manifest.name && manifest.short_name, 'Web app manifest requires name and short_name');
assert(manifest.start_url && manifest.scope, 'Web app manifest requires start_url and scope');
assert(Array.isArray(manifest.icons) && manifest.icons.length > 0, 'Web app manifest requires an icon');
for (const icon of manifest.icons) {
  assert(icon.src && existsSync(resolve(root, icon.src)), `Manifest icon is missing: ${icon.src || '(empty)'}`);
}
assert(
  readFileSync(join(root, 'assets/js/main.js'), 'utf8').includes('navigator.serviceWorker.register'),
  'Shared application script does not register the service worker',
);
assert(existsSync(join(root, 'robots.txt')), 'robots.txt is missing');
assert(existsSync(join(root, 'sitemap.xml')), 'sitemap.xml is missing');
const sitemapSource = readFileSync(join(root, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemapSource.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert(new Set(sitemapUrls).size === sitemapUrls.length, 'sitemap.xml contains duplicate URLs');
for (const canonicalUrl of canonicalUrls) {
  assert(sitemapUrls.includes(canonicalUrl), `sitemap.xml is missing canonical URL: ${canonicalUrl}`);
}
for (const sitemapUrl of sitemapUrls) {
  assert(canonicalUrls.includes(sitemapUrl), `sitemap.xml contains a non-canonical page: ${sitemapUrl}`);
}
assert(brokenLinks.length === 0, `Broken internal links:\n${brokenLinks.join('\n')}`);

console.log(`Validation passed: ${htmlFiles.length} HTML files, ${jsFiles.length} JavaScript files, and all internal links.`);
