const {test, before, after} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const {execFileSync} = require('node:child_process');
execFileSync(process.execPath, ['scripts/build-site.js'], {stdio: 'pipe'});
const app = require('../server');
let server, origin;
before(async () => {
  await new Promise(resolve => {server = app.listen(0, '127.0.0.1', resolve)});
  origin = `http://127.0.0.1:${server.address().port}`;
});
after(() => new Promise(resolve => server.close(resolve)));
test('all six factions, card images, playmat and page links survive migration', async () => {
  const cards = await (await fetch(origin + '/data/cards.json')).json();
  assert.equal(new Set(cards.map(c => c.faction)).size, 6);
  assert.equal(cards.length, 109);
  for (const card of cards) {
    const response = await fetch(origin + card.image, {method: 'HEAD'});
    assert.equal(response.status, 200, card.image);
    assert.match(response.headers.get('content-type'), /^image\//);
  }
  assert.equal((await fetch(origin + '/images/playmat/playmate.png')).status, 200);
  for (const filename of fs.readdirSync('site').filter(p => p.endsWith('.html'))) {
    const html = await (await fetch(origin + '/' + filename)).text();
    assert.match(html, /<link rel="canonical" href="https:\/\/azelsokkora.hu\//);
    assert.doesNotMatch(html, /redonybot|redönybot|Redonyacc|api\.github/i);
    const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
    for (const match of markup.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const link = new URL(match[1], origin + '/' + filename);
      if (link.origin === origin) assert.equal((await fetch(link, {method: 'HEAD'})).status, 200, `${filename}: ${link}`);
    }
    for (const match of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)) {
      if (match[1].includes('application/ld+json')) JSON.parse(match[2]);
      else if (!match[1].includes('src=')) new vm.Script(match[2]);
    }
  }
});
test('legacy URLs redirect locally and retain search parameters', async () => {
  for (const [from, to] of [['/Elsokora','/'], ['/Elsokora/','/'], ['/Elsokora/lapkereso.html?q=Lyra','/lapkereso.html?q=Lyra'], ['/index.html','/'], ['/playtest.html','/online-play.html'], ['/online-play-szoba-v3-3.html','/online-play.html'], ['/Elsokora//example.com','/example.com']]) {
    const response = await fetch(origin + from, {redirect: 'manual'});
    assert.equal(response.status, 301, from);
    assert.equal(response.headers.get('location'), to, from);
  }
});
test('old calculator, APIs and source files are not served', async () => {
  for (const url of ['/calculate','/products','/motors','/controllers','/extras','/kalkulator.html','/server.js','/.env']) {
    assert.equal((await fetch(origin + url)).status, 404, url);
  }
  assert.equal((await fetch(origin + '/calculate', {method: 'POST'})).status, 404);
});
test('crawler documents use only the AEK domain', async () => {
  const robots = await (await fetch(origin + '/robots.txt')).text();
  assert.match(robots, /Sitemap: https:\/\/azelsokkora.hu\/sitemap.xml/);
  const sitemap = await (await fetch(origin + '/sitemap.xml')).text();
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  assert.equal(urls.length, 6);
  for (const url of urls) {
    assert.equal(new URL(url).origin, 'https://azelsokkora.hu');
    assert.equal((await fetch(origin + new URL(url).pathname)).status, 200);
  }
});
test('canonical host redirect stays disabled until explicitly enabled', async () => {
  assert.equal((await fetch(origin + '/')).status, 200);
  process.env.REDIRECT_TO_CANONICAL = 'true';
  try {
    const response = await fetch(origin + '/lapkereso.html?q=Orion', {redirect: 'manual'});
    assert.equal(response.status, 301);
    assert.equal(response.headers.get('location'), 'https://azelsokkora.hu/lapkereso.html?q=Orion');
  } finally {delete process.env.REDIRECT_TO_CANONICAL;}
});
