import Player from '../characters/Player';
import Warrior from '../characters/Warrior';
import Archer from '../characters/Archer';
import Mage from '../characters/Mage';
import Dwarf from '../characters/Dwarf';
import Crossbowman from '../characters/Crossbowman';
import Demiurge from '../characters/Demiurge';

import Arm from '../weapons/Arm';
import Knife from '../weapons/Knife';
import Sword from '../weapons/Sword';
import Bow from '../weapons/Bow';
import Staff from '../weapons/Staff';
import Axe from '../weapons/Axe';
import LongBow from '../weapons/LongBow';
import StormStaff from '../weapons/StormStaff';

describe('Player', () => {
  test('создаётся с базовыми характеристиками', () => {
    const player = new Player(10, 'Бэтмен');

    expect(player.life).toBe(100);
    expect(player.magic).toBe(20);
    expect(player.speed).toBe(1);
    expect(player.attack).toBe(10);
    expect(player.agility).toBe(5);
    expect(player.luck).toBe(10);
    expect(player.description).toBe('Игрок');
    expect(player.weapon).toBeInstanceOf(Arm);
    expect(player.position).toBe(10);
    expect(player.name).toBe('Бэтмен');
  });

  test('getLuck возвращает коэффициент удачи', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);

    const player = new Player(10, 'Бэтмен');

    expect(player.getLuck()).toBe(0.6);

    Math.random.mockRestore();
  });

  test('getDamage возвращает 0, если оружие не достаёт', () => {
    const player = new Player(10, 'Хоббит');

    expect(player.getDamage(2)).toBe(0);
  });

  test('getDamage рассчитывает урон', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);

    const player = new Player(10, 'Хоббит');

    expect(player.getDamage(1)).toBe(6.6);

    Math.random.mockRestore();
  });

  test('takeDamage уменьшает жизнь и не опускает её ниже 0', () => {
    const player = new Player(10, 'Хоббит');

    player.takeDamage(30);
    expect(player.life).toBe(70);

    player.takeDamage(100);
    expect(player.life).toBe(0);
  });

  test('isDead возвращает true при life 0', () => {
    const player = new Player(10, 'Хоббит');

    player.takeDamage(100);

    expect(player.isDead()).toBe(true);
  });

  test('moveLeft и moveRight двигают игрока не дальше скорости', () => {
    const player = new Warrior(6, 'Алёша Попович');

    player.moveLeft(5);
    expect(player.position).toBe(4);

    player.moveRight(2);
    expect(player.position).toBe(6);

    player.moveRight(1);
    expect(player.position).toBe(7);
  });

  test('move вызывает moveLeft для отрицательной дистанции', () => {
    const player = new Player(10, 'Хоббит');

    player.move(-5);

    expect(player.position).toBe(9);
  });

  test('move вызывает moveRight для положительной дистанции', () => {
    const player = new Player(10, 'Хоббит');

    player.move(5);

    expect(player.position).toBe(11);
  });

  test('isAttackBlocked возвращает true при высокой удаче', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.95);

    const player = new Player(10, 'Хоббит');

    expect(player.isAttackBlocked()).toBe(true);

    Math.random.mockRestore();
  });

  test('dodged возвращает true при успешном уклонении', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.95);

    const player = new Player(10, 'Хоббит');

    expect(player.dodged()).toBe(true);

    Math.random.mockRestore();
  });

  test('takeAttack повреждает оружие при блоке', () => {
    const player = new Warrior(10, 'Алёша Попович');

    jest.spyOn(player, 'isAttackBlocked').mockReturnValue(true);

    player.takeAttack(20);

    expect(player.weapon.durability).toBe(480);
    expect(player.life).toBe(120);
  });

  test('takeAttack не наносит урон при уклонении', () => {
    const player = new Warrior(10, 'Алёша Попович');

    jest.spyOn(player, 'isAttackBlocked').mockReturnValue(false);
    jest.spyOn(player, 'dodged').mockReturnValue(true);

    player.takeAttack(20);

    expect(player.life).toBe(120);
  });

  test('takeAttack наносит урон, если блок и уклонение не сработали', () => {
    const player = new Warrior(10, 'Алёша Попович');

    jest.spyOn(player, 'isAttackBlocked').mockReturnValue(false);
    jest.spyOn(player, 'dodged').mockReturnValue(false);

    player.takeAttack(20);

    expect(player.life).toBe(100);
  });

  test('checkWeapon меняет сломанное оружие на Knife', () => {
    const player = new Warrior(10, 'Алёша Попович');

    player.weapon.takeDamage(500);
    player.checkWeapon();

    expect(player.weapon).toBeInstanceOf(Knife);
  });

  test('checkWeapon меняет сломанный Knife на Arm', () => {
    const player = new Warrior(10, 'Алёша Попович');

    player.weapon = new Knife();
    player.weapon.takeDamage(300);
    player.checkWeapon();

    expect(player.weapon).toBeInstanceOf(Arm);
  });

  test('tryAttack не атакует, если оружие не достаёт', () => {
    const player = new Warrior(0, 'Алёша Попович');
    const enemy = new Archer(5, 'Леголас');

    jest.spyOn(enemy, 'takeAttack');

    player.tryAttack(enemy);

    expect(enemy.takeAttack).not.toHaveBeenCalled();
  });

  test('tryAttack атакует врага в радиусе оружия', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);

    const player = new Warrior(0, 'Алёша Попович');
    const enemy = new Archer(1, 'Леголас');

    jest.spyOn(enemy, 'takeAttack');

    player.tryAttack(enemy);

    expect(enemy.takeAttack).toHaveBeenCalled();

    Math.random.mockRestore();
  });

  test('tryAttack отталкивает врага при одинаковой позиции', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);

    const player = new Warrior(1, 'Алёша Попович');
    const enemy = new Archer(1, 'Леголас');

    jest.spyOn(enemy, 'takeAttack');

    player.tryAttack(enemy);

    expect(enemy.position).toBe(2);
    expect(enemy.takeAttack).toHaveBeenCalled();

    Math.random.mockRestore();
  });

  test('chooseEnemy выбирает живого врага с минимальным здоровьем', () => {
    const player = new Player(0, 'Игрок');
    const firstEnemy = new Player(1, 'Первый');
    const secondEnemy = new Player(2, 'Второй');

    firstEnemy.life = 80;
    secondEnemy.life = 30;

    expect(player.chooseEnemy([player, firstEnemy, secondEnemy])).toBe(secondEnemy);
  });

  test('moveToEnemy двигает игрока к врагу', () => {
    const player = new Warrior(0, 'Алёша Попович');
    const enemy = new Archer(5, 'Леголас');

    player.moveToEnemy(enemy);

    expect(player.position).toBe(2);
  });

  test('turn выбирает врага, двигается и атакует', () => {
    const player = new Warrior(0, 'Алёша Попович');
    const enemy = new Archer(1, 'Леголас');

    jest.spyOn(player, 'moveToEnemy');
    jest.spyOn(player, 'tryAttack');

    player.turn([player, enemy]);

    expect(player.moveToEnemy).toHaveBeenCalledWith(enemy);
    expect(player.tryAttack).toHaveBeenCalledWith(enemy);
  });
});

describe('Character classes', () => {
  test('Warrior создаётся с нужными характеристиками', () => {
    const warrior = new Warrior(10, 'Алёша Попович');

    expect(warrior.life).toBe(120);
    expect(warrior.magic).toBe(20);
    expect(warrior.speed).toBe(2);
    expect(warrior.attack).toBe(10);
    expect(warrior.agility).toBe(5);
    expect(warrior.luck).toBe(10);
    expect(warrior.description).toBe('Воин');
    expect(warrior.weapon).toBeInstanceOf(Sword);
  });

  test('Warrior может получать урон в ману', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.8);

    const warrior = new Warrior(10, 'Алёша Попович');

    warrior.life = 50;
    warrior.takeDamage(5);

    expect(warrior.life).toBe(50);
    expect(warrior.magic).toBe(15);

    Math.random.mockRestore();
  });

  test('Archer создаётся с нужными характеристиками', () => {
    const archer = new Archer(10, 'Леголас');

    expect(archer.life).toBe(80);
    expect(archer.magic).toBe(35);
    expect(archer.speed).toBe(1);
    expect(archer.attack).toBe(5);
    expect(archer.agility).toBe(10);
    expect(archer.luck).toBe(10);
    expect(archer.description).toBe('Лучник');
    expect(archer.weapon).toBeInstanceOf(Bow);
  });

  test('Archer использует специальную формулу урона', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);

    const archer = new Archer(10, 'Леголас');

    expect(archer.getDamage(3)).toBe(9);

    Math.random.mockRestore();
  });

  test('Mage создаётся с нужными характеристиками', () => {
    const mage = new Mage(10, 'Гендальф');

    expect(mage.life).toBe(70);
    expect(mage.magic).toBe(100);
    expect(mage.speed).toBe(1);
    expect(mage.attack).toBe(5);
    expect(mage.agility).toBe(8);
    expect(mage.luck).toBe(10);
    expect(mage.description).toBe('Маг');
    expect(mage.weapon).toBeInstanceOf(Staff);
  });

  test('Mage получает половину урона при magic больше 50', () => {
    const mage = new Mage(10, 'Гендальф');

    mage.takeDamage(50);

    expect(mage.life).toBe(45);
    expect(mage.magic).toBe(88);
  });

  test('Dwarf создаётся с нужными характеристиками', () => {
    const dwarf = new Dwarf(10, 'Торин');

    expect(dwarf.life).toBe(130);
    expect(dwarf.magic).toBe(20);
    expect(dwarf.speed).toBe(2);
    expect(dwarf.attack).toBe(15);
    expect(dwarf.agility).toBe(5);
    expect(dwarf.luck).toBe(20);
    expect(dwarf.description).toBe('Гном');
    expect(dwarf.weapon).toBeInstanceOf(Axe);
  });

  test('Dwarf каждый шестой удар может получать в 2 раза меньше урона', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.4);

    const dwarf = new Dwarf(10, 'Торин');

    dwarf.takeDamage(10);
    dwarf.takeDamage(10);
    dwarf.takeDamage(10);
    dwarf.takeDamage(10);
    dwarf.takeDamage(10);
    dwarf.takeDamage(10);

    expect(dwarf.damageCount).toBe(6);
    expect(dwarf.life).toBe(75);

    Math.random.mockRestore();
  });

  test('Crossbowman создаётся с нужными характеристиками', () => {
    const crossbowman = new Crossbowman(10, 'Робин');

    expect(crossbowman.life).toBe(85);
    expect(crossbowman.magic).toBe(35);
    expect(crossbowman.speed).toBe(1);
    expect(crossbowman.attack).toBe(8);
    expect(crossbowman.agility).toBe(20);
    expect(crossbowman.luck).toBe(15);
    expect(crossbowman.description).toBe('Арбалетчик');
    expect(crossbowman.weapon).toBeInstanceOf(LongBow);
  });

  test('Demiurge создаётся с нужными характеристиками', () => {
    const demiurge = new Demiurge(10, 'Мерлин');

    expect(demiurge.life).toBe(80);
    expect(demiurge.magic).toBe(120);
    expect(demiurge.speed).toBe(1);
    expect(demiurge.attack).toBe(6);
    expect(demiurge.agility).toBe(8);
    expect(demiurge.luck).toBe(12);
    expect(demiurge.description).toBe('Демиург');
    expect(demiurge.weapon).toBeInstanceOf(StormStaff);
  });

  test('Demiurge может усиливать урон в 1.5 раза', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.7);

    const demiurge = new Demiurge(10, 'Мерлин');

    expect(demiurge.getDamage(1)).toBeCloseTo(19.68);

    Math.random.mockRestore();
  });
});
