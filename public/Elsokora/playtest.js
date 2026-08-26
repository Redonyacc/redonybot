const TEAM_SIZE = 6;

let state = {
  started: false,
  round: 1,
  dice1: null,
  dice2: null,
  team1: [],
  team2: [],
  active1: 0,
  active2: 0
};

const $ = (id) => document.getElementById(id);

function cloneCharacter(base) {
  return {
    ...base,
    currentHp: base.hp
  };
}

function characterOptions(selectedId = "") {
  return [
    `<option value="">-- üres hely --</option>`,
    ...CHARACTERS.map(c =>
      `<option value="${c.id}" ${c.id === selectedId ? "selected" : ""}>${c.name} [${c.faction}]</option>`
    )
  ].join("");
}

function createTeamSelectors(containerId) {
  const container = $(containerId);
  container.innerHTML = "";

  for (let i = 0; i < TEAM_SIZE; i++) {
    const select = document.createElement("select");
    select.innerHTML = characterOptions();
    select.dataset.slot = i;
    container.appendChild(select);
  }
}

function readTeam(containerId) {
  const ids = [...$(containerId).querySelectorAll("select")]
    .map(s => s.value)
    .filter(Boolean);

  if (ids.length === 0) {
    throw new Error("Legalább 1 karaktert válassz mindkét játékosnak.");
  }

  if (new Set(ids).size !== ids.length) {
    throw new Error("Ugyanaz a karakter egy csapatban csak egyszer szerepelhet.");
  }

  return ids.map(id => cloneCharacter(CHARACTERS.find(c => c.id === id)));
}

function teamOptionMarkup(team) {
  return team.map((c, i) => {
    const dead = c.currentHp <= 0 ? " – KIÜTVE" : "";
    return `<option value="${i}" ${c.currentHp <= 0 ? "disabled" : ""}>${c.name}${dead}</option>`;
  }).join("");
}

function refreshActiveSelectors() {
  $("active1").innerHTML = teamOptionMarkup(state.team1);
  $("active2").innerHTML = teamOptionMarkup(state.team2);

  $("active1").value = state.active1;
  $("active2").value = state.active2;
}

function getActive(player) {
  const team = player === 1 ? state.team1 : state.team2;
  const index = player === 1 ? state.active1 : state.active2;
  return team[index];
}

function renderCard(player) {
  const c = getActive(player);
  const target = $(`card${player}`);

  if (!c) {
    target.innerHTML = "<p>Nincs aktív karakter.</p>";
    return;
  }

  const hpPct = Math.max(0, Math.round((c.currentHp / c.hp) * 100));

  target.innerHTML = `
    <h3>${c.name}</h3>
    <p><strong>${c.faction}</strong></p>

    <div class="stat-grid">
      <div class="stat">
        <span>HP</span>
        <strong>${Math.max(0, c.currentHp)} / ${c.hp}</strong>
      </div>
      <div class="stat">
        <span>Állapot</span>
        <strong>${c.currentHp > 0 ? "ÉL" : "0 HP"}</strong>
      </div>
      <div class="stat">
        <span>MIN DMG</span>
        <strong>${c.minDmg}</strong>
      </div>
      <div class="stat">
        <span>MAX DMG</span>
        <strong>${c.maxDmg}</strong>
      </div>
    </div>

    <div class="hpbar">
      <div class="hpfill" style="width:${hpPct}%"></div>
    </div>
    <small>${hpPct}% HP</small>

    <p><strong>Képesség:</strong><br>${c.passive}</p>
    ${c.currentHp <= 0 ? `<p class="dead">A karakter kiesett.</p>` : ""}
  `;
}

function renderAll() {
  $("round").textContent = state.round;
  $("round-type").textContent = state.round % 2 === 0 ? "Páros kör" : "Páratlan kör";
  $("dice1").textContent = state.dice1 ?? "–";
  $("dice2").textContent = state.dice2 ?? "–";

  refreshActiveSelectors();
  renderCard(1);
  renderCard(2);

  $("attack1").disabled = !state.started || state.dice1 == null || getActive(1)?.currentHp <= 0 || getActive(2)?.currentHp <= 0;
  $("attack2").disabled = !state.started || state.dice2 == null || getActive(2)?.currentHp <= 0 || getActive(1)?.currentHp <= 0;
}

function log(message) {
  const box = $("log");
  if (box.textContent === "A játék még nem indult el.") box.textContent = "";
  box.textContent = `${message}\n${box.textContent}`;
}

function roll(player) {
  if (!state.started) return;
  const value = Math.floor(Math.random() * 6) + 1;
  state[`dice${player}`] = value;

  const c = getActive(player);
  const dmgType = value % 2 === 0 ? "MAX" : "MIN";
  const dmg = value % 2 === 0 ? c.maxDmg : c.minDmg;

  log(`🎲 Játékos ${player}: ${value} → ${dmgType} DMG (${dmg})`);
  renderAll();
}

function attack(attackerPlayer) {
  const defenderPlayer = attackerPlayer === 1 ? 2 : 1;
  const attacker = getActive(attackerPlayer);
  const defender = getActive(defenderPlayer);
  const rollValue = state[`dice${attackerPlayer}`];

  if (!attacker || !defender || rollValue == null) return;
  if (attacker.currentHp <= 0 || defender.currentHp <= 0) return;

  const damage = rollValue % 2 === 0 ? attacker.maxDmg : attacker.minDmg;
  defender.currentHp -= damage;

  const type = rollValue % 2 === 0 ? "MAX" : "MIN";
  log(`⚔️ ${attacker.name} → ${defender.name}: ${damage} ${type} DMG.`);

  if (defender.currentHp <= 0) {
    defender.currentHp = 0;
    log(`💀 ${defender.name} kiesett.`);

    const team = defenderPlayer === 1 ? state.team1 : state.team2;
    const nextAlive = team.findIndex(c => c.currentHp > 0);

    if (nextAlive === -1) {
      log(`🏆 Játékos ${attackerPlayer} megnyerte a meccset!`);
      $("attack1").disabled = true;
      $("attack2").disabled = true;
    } else {
      if (defenderPlayer === 1) state.active1 = nextAlive;
      else state.active2 = nextAlive;
      log(`➡️ Játékos ${defenderPlayer} következő aktív karaktere: ${team[nextAlive].name}.`);
    }
  }

  state[`dice${attackerPlayer}`] = null;
  renderAll();
}

function nextRound() {
  if (!state.started) return;
  state.round++;
  state.dice1 = null;
  state.dice2 = null;
  log(`— ${state.round}. kör —`);
  renderAll();
}

function startGame() {
  try {
    state.team1 = readTeam("team1-selects");
    state.team2 = readTeam("team2-selects");
  } catch (err) {
    alert(err.message);
    return;
  }

  state.started = true;
  state.round = 1;
  state.dice1 = null;
  state.dice2 = null;
  state.active1 = 0;
  state.active2 = 0;

  $("battle-area").classList.remove("hidden");
  $("log").textContent = "A játék elindult.\n";
  log(`Játékos 1 kezdő karakter: ${state.team1[0].name}`);
  log(`Játékos 2 kezdő karakter: ${state.team2[0].name}`);
  renderAll();
}

function resetGame() {
  state = {
    started: false,
    round: 1,
    dice1: null,
    dice2: null,
    team1: [],
    team2: [],
    active1: 0,
    active2: 0
  };

  createTeamSelectors("team1-selects");
  createTeamSelectors("team2-selects");
  $("battle-area").classList.add("hidden");
  $("log").textContent = "A játék még nem indult el.";
}

$("start-game").addEventListener("click", startGame);
$("reset-game").addEventListener("click", resetGame);
$("roll1").addEventListener("click", () => roll(1));
$("roll2").addEventListener("click", () => roll(2));
$("attack1").addEventListener("click", () => attack(1));
$("attack2").addEventListener("click", () => attack(2));
$("next-round").addEventListener("click", nextRound);

$("active1").addEventListener("change", e => {
  state.active1 = Number(e.target.value);
  state.dice1 = null;
  renderAll();
});

$("active2").addEventListener("change", e => {
  state.active2 = Number(e.target.value);
  state.dice2 = null;
  renderAll();
});

createTeamSelectors("team1-selects");
createTeamSelectors("team2-selects");
