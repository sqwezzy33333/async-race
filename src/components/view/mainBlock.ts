import { State } from '../../types/type';

export default class MainSection {
  mainSection: HTMLElement;

 

  constructor() {
    this.mainSection = document.createElement('div');
  }

  drawMainSection(obj: State) {
    const mainContainer = document.querySelector('.main');
    if (mainContainer) {
      mainContainer.innerHTML = '';
      mainContainer.append(this.mainSection);
    }
  }

  makeMainSection() {
    this.mainSection.classList.add('mainSection');
  }
}
