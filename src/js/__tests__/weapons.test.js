import Weapon from '../weapons/Weapon';
import Arm from '../weapons/Arm';
import Bow from '../weapons/Bow';
import Sword from '../weapons/Sword';
import Knife from '../weapons/Knife';
import Staff from '../weapons/Staff';
import LongBow from '../weapons/LongBow';
import Axe from '../weapons/Axe';
import StormStaff from '../weapons/StormStaff';

describe('Weapon', () => {
  test('создаёт оружие с нужными свойствами', () => {
    const weapon = new Weapon('Старый меч', 20, 10, 1);

    expect(weapon.name).toBe('Старый меч');
    expect(weapon.attack).toBe(20);
    expect(weapon.durability).toBe(10);
    expect(weapon.initDurability).toBe(10);
    expect(weapon.range).toBe(1);
  });

  test('takeDamage уменьшает прочность оружия', () => {
    const weapon = new Weapon('Старый меч', 20, 10, 1);

    weapon.takeDamage(5);

    expect(weapon.durability).toBe(5);
  });

  test('takeDamage не уменьшает прочность ниже нуля', () => {
    const weapon = new Weapon('Старый меч', 20, 10, 1);

    weapon.takeDamage(50);

    expect(weapon.durability).toBe(0);
  });

  test('getDamage возвращает полный урон при прочности не меньше 30%', () => {
    const bow = new Bow();

    bow.takeDamage(100);

    expect(bow.durability).toBe(100);
    expect(bow.getDamage()).toBe(10);
  });

  test('getDamage возвращает половину урона при прочности меньше 30%', () => {
    const bow = new Bow();

    bow.takeDamage(150);

    expect(bow.durability).toBe(50);
    expect(bow.getDamage()).toBe(5);
  });

  test('getDamage возвращает 0, если оружие сломано', () => {
    const bow = new Bow();

    bow.takeDamage(200);

    expect(bow.durability).toBe(0);
    expect(bow.getDamage()).toBe(0);
  });

  test('isBroken возвращает true, если durability равно 0', () => {
    const weapon = new Weapon('Старый меч', 20, 10, 1);

    weapon.takeDamage(10);

    expect(weapon.isBroken()).toBe(true);
  });

  test('isBroken возвращает false, если durability больше 0', () => {
    const weapon = new Weapon('Старый меч', 20, 10, 1);

    weapon.takeDamage(5);

    expect(weapon.isBroken()).toBe(false);
  });
});

describe('Basic weapons', () => {
  test('Arm создаётся с правильными свойствами', () => {
    const arm = new Arm();

    expect(arm.name).toBe('Рука');
    expect(arm.attack).toBe(1);
    expect(arm.durability).toBe(Infinity);
    expect(arm.initDurability).toBe(Infinity);
    expect(arm.range).toBe(1);
  });

  test('Arm не ломается от урона', () => {
    const arm = new Arm();

    arm.takeDamage(1000);

    expect(arm.durability).toBe(Infinity);
    expect(arm.isBroken()).toBe(false);
    expect(arm.getDamage()).toBe(1);
  });

  test('Bow создаётся с правильными свойствами', () => {
    const bow = new Bow();

    expect(bow.name).toBe('Лук');
    expect(bow.attack).toBe(10);
    expect(bow.durability).toBe(200);
    expect(bow.initDurability).toBe(200);
    expect(bow.range).toBe(3);
  });

  test('Sword создаётся с правильными свойствами', () => {
    const sword = new Sword();

    expect(sword.name).toBe('Меч');
    expect(sword.attack).toBe(25);
    expect(sword.durability).toBe(500);
    expect(sword.initDurability).toBe(500);
    expect(sword.range).toBe(1);
  });

  test('Knife создаётся с правильными свойствами', () => {
    const knife = new Knife();

    expect(knife.name).toBe('Нож');
    expect(knife.attack).toBe(5);
    expect(knife.durability).toBe(300);
    expect(knife.initDurability).toBe(300);
    expect(knife.range).toBe(1);
  });

  test('Staff создаётся с правильными свойствами', () => {
    const staff = new Staff();

    expect(staff.name).toBe('Посох');
    expect(staff.attack).toBe(8);
    expect(staff.durability).toBe(300);
    expect(staff.initDurability).toBe(300);
    expect(staff.range).toBe(2);
  });
});

describe('Improved weapons', () => {
  test('LongBow наследуется от Bow и меняет нужные свойства', () => {
    const longBow = new LongBow();

    expect(longBow).toBeInstanceOf(Bow);
    expect(longBow.name).toBe('Длинный лук');
    expect(longBow.attack).toBe(15);
    expect(longBow.durability).toBe(200);
    expect(longBow.initDurability).toBe(200);
    expect(longBow.range).toBe(4);
  });

  test('Axe наследуется от Sword и меняет нужные свойства', () => {
    const axe = new Axe();

    expect(axe).toBeInstanceOf(Sword);
    expect(axe.name).toBe('Секира');
    expect(axe.attack).toBe(27);
    expect(axe.durability).toBe(800);
    expect(axe.initDurability).toBe(800);
    expect(axe.range).toBe(1);
  });

  test('StormStaff наследуется от Staff и меняет нужные свойства', () => {
    const stormStaff = new StormStaff();

    expect(stormStaff).toBeInstanceOf(Staff);
    expect(stormStaff.name).toBe('Посох Бури');
    expect(stormStaff.attack).toBe(10);
    expect(stormStaff.durability).toBe(300);
    expect(stormStaff.initDurability).toBe(300);
    expect(stormStaff.range).toBe(3);
  });
});
