import play from '../game';
import Warrior from '../characters/Warrior';
import Archer from '../characters/Archer';

describe('play', () => {
  test('возвращает единственного живого игрока', () => {
    const warrior = new Warrior(0, 'Алёша Попович');
    const archer = new Archer(1, 'Леголас');

    archer.life = 0;

    expect(play([warrior, archer])).toBe(warrior);
  });

  test('возвращает null, если живых игроков нет', () => {
    const warrior = new Warrior(0, 'Алёша Попович');
    const archer = new Archer(1, 'Леголас');

    warrior.life = 0;
    archer.life = 0;

    expect(play([warrior, archer])).toBe(null);
  });

  test('определяет победителя среди двух игроков', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);

    const warrior = new Warrior(0, 'Алёша Попович');
    const archer = new Archer(1, 'Леголас');

    const winner = play([warrior, archer]);

    expect(winner).not.toBe(null);
    expect(winner.isDead()).toBe(false);

    Math.random.mockRestore();
  });
});
