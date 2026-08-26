// ==========================================================
// KARAKTEREK
// ==========================================================
// ÚJ KARAKTER HOZZÁADÁSA:
// Másolj le egy teljes { ... } blokkot, és írd át az adatokat.
//
// Kötelező mezők:
// id      = egyedi technikai név, ékezet és szóköz nélkül
// name    = a karakter neve
// faction = frakció
// hp      = kezdő HP
// minDmg  = minimum sebzés
// maxDmg  = maximum sebzés
// passive = rövid képességleírás
//
// A playtest automatikusan megjeleníti az új karaktert.
// ==========================================================

const CHARACTERS = [
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
];