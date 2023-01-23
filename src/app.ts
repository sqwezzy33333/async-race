import './components/styles/main.scss';
import Header from './components/view/header';

import DrawGarage from './components/draw/drawGarage';
import { State } from './types/type';

class App {
  state: State;
  header: Header;
  drawGarage: DrawGarage;
  constructor() {
    this.state = {
      view: 'garage',
      page: 1,
      animation: [],
      cars: [],
      winnersPage: 1,
      sort: 'id',
      order: 'ASC',
    };
    this.header = new Header();
    this.drawGarage = new DrawGarage();
  }
  start(){
    this.header.drawHeaderBlock();
    this.drawGarage.drawGarage(this.state);
    this.drawGarage.addListeners(this.state);
  }
}

const app = new App();
app.start();