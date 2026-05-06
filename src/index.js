import './css/style.css';
import play from './js/game';

const winner = play();

if (winner) {
  console.log(`Победитель: ${winner.name}`);
}
