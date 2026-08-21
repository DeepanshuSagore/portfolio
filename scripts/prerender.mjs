import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadEnv } from 'vite';

const root = process.cwd();
const htmlPath = join(root, 'dist', 'index.html');
const serverEntry = join(root, 'dist-ssr', 'entry-server.js');

// Resolved exactly the way the client build resolved it, so the canonical URL
// baked into index.html and the one written into robots/sitemap cannot drift.
const siteUrl = (loadEnv('production', root, 'VITE_').VITE_SITE_URL ?? '').replace(/\/+$/, '');
if (!siteUrl) {
  throw new Error('prerender: VITE_SITE_URL is not set — refusing to ship a broken canonical URL');
}

const { render } = await import(pathToFileURL(serverEntry).href);
const markup = render();

const html = readFileSync(htmlPath, 'utf8');
const marker = '<div id="root"></div>';
if (!html.includes(marker)) {
  throw new Error('prerender: #root placeholder not found in dist/index.html');
}

writeFileSync(htmlPath, html.replace(marker, `<div id="root">${markup}</div>`));

writeFileSync(
  join(root, 'dist', 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
);

writeFileSync(
  join(root, 'dist', 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`,
);

rmSync(join(root, 'dist-ssr'), { recursive: true, force: true });

console.log(`prerendered ${markup.length} chars into dist/index.html (site: ${siteUrl})`);
