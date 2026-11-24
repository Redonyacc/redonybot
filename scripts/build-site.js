const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = path.join(root, 'public/Elsokora');
const output = path.join(root, 'site');
const origin = 'https://azelsokkora.hu';
const factions = [
  ['universum', 'Universum', 'images/cards/universum'],
  ['blackhole', 'Black Hole', 'blackhole'], ['leaf', 'Leaf', 'leaf'],
  ['fire', 'Fire', 'fire'], ['wind', 'Wind', 'wind'], ['steel', 'Steel', 'steel']
];
const pages = {
  'index.html': ['Az Elsők Kora – Taktikai fantasy kártyajáték', 'Ismerd meg Az Elsők Kora világát, hat frakcióját, karaktereit és taktikai kártyacsatáit. Játékszabályok, lapkereső és virtuális játékasztal.'],
  'lapkereso.html': ['Lapkereső | Az Elsők Kora', 'Az Elsők Kora kártyái mind a hat frakcióból. Keress karakterre vagy frakcióra, és nagyítsd ki a kártyákat.'],
  'szabalyok.html': ['Játékszabályok | Az Elsők Kora', 'Az Elsők Kora kártyajáték alapszabályai: dobókocka, sebzés, karakterek, passzív képességek és taktikai döntések.'],
  'elsok-kora-bemutato.html': ['A játék története | Az Elsők Kora', 'Ismerd meg Az Elsők Kora saját fejlesztésű fantasy kártyajáték történetét és világát.'],
  'online-play.html': ['Virtuális játékasztal | Az Elsők Kora', 'Az Elsők Kora virtuális játékasztala: kártyaválasztás, playmat, dobókocka, körszámláló és kézi HP-kezelés.'],
  'kapcsolat.html': ['Kapcsolat | Az Elsők Kora', 'Tesztjáték, bemutató és együttműködés Az Elsők Kora kártyajátékhoz.'],
  'tortenetek.html': ['Karaktertörténetek | Az Elsők Kora', 'Az Elsők Kora fantasy világának karakterei és történetei.'],
  'termekeink.html': ['Kártyák és kiadások | Az Elsők Kora', 'Az Elsők Kora kártyái és tervezett kiadásai.']
};
const escape = s => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
fs.rmSync(output, {recursive: true, force: true});
fs.mkdirSync(output, {recursive: true});
for (const name of ['style.css', 'social-navigation.css', 'script.js', 'characters.js', 'playtest.js', 'data', 'images']) {
  fs.cpSync(path.join(source, name), path.join(output, name), {recursive: true});
}
fs.cpSync(path.join(root, 'public/images'), path.join(output, 'images'), {recursive: true});
const cards = factions.flatMap(([faction, label, folder]) => {
  if (faction !== 'universum') fs.cpSync(path.join(root, 'public', folder), path.join(output, folder), {recursive: true});
  return fs.readdirSync(path.join(root, 'public', folder)).filter(name => /\.(png|jpe?g|webp|gif)$/i.test(name)).map(filename => ({
    name: filename.replace(/\.(png|jpe?g|webp|gif)$/i, '').replace(/[_-]+/g, ' ').trim(),
    faction, label, image: '/' + folder + '/' + encodeURIComponent(filename)
  }));
});
fs.writeFileSync(path.join(output, 'data/cards.json'), JSON.stringify(cards, null, 2) + '\n');
for (const [file, [title, description]] of Object.entries(pages)) {
  let html = fs.readFileSync(path.join(source, file === 'online-play.html' ? 'online-play-szoba-v3-3.html' : file), 'utf8');
  html = html.replace(/<title>[\s\S]*?<\/title>/i, '').replace(/<meta\s+name="description"[^>]*>/gi, '');
  html = html.replaceAll('/Elsokora/', '/').replaceAll('href="index.html"', 'href="/"').replaceAll('href="./index.html"', 'href="/"');
  html = html.replaceAll('href="playtest.html"', 'href="online-play.html"');
  const canonical = origin + (file === 'index.html' ? '/' : '/' + file);
  const structured = file === 'index.html' ? {
    '@context': 'https://schema.org', '@type': 'WebSite', name: 'Az Elsők Kora', alternateName: 'AEK', url: origin + '/', inLanguage: 'hu-HU', description
  } : {'@context': 'https://schema.org', '@type': 'WebPage', name: title, url: canonical, inLanguage: 'hu-HU', isPartOf: {'@type': 'WebSite', name: 'Az Elsők Kora', url: origin + '/'}};
  html = html.replace(/<\/head>/i, `
<title>${escape(title)}</title>
<meta name="description" content="${escape(description)}">
<link rel="canonical" href="${canonical}">
<meta property="og:site_name" content="Az Elsők Kora">
<meta property="og:title" content="${escape(title)}">
<meta property="og:description" content="${escape(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:type" content="website">
<meta property="og:locale" content="hu_HU">
<script type="application/ld+json">${JSON.stringify(structured)}</script>
${['kapcsolat.html', 'termekeink.html'].includes(file) ? '<meta name="robots" content="noindex, follow">' : ''}
</head>`);
  if (file === 'index.html') html = html.replace('<a href="lapkereso.html">Lapkereső</a>', '<a href="lapkereso.html">Lapkereső</a>\n        <a href="online-play.html">Játékasztal</a>');
  if (file === 'lapkereso.html') {
    html = html.replace(/    \/\/ A fájl:[\s\S]*?    let cards = \[\];/, '    let cards = [];');
    const start = html.indexOf('    function imageUrl(');
    const end = html.indexOf('    function render(){', start);
    if (start < 0 || end < 0) throw Error('Lapkereső forrásszerkezete megváltozott');
    html = html.slice(0, start) + `    async function loadCards(){
      warning.classList.remove('visible');
      result.textContent='Kártyák beolvasása…';
      try {
        const response = await fetch('/data/cards.json');
        if(!response.ok) throw new Error(response.status);
        const loaded = await response.json();
        if(!Array.isArray(loaded)) throw new Error('Hibás kártyalista');
        cards = loaded.sort((a,b)=>a.name.localeCompare(b.name,'hu'));
      } catch(error) {
        warningText.textContent='A kártyalista nem tölthető be. Próbáld újra!';
        warning.classList.add('visible');
      }
      render();
    }
` + html.slice(end);
    html = html.replace('A képfájlneveket a nyilvános GitHub-tárhelyről olvassuk be.', 'A kártyák az Elsők Kora saját weboldaláról töltődnek be.');
  }
  if (file === 'online-play.html') {
    html = html.replace(/^if\(location.protocol==='file:'\).*\n/m, '').replace(/^const sources=\[.*\n/m, '');
    const start = html.indexOf('async function loadCards(){');
    const end = html.indexOf('function openPicker(', start);
    if (start < 0 || end < 0) throw Error('Játékasztal forrásszerkezete megváltozott');
    html = html.slice(0, start) + `async function loadCards(){
  factions.forEach(label=>{allCards[label]=[]});
  try {
    const response=await fetch('/data/cards.json');
    if(!response.ok)throw Error(response.status);
    const cards=await response.json();
    if(!Array.isArray(cards))throw Error('Hibás kártyalista');
    cards.forEach(c=>{if(allCards[c.label])allCards[c.label].push({name:c.name,src:c.image,faction:c.label})});
  } catch(error) {log('A kártyalista nem tölthető be. Frissítsd az oldalt az újrapróbáláshoz.');}
  renderPicker();
}
` + html.slice(end);
    html = html.replace('Ellenőrizd az internetet és a GitHub API-t.', 'Ellenőrizd az internetkapcsolatot, majd frissítsd az oldalt.');
    html = html.replace('<header><h1>', '<header><a href="/">← Főoldal</a><h1>');
  }
  fs.writeFileSync(path.join(output, file), html);
}
const indexed = Object.keys(pages).filter(p => !['kapcsolat.html', 'termekeink.html'].includes(p));
fs.writeFileSync(path.join(output, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + indexed.map(p=>`  <url><loc>${origin}${p === 'index.html' ? '/' : '/' + p}</loc></url>`).join('\n') + '\n</urlset>\n');
fs.writeFileSync(path.join(output, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
console.log(`Az Elsők Kora: ${Object.keys(pages).length} oldal, ${cards.length} kártya, 6 frakció → site/`);
