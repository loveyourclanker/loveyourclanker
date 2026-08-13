// Rebuild-on-change plus a static file server. No dependencies.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { build } from './build.mjs';

const PORT = Number(process.env.PORT) || 4321;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.ico': 'image/x-icon',
};

function rebuild() {
  const t = Date.now();
  try {
    build({ quiet: true });
    console.log(`rebuilt in ${Date.now() - t}ms`);
  } catch (err) {
    console.error(`\n  build failed\n  ${err.message}\n`);
  }
}

rebuild();
for (const dir of ['patterns', 'content', 'site', 'static']) {
  fs.watch(dir, { recursive: true }, () => {
    clearTimeout(globalThis.__t);
    globalThis.__t = setTimeout(rebuild, 60);
  });
}

http
  .createServer((req, res) => {
    let rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (rel.endsWith('/')) rel += 'index.html';
    const file = path.join('dist', rel);
    if (!path.resolve(file).startsWith(path.resolve('dist'))) {
      res.writeHead(403).end('forbidden');
      return;
    }
    fs.readFile(file, (err, buf) => {
      if (err) {
        res.writeHead(404, { 'content-type': 'text/plain' }).end('404');
        return;
      }
      res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
      res.end(buf);
    });
  })
  .listen(PORT, () => console.log(`dev  http://localhost:${PORT}`));
