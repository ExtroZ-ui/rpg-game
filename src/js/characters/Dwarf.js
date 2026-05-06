import Warrior from './Warrior';
import Axe from '../weapons/Axe';

export default class Dwarf extends Warrior {
  constructor(position, name) {
    super(position, name);

    this.life = 130;
    this.attack = 15;
    this.luck = 20;
    this.description = 'Гном';
    this.weapon = new Axe();
    this.damageCount = 0;
  }

  takeDamage(damage) {
    this.damageCount += 1;

    if (this.damageCount % 6 === 0 && this.getLuck() > 0.5) {
      super.takeDamage(damage / 2);
      return;
    }

    super.takeDamage(damage);
  }
}
