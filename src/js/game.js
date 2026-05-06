import Archer from './characters/Archer';
import Warrior from './characters/Warrior';
import Mage from './characters/Mage';
import Dwarf from './characters/Dwarf';
import Crossbowman from './characters/Crossbowman';
import Demiurge from './characters/Demiurge';

function createPlayers() {
  return [
    new Warrior(0, 'Алёша Попович'),
    new Archer(3, 'Леголас'),
    new Mage(6, 'Гендальф'),
    new Dwarf(9, 'Торин'),
    new Crossbowman(12, 'Робин'),
    new Demiurge(15, 'Мерлин'),
  ];
}

export default function play(players = createPlayers()) {
  let alivePlayers = players.filter((player) => !player.isDead());

  while (alivePlayers.length > 1) {
    alivePlayers.forEach((player) => {
      if (!player.isDead()) {
        player.turn(alivePlayers);
      }
    });

    alivePlayers = players.filter((player) => !player.isDead());
  }

  return alivePlayers[0] || null;
}
