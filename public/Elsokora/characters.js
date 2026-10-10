const CHARACTERS = [
  // ==========================================================
  // MEGLÉVŐ KARAKTEREK
  // ==========================================================

  {
    id: "orion",
    name: "Orion",
    faction: "UNIVERSUM",
    hp: 1890,
    minDmg: 310,
    maxDmg: 490,
    passive: "Különleges képesség: később automatizálható."
  },
  {
    id: "lyra",
    name: "Lyra",
    faction: "UNIVERSUM",
    hp: 1860,
    minDmg: 295,
    maxDmg: 395,
    passive: "Különleges képesség: később automatizálható."
  },
  {
    id: "atlas",
    name: "Atlas – A Viharok Titánja",
    faction: "UNIVERSUM",
    hp: 1930,
    minDmg: 370,
    maxDmg: 420,
    passive: "Csak 2 / 3 / 5 dobásnál sebezhető; később automatizálható."
  },
  {
    id: "aurelyn",
    name: "Aurelyn – A Fény Ítélete",
    faction: "UNIVERSUM",
    hp: 1930,
    minDmg: 280,
    maxDmg: 600,
    passive: "0 HP-nál visszatámadás; 50% HP alatt sebzésbuff – később automatizálható."
  },
  {
    id: "airok",
    name: "Airok – A Vihar Szarva",
    faction: "WIND",
    hp: 1897,
    minDmg: 345,
    maxDmg: 415,
    passive: "Dobása nem módosítható; kihívása és támadása nem akadályozható."
  },
  {
    id: "drevan",
    name: "Drevan – A Pikafal Őre",
    faction: "STEEL",
    hp: 1995,
    minDmg: 330,
    maxDmg: 390,
    passive: "Dobásfüggő Pikafal-hatás – később automatizálható."
  },
  {
    id: "asteria",
    name: "Asteria – Örök Égbolt Úrnője",
    faction: "UNIVERSUM",
    hp: 1950,
    minDmg: 250,
    maxDmg: 350,
    passive: "Győzelem után az ellenfél sebző passzívjai 50%-os hatékonysággal működnek."
  },

  // ==========================================================
  // LEAF
  // ==========================================================

  {
    id: "elycorn",
    name: "Elycorn – Az Erdő Tiszta Szarva",
    faction: "LEAF",
    hp: 1977,
    minDmg: 299,
    maxDmg: 475,
    passive: "1× felezhet egy LEAF szövetségest érő passzív sebzést vagy debuffot; a célpont +50 HP."
  },
  {
    id: "elaria",
    name: "Elaria – Az Erdő Pajzsa",
    faction: "LEAF",
    hp: 1880,
    minDmg: 290,
    maxDmg: 440,
    passive: "Bejövő támadás: −5 DMG/kör. 4. körben az ellenfél első 3 dobásának összege ×10."
  },
  {
    id: "gaelia",
    name: "Gaelia – Az Ősfa Leánya",
    faction: "LEAF",
    hp: 1950,
    minDmg: 300,
    maxDmg: 350,
    passive: "Ikervirág: testvér sebződésekor +30 HP/kör; együtt +50 DMG; testvér halálakor ő is meghal."
  },
  {
    id: "galena",
    name: "Galena – Az Ősfa Leánya",
    faction: "LEAF",
    hp: 1950,
    minDmg: 250,
    maxDmg: 350,
    passive: "Ikervirág: testvér sebződésekor +50 HP; együtt +30 DMG; testvér halálakor ő is meghal."
  },
  {
    id: "sylven",
    name: "Sylven – A Félvér Gyermek",
    faction: "LEAF",
    hp: 1600,
    minDmg: 120,
    maxDmg: 220,
    passive: "Halálakor a következő ellenfél dobása −1, maximum 2 körig."
  },
  {
    id: "brokkar",
    name: "Brokkar – A Gyökérrúnák Mestere",
    faction: "LEAF",
    hp: 2000,
    minDmg: 250,
    maxDmg: 400,
    passive: "Páros dobás: +1 Rune. 3 Rune után: +100 DMG / −50 kapott DMG / +20 HP körönként."
  },
  {
    id: "durgrim",
    name: "Durgrim – A Zúzó Kovács",
    faction: "LEAF",
    hp: 2000,
    minDmg: 350,
    maxDmg: 450,
    passive: "Ha a dobása nagyobb az ellenfél dobásánál: +100 DMG."
  },
  {
    id: "aelithra",
    name: "Aelithra – A Szél Táncosa",
    faction: "LEAF",
    hp: 2050,
    minDmg: 250,
    maxDmg: 450,
    passive: "Dobás alapján DMG módosító: 1 −20, 2 −10, 3 0, 4 +20, 5 +40, 6 +60."
  },
  {
    id: "sylthara",
    name: "Sylthara – A Gyökerek Anyja",
    faction: "LEAF",
    hp: 2100,
    minDmg: 300,
    maxDmg: 400,
    passive: "Ha az ellenfél 3-at vagy 5-öt dob, a következő dobása ugyanaz. 6-tal megszabadul."
  },
  {
    id: "lunareth",
    name: "Lunareth – A Harmat Lelke",
    faction: "LEAF",
    hp: 1800,
    minDmg: 250,
    maxDmg: 400,
    passive: "Páratlan saját dobás után az ellenfél következő dobása párosnál −1, páratlannál −2."
  },
  {
    id: "aeloria",
    name: "Aeloria – Azure Suttogó",
    faction: "LEAF",
    hp: 2100,
    minDmg: 150,
    maxDmg: 500,
    passive: "Frakciófüggő bónusz: FIRE +50, WIND +35, UNIVERSUM +40, BLACK HOLE +35, STEEL +40 DMG; LEAF +50 HP."
  },
  {
    id: "taygete",
    name: "Taygete – A Vadon Futója",
    faction: "LEAF",
    hp: 1895,
    minDmg: 330,
    maxDmg: 390,
    passive: "4–6 saját dobás bónuszt épít; ellenfél 1–3 dobása csökkenti a DMG bónuszt."
  },
  {
    id: "elektra",
    name: "Élektra – A Viharos Nővér",
    faction: "LEAF",
    hp: 1880,
    minDmg: 300,
    maxDmg: 440,
    passive: "Szövetséges nővér halálakor automatikusan ő lesz a következő PVP támadó."
  },
  {
    id: "maia",
    name: "Maia – A Legidősebb Nővér",
    faction: "LEAF",
    hp: 1910,
    minDmg: 290,
    maxDmg: 420,
    passive: "Amíg él, a szövetséges Királynő +100 HP és nem hívható ki."
  },
  {
    id: "kelaino",
    name: "Kelainó – A Sötét Tollú",
    faction: "LEAF",
    hp: 1880,
    minDmg: 390,
    maxDmg: 400,
    passive: "Minden kör végén −100 HP. Utolsó körben bizonyos ellenfél-dobásoknál mindketten veszítenek."
  },
  {
    id: "alkuone",
    name: "Alküoné – A Nyugalom",
    faction: "LEAF",
    hp: 2000,
    minDmg: 350,
    maxDmg: 395,
    passive: "Amíg él, utolsó körben szövetségesei csak MIN DMG-et kaphatnak."
  },

  // ==========================================================
  // FIRE
  // ==========================================================

  {
    id: "veyn",
    name: "Veyn – A Vörös Kések Táncosa",
    faction: "FIRE",
    hp: 1850,
    minDmg: 350,
    maxDmg: 450,
    passive: "Dobásfüggő DMG: 1 +60, 2 +50, 3 +30, 4 +10, 5 −20, 6 −40."
  },
  {
    id: "vireyla",
    name: "Vireyla – A Bíbor Kék Királynő",
    faction: "FIRE",
    hp: 1950,
    minDmg: 310,
    maxDmg: 410,
    passive: "Dobás ×10 DMG; 1 vagy 3 dobásnál +50 DMG. Női karakterek fix +20 DMG."
  },
  {
    id: "ragnar",
    name: "Ragnar – A Vaskezű",
    faction: "FIRE",
    hp: 1700,
    minDmg: 530,
    maxDmg: 550,
    passive: "2 kör után minden további körben −50 DMG."
  },
  {
    id: "kaor",
    name: "Kaor – A Csont Katona",
    faction: "FIRE",
    hp: 1650,
    minDmg: 200,
    maxDmg: 300,
    passive: "Halálakor a következő saját egység +50 MAX DMG-et kap 2 körig."
  },
  {
    id: "tzekar",
    name: "Tzekar – A Kilencedik Nap Harcosa",
    faction: "FIRE",
    hp: 1900,
    minDmg: 300,
    maxDmg: 450,
    passive: "HP-számjegyekhez kötött dobás ×10 DMG és speciális első támadás bónusz."
  },
  {
    id: "zalethra",
    name: "Zalethra – A Lelkek Táncosa",
    faction: "FIRE",
    hp: 1850,
    minDmg: 280,
    maxDmg: 400,
    passive: "50% HP alatt 1 körig +100 DMG; 200 HP alatt kör végén +100 HP."
  },
  {
    id: "drogath",
    name: "Drogath – A Vörös Horda Ura",
    faction: "FIRE",
    hp: 1800,
    minDmg: 250,
    maxDmg: 350,
    passive: "Amíg él, minden szövetséges +100 HP. Ha támadják, +100 DMG 2 körig."
  },
  {
    id: "drogara",
    name: "Drogara – A Vörös Törzsek Anyja",
    faction: "FIRE",
    hp: 1950,
    minDmg: 250,
    maxDmg: 350,
    passive: "FIRE szövetséges győzelme után minden FIRE szövetséges +50 DMG a következő körben."
  },
  {
    id: "karvok",
    name: "Karvok – Az Ördög Jobb Keze",
    faction: "FIRE",
    hp: 1900,
    minDmg: 285,
    maxDmg: 375,
    passive: "Ha mindkét kéz életben van: HP 1600-ra csökken és +150 DMG."
  },
  {
    id: "varok",
    name: "Varok – Az Ördög Bal Keze",
    faction: "FIRE",
    hp: 1900,
    minDmg: 285,
    maxDmg: 380,
    passive: "Ha mindkét kéz életben van: HP 1600-ra csökken és +150 DMG."
  },
  {
    id: "ignis",
    name: "Ignis – A Pokoli Harag",
    faction: "FIRE",
    hp: 1881,
    minDmg: 299,
    maxDmg: 452,
    passive: "Minden elszenvedett sebzés után +40 DMG a játék végéig; 800 HP alatt páratlan dobással is MAX DMG."
  },
  {
    id: "taria",
    name: "Taria – A Véres Penge",
    faction: "FIRE",
    hp: 1790,
    minDmg: 305,
    maxDmg: 430,
    passive: "Páros dobás után a következő körben MIN és MAX DMG +40."
  }
];