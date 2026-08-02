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
for (const htmlFile of htmlFiles) {
  const source = readFileSync(htmlFile, 'utf8');
  const label = relative(root, htmlFile);

  assert(/<!doctype html>/i.test(source), `${label}: missing HTML doctype`);
  assert(/<html\b[^>]*\blang=["'][^"']+["']/i.test(source), `${label}: missing document language`);
  assert(/<title>\s*[^<]+\s*<\/title>/i.test(source), `${label}: missing title`);
  assert(/<meta\b[^>]*\bname=["']description["']/i.test(source), `${label}: missing meta description`);
  assert(/<link\b[^>]*\brel=["']canonical["']/i.test(source), `${label}: missing canonical URL`);
  assert(/<main(?:\s|>)/i.test(source), `${label}: missing main landmark`);

  for (const match of source.matchAll(/\bhref\s*=\s*["']([^"']+)["']/gi)) {
    const href = match[1].trim();
    if (href.includes('${')) continue;
    const target = resolveInternalTarget(htmlFile, href);
    if (target && !existsSync(target)) brokenLinks.push(`${label} -> ${href}`);
  }
}

assert(existsSync(join(root, 'robots.txt')), 'robots.txt is missing');
assert(existsSync(join(root, 'sitemap.xml')), 'sitemap.xml is missing');
assert(brokenLinks.length === 0, `Broken internal links:\n${brokenLinks.join('\n')}`);

console.log(`Validation passed: ${htmlFiles.length} HTML files, ${jsFiles.length} JavaScript files, and all internal links.`);
