import './css/style.css';
import { createPlayers } from './js/game';

const TURN_DELAY = 800;
const ROUND_LIMIT = 100;

const app = document.querySelector('#app');
const players = createPlayers();

let currentPlayerIndex = 0;
let round = 1;
let turnNumber = 1;
let timerId = null;

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return '∞';
  }

  return Number(value.toFixed(2));
}

function getAlivePlayers() {
  return players.filter((player) => !player.isDead());
}

function createLayout() {
  app.innerHTML = `
    <main class="game">
      <section class="hero">
        <h1>RPG Battle</h1>
        <p class="battle-status">Сражение готово начаться</p>
        <div class="controls">
          <button class="button button_start" type="button">Начать бой</button>
          <button class="button button_restart" type="button">Начать заново</button>
        </div>
      </section>

      <section class="arena-section">
        <h2>Арена</h2>
        <div class="arena"></div>
      </section>

      <section class="log-section">
        <h2>Лог боя</h2>
        <ul class="battle-log"></ul>
      </section>
    </main>
  `;
}

function renderPlayers() {
  const arena = document.querySelector('.arena');
  const sortedPlayers = [...players].sort((firstPlayer, secondPlayer) => (
    firstPlayer.position - secondPlayer.position
  ));

  arena.innerHTML = sortedPlayers.map((player) => {
    const deadClass = player.isDead() ? 'player_dead' : '';
    const lifePercent = Math.max(player.life, 0);

    return `
      <article class="player ${deadClass}">
        <div class="player__header">
          <h3>${player.name}</h3>
          <span>${player.description}</span>
        </div>

        <div class="health">
          <span style="width: ${lifePercent}%"></span>
        </div>

        <ul class="stats">
          <li>Жизнь: ${formatNumber(player.life)}</li>
          <li>Мана: ${formatNumber(player.magic)}</li>
          <li>Атака: ${formatNumber(player.attack)}</li>
          <li>Ловкость: ${formatNumber(player.agility)}</li>
          <li>Удача: ${formatNumber(player.luck)}</li>
          <li>Позиция: ${formatNumber(player.position)}</li>
          <li>Оружие: ${player.weapon.name}</li>
          <li>Прочность: ${formatNumber(player.weapon.durability)}</li>
        </ul>
      </article>
    `;
  }).join('');
}

function updateStatus(message) {
  const status = document.querySelector('.battle-status');

  status.textContent = message;
}

function addLogMessage(message) {
  const battleLog = document.querySelector('.battle-log');
  const logItem = document.createElement('li');

  logItem.textContent = message;
  battleLog.prepend(logItem);
}

function getNextAlivePlayer() {
  for (let index = 0; index < players.length; index += 1) {
    const player = players[currentPlayerIndex];

    currentPlayerIndex += 1;

    if (currentPlayerIndex >= players.length) {
      currentPlayerIndex = 0;
      round += 1;
    }

    if (!player.isDead()) {
      return player;
    }
  }

  return null;
}

function createDamageMessage(enemy, enemyStateBefore) {
  const lifeDamage = Math.max(enemyStateBefore.life - enemy.life, 0);
  const magicDamage = Math.max(enemyStateBefore.magic - enemy.magic, 0);
  const weaponDamage = Math.max(
    enemyStateBefore.weaponDurability - enemy.weapon.durability,
    0,
  );

  if (lifeDamage > 0 || magicDamage > 0) {
    return [
      lifeDamage > 0 ? `урон по жизни: ${formatNumber(lifeDamage)}` : null,
      magicDamage > 0 ? `урон по мане: ${formatNumber(magicDamage)}` : null,
    ].filter(Boolean).join(', ');
  }

  if (weaponDamage > 0) {
    return `удар заблокирован, оружие повреждено на ${formatNumber(weaponDamage)}`;
  }

  return 'урон не прошёл';
}

function processPlayerTurn(player, alivePlayers) {
  const enemy = player.chooseEnemy(alivePlayers);

  if (!enemy) {
    return;
  }

  const playerPositionBefore = player.position;
  const enemyStateBefore = {
    life: enemy.life,
    magic: enemy.magic,
    position: enemy.position,
    weaponName: enemy.weapon.name,
    weaponDurability: enemy.weapon.durability,
  };
  const playerWeaponBefore = {
    name: player.weapon.name,
    durability: player.weapon.durability,
  };

  addLogMessage(`Ход ${turnNumber}. ${player.name} выбирает цель: ${enemy.name}.`);

  player.moveToEnemy(enemy);

  if (player.position !== playerPositionBefore) {
    addLogMessage(
      `${player.name} перемещается с позиции ${playerPositionBefore} на ${player.position}.`,
    );
  }

  const distance = player.getDistance(enemy);

  if (distance > player.weapon.range) {
    addLogMessage(
      `${player.name} не достаёт до ${enemy.name}. Дистанция: ${distance}, дальность оружия: ${player.weapon.range}.`,
    );
    return;
  }

  player.tryAttack(enemy);

  const damageMessage = createDamageMessage(enemy, enemyStateBefore);

  addLogMessage(`${player.name} атакует ${enemy.name}: ${damageMessage}.`);

  if (enemy.position !== enemyStateBefore.position) {
    addLogMessage(
      `${enemy.name} отлетает с позиции ${enemyStateBefore.position} на ${enemy.position}.`,
    );
  }

  if (enemy.weapon.name !== enemyStateBefore.weaponName) {
    addLogMessage(`${enemy.name} меняет оружие на ${enemy.weapon.name}.`);
  }

  if (player.weapon.name !== playerWeaponBefore.name) {
    addLogMessage(`${player.name} меняет оружие на ${player.weapon.name}.`);
  }

  if (enemy.isDead()) {
    addLogMessage(`${enemy.name} погибает.`);
  }
}

function finishBattle(winner) {
  clearInterval(timerId);

  if (winner) {
    updateStatus(`Победитель: ${winner.name} (${winner.description})`);
    addLogMessage(`Сражение завершено. Победитель: ${winner.name}.`);
    return;
  }

  updateStatus('Победителя нет');
  addLogMessage('Сражение завершено без победителя.');
}

function processBattleTurn() {
  const alivePlayers = getAlivePlayers();

  if (alivePlayers.length <= 1) {
    finishBattle(alivePlayers[0] || null);
    renderPlayers();
    return;
  }

  if (round > ROUND_LIMIT) {
    finishBattle(null);
    renderPlayers();
    return;
  }

  updateStatus(`Раунд ${round}. Живых игроков: ${alivePlayers.length}.`);

  const player = getNextAlivePlayer();

  if (!player) {
    finishBattle(null);
    renderPlayers();
    return;
  }

  processPlayerTurn(player, alivePlayers);
  renderPlayers();

  turnNumber += 1;
}

function startBattle() {
  if (timerId) {
    return;
  }

  addLogMessage('Сражение началось.');
  updateStatus('Сражение идёт...');
  timerId = setInterval(processBattleTurn, TURN_DELAY);
}

function restartBattle() {
  window.location.reload();
}

function initControls() {
  const startButton = document.querySelector('.button_start');
  const restartButton = document.querySelector('.button_restart');

  startButton.addEventListener('click', startBattle);
  restartButton.addEventListener('click', restartBattle);
}

createLayout();
renderPlayers();
initControls();
