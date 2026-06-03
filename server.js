const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;
const VAT = 0.27;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --------------------------------------------------
// TERMÉKEK
// --------------------------------------------------

const products = {
  fa_redony: {
    name: 'Fa redőny',
    type: 'm2',
    price: 72000,
    note: 'Nagyon jól szigetel. Profil: műemléki, babás vagy sima íves. A profilok nem jelentenek többletköltséget.'
  },

  alu_redony: {
    name: 'Alumínium redőny - komplett külső tokos alapár',
    type: 'm2',
    price: 34000,
    note: 'Jól szigetel. Profil: perforált vagy sima.'
  },

  alu_redony_szunyoghalo: {
    name: 'Alumínium redőny + szúnyogháló',
    type: 'm2',
    price: 43000,
    note: 'Komplett külső tokos alumínium redőny tokban épített szúnyoghálóval.'
  },

  vakolhato_redony: {
    name: 'Vakolható tokos alumínium redőny',
    type: 'm2',
    price: 35000,
    note: 'Vakolható tokos kivitel.'
  },

  fa_tok: {
    name: 'Fa dekli / Fa tok',
    type: 'fm3sum',
    price: 59000,
    note: 'Egyedi rendelés. Anyag: fenyő + vizáló MDF. Felületkezelés: pácolt vagy festett.'
  },

  mobil_szunyoghalo: {
    name: 'Mobil rendszerű szúnyogháló',
    type: 'm2',
    price: 21000,
    note: 'Fehér vagy barna kivitel.'
  },

  fix_szunyoghalo: {
    name: 'Fix keretes szúnyogháló',
    type: 'm2',
    price: 12000,
    note: 'Fix keretes kivitel.'
  },

  oldalhuzos_szunyoghalo: {
    name: 'Oldal / dupla oldalhúzós szúnyogháló ajtó',
    type: 'm2',
    price: 25000,
    note: 'Oldalhúzós vagy dupla oldalhúzós ajtó kivitel.'
  },

  plisze_szunyoghalo: {
    name: 'Pliszé rendszerű szúnyogháló ajtó',
    type: 'm2',
    price: 49500,
    note: 'Pliszé rendszerű ajtó kivitel.'
  }
};

// --------------------------------------------------
// MOTOROK
// --------------------------------------------------

const motors = {
  smart: {
    name: 'SMART rádiós motor',
    price: 50000
  },

  somfy: {
    name: 'SOMFY rádiós motor',
    price: 85000
  }
};

// --------------------------------------------------
// VEZÉRLÉS
// --------------------------------------------------

const controllers = {
  smart_single: {
    name: 'SMART távirányító - egycsatornás',
    price: 6000
  },

  smart_multi: {
    name: 'SMART távirányító - többcsatornás',
    price: 28000
  },

  somfy_single: {
    name: 'SOMFY távirányító - egycsatornás',
    price: 18000
  },

  somfy_multi: {
    name: 'SOMFY távirányító - többcsatornás',
    price: 30000
  }
};

// --------------------------------------------------
// EGYÉB KÖLTSÉGEK
// --------------------------------------------------

const extras = {
  sin: {
    name: 'Redőny megvezető sín 23x23 acél',
    type: 'fm',
    price: 6500
  },

  kitamaszto: {
    name: 'Kitámasztó kézi plusz',
    type: 'db',
    price: 49000
  },

  szerkezet_csere: {
    name: 'Tokban tartó szerkezet csere',
    type: 'db',
    price: 20000
  },

  bontas: {
    name: 'Régi szerkezet bontás + elszállítás',
    type: 'db',
    price: 10000
  },

  kezeles_beepites: {
    name: 'Új redőny beépítés kézi kezeléssel',
    type: 'db',
    price: 15000
  },

  motoros_beepites: {
    name: 'Motoros redőny beépítése',
    type: 'db',
    price: 20000
  },

  bevesos_automata: {
    name: 'Bevésős automata eloxált fedlap + belső rugó',
    type: 'db',
    price: 10000
  },

  szunyoghalo_szereles: {
    name: 'Szúnyogháló szerelés',
    type: 'db',
    price: 5000
  }
};

// --------------------------------------------------
// SEGÉDFÜGGVÉNYEK
// --------------------------------------------------

function calculateM2(width, height, price) {
  const m2 = (width * height) / 10000;

  return {
    unitLabel: `${round2(m2)} m2`,
    unitValue: round2(m2),
    total: Math.round(m2 * price)
  };
}

function calculateFaTokFM(width, height, depth, price) {
  const fm = (width + height + depth) / 100;

  return {
    unitLabel: `${round2(fm)} fm`,
    unitValue: round2(fm),
    total: Math.round(fm * price)
  };
}

function calculateFM(fm, price) {
  return {
    unitLabel: `${round2(fm)} fm`,
    unitValue: round2(fm),
    total: Math.round(fm * price)
  };
}

function calculateDB(db, price) {
  return {
    unitLabel: `${db} db`,
    unitValue: db,
    total: Math.round(db * price)
  };
}

function round2(value) {
  return Number(value.toFixed(2));
}

function formatPrice(value) {
  return Math.round(value).toLocaleString('hu-HU') + ' Ft';
}

function getGross(net) {
  return Math.round(net * (1 + VAT));
}

function getVat(net) {
  return Math.round(net * VAT);
}

// --------------------------------------------------
// FŐOLDAL
// --------------------------------------------------

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --------------------------------------------------
// ÁRKALKULÁCIÓ
// --------------------------------------------------

app.post('/calculate', (req, res) => {
  try {
    const {
      product,
      width,
      height,
      depth,
      motor,
      controller,
      extra,
      extraAmount,
      gross
    } = req.body;

    const selectedProduct = products[product];

    if (!selectedProduct) {
      return res.status(400).json({
        error: 'Ismeretlen termék.'
      });
    }

    let net = 0;
    const lines = [];

    // --------------------------------------------------
    // ALAPTERMÉK SZÁMOLÁS
    // --------------------------------------------------

    if (selectedProduct.type === 'm2') {
      if (!width || !height) {
        return res.status(400).json({
          error: 'Ehhez a termékhez szélesség és magasság szükséges cm-ben.'
        });
      }

      const calc = calculateM2(Number(width), Number(height), selectedProduct.price);
      net += calc.total;

      lines.push({
        name: selectedProduct.name,
        type: 'm2',
        quantity: calc.unitLabel,
        unit_price: formatPrice(selectedProduct.price),
        total: formatPrice(calc.total)
      });
    }

    if (selectedProduct.type === 'fm3sum') {
      if (!width || !height || !depth) {
        return res.status(400).json({
          error: 'Fa tokhoz szélesség, magasság és mélység szükséges cm-ben.'
        });
      }

      const calc = calculateFaTokFM(
        Number(width),
        Number(height),
        Number(depth),
        selectedProduct.price
      );

      net += calc.total;

      lines.push({
        name: selectedProduct.name,
        type: 'fm',
        quantity: calc.unitLabel,
        unit_price: formatPrice(selectedProduct.price),
        total: formatPrice(calc.total)
      });
    }

    // --------------------------------------------------
    // MOTOR
    // --------------------------------------------------

    if (motor && motors[motor]) {
      net += motors[motor].price;

      lines.push({
        name: motors[motor].name,
        type: 'db',
        quantity: '1 db',
        unit_price: formatPrice(motors[motor].price),
        total: formatPrice(motors[motor].price)
      });
    }

    // --------------------------------------------------
    // VEZÉRLÉS
    // --------------------------------------------------

    if (controller && controllers[controller]) {
      net += controllers[controller].price;

      lines.push({
        name: controllers[controller].name,
        type: 'db',
        quantity: '1 db',
        unit_price: formatPrice(controllers[controller].price),
        total: formatPrice(controllers[controller].price)
      });
    }

    // --------------------------------------------------
    // EGYÉB KÖLTSÉG
    // --------------------------------------------------

    if (extra && extras[extra]) {
      const selectedExtra = extras[extra];
      const amount = Number(extraAmount || 0);

      if (!amount || amount <= 0) {
        return res.status(400).json({
          error: 'Egyéb költség választásakor meg kell adni a mennyiséget is.'
        });
      }

      let calc;

      if (selectedExtra.type === 'fm') {
        calc = calculateFM(amount, selectedExtra.price);
      } else {
        calc = calculateDB(amount, selectedExtra.price);
      }

      net += calc.total;

      lines.push({
        name: selectedExtra.name,
        type: selectedExtra.type,
        quantity: calc.unitLabel,
        unit_price: formatPrice(selectedExtra.price),
        total: formatPrice(calc.total)
      });
    }

    const vat = getVat(net);
    const grossPrice = getGross(net);

    res.json({
      success: true,
      product: selectedProduct.name,
      note: selectedProduct.note,
      lines,
      net_price: formatPrice(net),
      vat_price: formatPrice(vat),
      gross_price: formatPrice(grossPrice),
      final_price: gross ? formatPrice(grossPrice) : formatPrice(net),
      price_mode: gross ? 'bruttó' : 'nettó'
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Szerver hiba.'
    });
  }
});

// --------------------------------------------------
// LISTÁZÓ API-K
// --------------------------------------------------

app.get('/products', (req, res) => {
  res.json(products);
});

app.get('/motors', (req, res) => {
  res.json(motors);
});

app.get('/controllers', (req, res) => {
  res.json(controllers);
});

app.get('/extras', (req, res) => {
  res.json(extras);
});

// --------------------------------------------------
// INDÍTÁS
// --------------------------------------------------

app.listen(PORT, () => {
  console.log(`Szerver fut: http://localhost:${PORT}`);
});