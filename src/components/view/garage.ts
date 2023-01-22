import { State } from '../../types/type';

export default class Garage {
  garageContainer = document.createElement('div');
  garageTitleContainer = document.createElement('div');
  garageTitleName = document.createElement('div');
  garageTitleAmount = document.createElement('span');
  garagePageAmount = document.createElement('div');
  garageCars = document.createElement('div');
  garagePagination = document.createElement('div');
  paginationPrev = document.createElement('button');
  paginationNext = document.createElement('button');
  garageModal = document.createElement('div');

  async drawGarage(obj: State) {
    this.makeElements(obj);
    this.garageTitleContainer.append(this.garageTitleName, this.garageTitleAmount);
    this.garagePagination.append(this.paginationPrev, this.paginationNext);
    
    this.garageContainer.append(
      this.garageTitleContainer,
      this.garagePageAmount,
      this.garageCars,
      this.garagePagination,
      this.garageModal,
    );
  }

  makeElements(obj: State) {
    this.makeGarageContainer();
    this.makeGarageTitleContainer();
    this.makeGarageTitleName();
    this.makeGarageTitleAmount();
    this.makeGaragePageAmount(obj);
    this.makeGarageCars();
    this.makeGaragePagination();
    this.makePaginationPrev();
    this.makePaginationNext();
    this.makeGarageModal();
  }

  makeGarageContainer() {
    this.garageContainer.classList.add('garageContainer');
  }

  makeGarageTitleContainer() {
    this.garageTitleContainer.classList.add('garageTitleContainer');
  }

  makeGarageTitleName() {
    this.garageTitleName.classList.add('garageTitleName');
    this.garageTitleName.textContent = 'Garage ';
  }

  makeGarageTitleAmount() {
    this.garageTitleAmount.classList.add('garageTitleAmount');
    this.garageTitleAmount.textContent = ' (0)';
  }

  makeGaragePageAmount(obj: State) {
    this.garagePageAmount.classList.add('garagePageAmount');
    this.garagePageAmount.textContent = `Page #${obj.page}`;
  }

  makeGarageCars() {
    this.garageCars.classList.add('garageCars');
  }

  makeGaragePagination() {
    this.garagePagination.classList.add('garagePagination');
  }

  makePaginationPrev() {
    this.paginationPrev.classList.add('paginationPrev', 'pagination-btn');
    this.paginationPrev.setAttribute('id', 'paginationPrev');
    this.paginationPrev.textContent = 'PREV';
  }

  makePaginationNext() {
    this.paginationNext.classList.add('paginationNext', 'pagination-btn');
    this.paginationNext.textContent = 'NEXT';
    this.paginationNext.setAttribute('id', 'paginationNext');
  }

  makeGarageModal() {
    this.garageModal.classList.add('garageModal');
  }
}
