# Az Elsők Kora – saját domain és weboldal

## Elkészült kód

`npm run build` elkészíti a kizárólag AEK-t tartalmazó `site/` weboldalt. A nyolc oldal, hat frakció kártyaképei és playmat egyben költöznek. A lapkereső és játékasztal a helyi `data/cards.json` fájlt használja; nincs GitHub API-függőség. Új kártyakép után új build/deploy szükséges.

`npm start` automatikusan buildel, majd a `PORT` környezeti változó szerinti porton kiszolgálja az oldalt. A Redőnybot kalkulátora, API-jai és forrásfájljai nem részei a kiszolgált weboldalnak. A korábbi botfájlok a git történetben és forrásban megmaradnak, de a szerver kizárólag a `site/` könyvtárat szolgálja ki.

A fő domain: `https://azelsokkora.hu`. Minden oldal saját title, description, canonical, Open Graph és JSON-LD adatot kap. Robots és sitemap elkészül. A még kitöltetlen kapcsolat- és termékoldal noindex jelzést kap. A hiányzó régi `playtest.html` és a verziózott szobacímek az aktuális virtuális játékasztalra irányítanak. A játékasztal meglévő funkciói megmaradnak; új többgépes szinkronizáció nem készült.

## Élesítés – a hozzáférések birtokában

1. A Renderben azonosítani kell a jelenlegi szolgáltatást és a régi domain bekötését. A DNS-zónát Rackhostban ellenőrizni kell: jelenlegi A/AAAA/CNAME rekordok, emailhez használt rekordok, www. A jelenlegi értékeket rögzíteni kell a visszaállításhoz.
2. A változtatások telepítésekor az eddigi bot főoldala is AEK főoldalra vált. Előbb a Render előnézeti vagy szolgáltatási címén ellenőrizni kell a buildet, a lapkeresőt és a játékasztalt. Build: `npm run build`; start: `npm start`. A `REDIRECT_TO_CANONICAL` egyelőre ne legyen true.
3. A Render szolgáltatásban hozzáadni az `azelsokkora.hu` és szükség esetén `www.azelsokkora.hu` custom domaineket. Kizárólag a Render által ténylegesen megadott DNS-értékeket beállítani Rackhostban; IP-t vagy CNAME-célt tilos előre kitalálni. Az email rekordokat változatlanul kell hagyni.
4. Megvárni és ellenőrizni a DNS-hitelesítést és az érvényes HTTPS-t. A főoldal, lapkereső, kártyaképek, játékasztal, robots és sitemap legyen elérhető az új domainen.
5. Csak ezután `REDIRECT_TO_CANONICAL=true`, újraindítás/deploy. A www, Render és megőrzött régi domain kérései 301-gyel az új domainre kerülnek; az `/Elsokora/` előtag eltűnik. A régi domain DNS-ét és HTTPS-ét az átirányítás működéséhez fenn kell tartani. A domain lemondása ettől külön döntés.
6. Google Search Console-ban az új domain tulajdonjogát igazolni és az `https://azelsokkora.hu/sitemap.xml` címet beküldeni. Ha a régi domain más tartalmakat is szolgált ki, a teljes domain költözését jelentő művelet csak megfelelő scope esetén használható. A kereső találati címeinek és helyezéseinek változása nem azonnali és nem garantálható.

## Ellenőrzés

`npm test`: helyi HTTP-kiszolgálás, az összes 109 kártyakép és hat frakció, belső linkek, playmat, inline JS szintaxis, metadata, átirányítások, megszüntetett botvégpontok, feltételes domainátirányítás.

## Állapot

A kód önmagában nem állít át DNS-t, nem mond le domaint és nem igazol Search Console tulajdonjogot. Ezeket az éles fiókokban külön kell végrehajtani. Hozzáférés nélkül nem tekinthetők késznek.
