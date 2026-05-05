import Arm from '../weapons/Arm';
import Knife from '../weapons/Knife';

export default class Player {
  constructor() {
    this.weapon = new Arm();
  }

  changeWeapon() {
    this.weapon = new Knife();
  }
}
