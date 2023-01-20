import { State } from '../../types/type';

export default class Header {
  header: HTMLElement = document.createElement('header');
  garageBtn: HTMLButtonElement = document.createElement('button');
  winnersBtn: HTMLButtonElement = document.createElement('button');
  mainBlock: HTMLElement = document.createElement('div');

  drawHeaderBlock(){
    this.createGarageBtn();
    this.createWinnersBtn();
    this.createMainContainer();
    this.header.append(this.winnersBtn);
    this.header.append(this.garageBtn);
    document.body.append(this.header);
  }

  createGarageBtn() {
    this.garageBtn.classList.add('header-btn', 'garageBtn');
    this.garageBtn.textContent = 'Garage';
  }

  createWinnersBtn() {
    this.winnersBtn.classList.add('header-btn', 'winnersBtn');
    this.winnersBtn.textContent = 'Winners';
  }

  createMainContainer() {
    this.mainBlock.classList.add('mainContainer');
  }
}