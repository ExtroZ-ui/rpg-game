import Player from './Player';
import Sword from '../weapons/Sword';

export default class Warrior extends Player {
  constructor(position, name) {
    super(position, name);

    this.life = 120;
    this.speed = 2;
    this.attack = 10;
    this.description = 'Воин';
    this.weapon = new Sword();
  }

  takeDamage(damage) {
    if (this.life < 60 && this.magic > 0 && this.getLuck() > 0.8) {
      this.magic = Math.max(this.magic - damage, 0);
      return;
    }

    super.takeDamage(damage);
  }
}
