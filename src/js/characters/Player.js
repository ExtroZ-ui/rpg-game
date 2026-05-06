import Arm from '../weapons/Arm';
import Knife from '../weapons/Knife';

export default class Player {
  constructor(position, name) {
    this.life = 100;
    this.magic = 20;
    this.speed = 1;
    this.attack = 10;
    this.agility = 5;
    this.luck = 10;
    this.description = 'Игрок';
    this.weapon = new Arm();
    this.position = position;
    this.name = name;
  }

  getLuck() {
    return (Math.random() * 100 + this.luck) / 100;
  }

  getDistance(enemy) {
    return Math.abs(this.position - enemy.position) || 1;
  }

  getDamage(distance) {
    if (distance > this.weapon.range) {
      return 0;
    }

    return (this.attack + this.weapon.getDamage()) * this.getLuck() / distance;
  }

  takeDamage(damage) {
    this.life = Math.max(this.life - damage, 0);
  }

  isDead() {
    return this.life === 0;
  }

  moveLeft(distance) {
    const step = Math.min(Math.abs(distance), this.speed);

    this.position -= step;
  }

  moveRight(distance) {
    const step = Math.min(Math.abs(distance), this.speed);

    this.position += step;
  }

  move(distance) {
    if (distance < 0) {
      this.moveLeft(distance);
      return;
    }

    this.moveRight(distance);
  }

  isAttackBlocked() {
    return this.getLuck() > (100 - this.luck) / 100;
  }

  dodged() {
    return this.getLuck() > (100 - this.agility - this.speed * 3) / 100;
  }

  takeAttack(damage) {
    if (this.isAttackBlocked()) {
      this.weapon.takeDamage(damage);
      this.checkWeapon();
      return;
    }

    if (this.dodged()) {
      return;
    }

    this.takeDamage(damage);
  }

  checkWeapon() {
    if (!this.weapon.isBroken()) {
      return;
    }

    if (this.weapon instanceof Arm) {
      return;
    }

    if (this.weapon instanceof Knife) {
      this.weapon = new Arm();
      return;
    }

    this.weapon = new Knife();
  }

  tryAttack(enemy) {
    const distance = this.getDistance(enemy);

    if (distance > this.weapon.range) {
      return;
    }

    this.weapon.takeDamage(10 * this.getLuck());

    const damage = this.getDamage(distance);

    if (this.position === enemy.position) {
      enemy.moveRight(1);
      enemy.takeAttack(damage * 2);
      this.checkWeapon();
      return;
    }

    enemy.takeAttack(damage);
    this.checkWeapon();
  }

  chooseEnemy(players) {
    return players
      .filter((player) => player !== this && !player.isDead())
      .sort((firstPlayer, secondPlayer) => firstPlayer.life - secondPlayer.life)[0] || null;
  }

  moveToEnemy(enemy) {
    const distance = enemy.position - this.position;

    if (distance !== 0) {
      this.move(distance);
    }
  }

  turn(players) {
    const enemy = this.chooseEnemy(players);

    if (!enemy) {
      return;
    }

    this.moveToEnemy(enemy);
    this.tryAttack(enemy);
  }
}
