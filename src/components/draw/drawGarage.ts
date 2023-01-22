import Loader from '../loader/loader';
import {
  AnimationInfo,
  CarInfo,
  GetData,
  NewCar,
  Promises,
  State,
  UpdateCar,
} from '../../types/type';
import MainSection from '../view/mainBlock';
//import Animation from './animation';
//import TemplateCreator from './templateCreator';

export default class DrawGarage {
  mainSection = new MainSection();

  loader = new Loader();

  animation = new Animation();

  //templateCreator = new TemplateCreator();

  drawGarage: (obj: State) => void = async (obj) => {
    this.mainSection.drawMainSection(obj);
    this.drawCars(obj);
  };

  async drawCars(obj: State) {
    const state = obj;
    state.cars = [];
    const data = await this.loader.getCars(+obj.page);
    const garageCars = document.querySelector('.garageCars');
    const garageTitleAmount = document.querySelector('.garageTitleAmount');

    if (garageCars) {
      garageCars.innerHTML = '';
    }
    if (garageTitleAmount) {
      garageTitleAmount.textContent = `(${data.count})`;
    }
    this.checkPaginationsButtons(obj, data);
    data.items.forEach((item: CarInfo) => {
      state.cars.push(item);
      const carField = document.createElement('div');
      //carField.innerHTML = this.templateCreator.createTemplate(item.name, item.color, item.id);

      if (garageCars) {
        garageCars.append(carField);
      }
    });
    this.addListenersToCarField(obj);
  }

  checkPaginationsButtons(obj: State, dataObj: GetData) {
    const paginationBtnNext = document.querySelector<HTMLButtonElement>('.paginationNext');
    const paginationBtnPrev = document.querySelector<HTMLButtonElement>('.paginationPrev');
    if (paginationBtnNext) {
      const { count } = dataObj;
      if (count) {
        if (+count / 7 <= obj.page) {
          paginationBtnNext.disabled = true;
        } else paginationBtnNext.disabled = false;
      }
    }
    if (paginationBtnPrev) {
      if (obj.page === 1) {
        paginationBtnPrev.disabled = true;
      } else paginationBtnPrev.disabled = false;
    }
  }

  addListeners(obj: State) {
    this.addListenerToPagination(obj);
    this.addListenerToCreateInput(obj);
    this.addListenerToUpdateInput(obj);
    this.addListenerToGenerateBtn(obj);
    this.addListenerToRaceButton(obj);
    this.addListenerToResetButton(obj);
  }

  addListenerToPagination(obj: State) {
    const paginationBtnNext = document.querySelector<HTMLButtonElement>('.paginationNext');
    const paginationBtnPrev = document.querySelector<HTMLButtonElement>('.paginationPrev');
    const garagePageAmount = document.querySelector('.garagePageAmount');
    const state = obj;

    if (paginationBtnNext && garagePageAmount) {
      paginationBtnNext.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;

        if (target) {
          state.page += 1;
          garagePageAmount.textContent = `Page #${state.page}`;
          this.drawCars(obj);
        }
      });
    }

    if (paginationBtnPrev && garagePageAmount) {
      paginationBtnPrev.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;

        if (target) {
          if (state.page > 1) {
            state.page -= 1;
            garagePageAmount.textContent = `Page #${state.page}`;
            this.drawCars(obj);
          }
        }
      });
    }
  }

  addListenerToCreateInput(obj: State) {
    const inputCreateCar = document.querySelector<HTMLInputElement>('.createCarInput');
    const inputCreateColor = document.querySelector<HTMLInputElement>('.createColorInput');
    const createCarBtn = document.querySelector('.createCarBtn');

    if (inputCreateCar && inputCreateColor && createCarBtn) {
      createCarBtn.addEventListener('click', () => {
        if (inputCreateCar.value && inputCreateColor.value) {
          const newCar: NewCar = {
            name: inputCreateCar.value,
            color: inputCreateColor.value,
          };
          try {
            this.loader.createCar(newCar);
          } catch (err) {
            console.log(err);
          }
          this.drawCars(obj);
          inputCreateCar.value = '';
        }
      });
    }
  }

  addListenerToUpdateInput(obj: State) {
    const inputUpdateCar = document.querySelector<HTMLInputElement>('.updateCarInput');
    const inputUpdateColor = document.querySelector<HTMLInputElement>('.updateColorInput');
    const updateCarBtn = document.querySelector('.updateCarBtn');

    if (inputUpdateCar && inputUpdateColor && updateCarBtn) {
      updateCarBtn.addEventListener('click', () => {
        if (inputUpdateCar.value) {
          const updateCar = {
            name: inputUpdateCar.value,
            color: inputUpdateColor.value,
          };
          const id = updateCarBtn.getAttribute('data-id');
          if (id) {
            const numberId = Number(id);
            try {
              this.updateCar(numberId, updateCar, obj);
            } catch (err) {
              console.log(err);
            } finally {
              inputUpdateCar.value = '';
              inputUpdateCar.disabled = true;
              updateCarBtn.removeAttribute('data-id');
            }
          }
        }
      });
    }
  }

  async updateCar(id: number, car: UpdateCar, obj: State) {
    await this.loader.updateCar(id, car);
    this.drawCars(obj);
  }

  async addListenerToRaceButton(obj: State) {
    const startRaceBtn = document.querySelector<HTMLButtonElement>('.btnStartRace');
    const resetBtn = document.querySelector<HTMLButtonElement>('.resetBtn');
    const winnersBtn = document.querySelector<HTMLButtonElement>('.winnersBTN');
    const modalWindow = document.querySelector('.garageModal');
    const paginationButtons = document.querySelectorAll<HTMLButtonElement>('.pagination-btn');

    startRaceBtn?.addEventListener('click', () => {
      if (startRaceBtn) {
        this.disableBtn(startRaceBtn);
      }
      if (winnersBtn) {
        this.disableBtn(winnersBtn);
      }
      if (paginationButtons) {
        paginationButtons.forEach((btn) => this.disableBtn(btn));
      }
      const winner = this.race(obj);

      winner.then((car) => {
        if (car.id) {
          const winnerInfo = {
            id: car.id,
            time: car.time,
          };
          this.loader.saveWinner(winnerInfo);
        }
        if (modalWindow) {
          modalWindow.textContent = `${car.name} выиграл гонку за ${car.time}s`;
          modalWindow.classList.add('garageModal--active');
        }
        if (resetBtn) {
          this.enableBtn(resetBtn);
        }
        if (winnersBtn) {
          this.enableBtn(winnersBtn);
        }
        if (paginationButtons) {
          paginationButtons.forEach((btn) => this.enableBtn(btn));
        }
      });
    });
  }

  async addListenerToResetButton(obj: State) {
    const resetBtn = document.querySelector<HTMLButtonElement>('.resetBtn');
    const startRaceBtn = document.querySelector<HTMLButtonElement>('.btnStartRace');
    const modalWindow = document.querySelector('.garageModal');
    const state = obj;
    resetBtn?.addEventListener('click', () => {
      state.cars.map(({ id }) => this.stopDriving(id, state));
      if (startRaceBtn) startRaceBtn.disabled = false;
      if (modalWindow) modalWindow.classList.remove('garageModal--active');
      resetBtn.disabled = true;
    });
  }

  async addListenerToGenerateBtn(obj: State) {
    const generateBtn = document.querySelector<HTMLButtonElement>('.btnGenerateCars');
    generateBtn?.addEventListener('click', (event) => {
      const btn = event.target as HTMLButtonElement;
      btn.disabled = true;
     // const cars = this.templateCreator.generateRandomCars();
      //Promise.all(cars.map(async (car) => this.loader.createCar(car)));
      this.drawCars(obj);
      btn.disabled = false;
    });
  }

  addListenersToCarField(obj: State) {
    this.addListenerToSelectBtn();
    this.addListenerToRemoveBtn(obj);
    this.addListenerToStartEngineBtn(obj);
    this.addListenerToStopEngineBtn(obj);
  }

  addListenerToSelectBtn() {
    const selectButtons = document.querySelectorAll('.car__field-select');
    const inputUpdateCar = document.querySelector<HTMLInputElement>('.updateCarInput');
    const inputUpdateColor = document.querySelector<HTMLInputElement>('.updateColorInput');
    const updateCarBtn = document.querySelector('.updateCarBtn');

    selectButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const carContainer = btn.closest('.car__field');
        if (carContainer && inputUpdateCar && inputUpdateColor) {
          const carId = carContainer.getAttribute('id');
          if (carId) {
            const carName = carContainer.querySelector('.car__field-model')?.textContent;
            const carColor = carContainer.querySelector('.car-image')?.getAttribute('data-color');
            if (carName && carColor) {
              inputUpdateCar.value = carName;
              inputUpdateCar.disabled = false;
              inputUpdateColor.value = carColor;
              updateCarBtn?.setAttribute('data-id', carId);
            }
          }
        }
      });
    });
  }

  addListenerToRemoveBtn(obj: State) {
    const removeButtons = document.querySelectorAll<HTMLButtonElement>('.car__field-remove');
    removeButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const carContainer = btn.closest('.car__field');
        if (carContainer) {
          const carId = carContainer.getAttribute('id');
          if (carId) {
            const numberId = Number(carId);
            try {
              this.deleteCar(numberId, obj);
            } catch (err) {
              console.log(err);
            }
          }
        }
      });
    });
  }

  async deleteCar(id: number, obj: State) {
    await this.loader.deleteCar(id);
    await this.loader.deleteWinner(id);
    this.drawCars(obj);
  }

  addListenerToStartEngineBtn(obj: State) {
    const startEngineButtons = document.querySelectorAll('.car-start-btn');
    startEngineButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const btn = event.target as HTMLButtonElement;
        btn.disabled = true;
        const carContainer = btn.closest('.car__field');
        const stopEngineBtn = carContainer?.querySelector<HTMLButtonElement>('.car-stop-btn');
        const id = carContainer?.getAttribute('id');
        if (id) {
          const numberId = Number(id);
          try {
            this.startDriving(numberId, obj);
          } catch (err) {
            btn.disabled = false;
          }
        }
        if (stopEngineBtn) stopEngineBtn.disabled = false;
      });
    });
  }

  addListenerToStopEngineBtn(obj: State) {
    const stopEngineButtons = document.querySelectorAll('.car-stop-btn');

    stopEngineButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const btn = event.target as HTMLButtonElement;
        btn.disabled = true;
        const carContainer = btn.closest('.car__field');
        const startEngineBtn = carContainer?.querySelector<HTMLButtonElement>('.car-start-btn');

        const id = carContainer?.getAttribute('id');
        if (id) {
          const numberId = Number(id);
          const carImage = carContainer?.querySelector<HTMLElement>('.car-image');
          if (carImage) {
            this.stopDriving(numberId, obj);
            if (startEngineBtn) startEngineBtn.disabled = false;
          }
        }
      });
    });
  }

  async startDriving(id: number, obj: State) {
    const state = obj;
    const { velocity, distance }: AnimationInfo = await this.loader.startEngine(id);
    const time = Math.round(distance / velocity);
    const carContainer = document.getElementById(`${id}`);
    const car = carContainer?.querySelector<HTMLElement>('.car-image');
    const flag = carContainer?.querySelector<HTMLElement>('.flag-image');

    if (car && flag) {
     // const htmlDistance = Math.floor(this.animation.getDistanceBetweenElements(car, flag) + 60);
     // state.animation[id] = this.animation.animation(car, htmlDistance, time);
    }
    const { success } = await this.loader.drive(id);
    if (!success) window.cancelAnimationFrame(obj.animation[id].id);
    return { success, id, time };
  }

  async stopDriving(id: number, obj: State) {
    const state = obj;
    const carContainer = document.getElementById(`${id}`);
    const car = carContainer?.querySelector<HTMLElement>('.car-image');
    if (car) {
      car.style.transform = 'translateX(0)';
    }
    if (state.animation[id]) window.cancelAnimationFrame(state.animation[id].id);
    await this.loader.stopEngine(id);
  }

  async race(obj: State) {
    const state = obj;
    const promises = state.cars.map(({ id }) => this.startDriving(id, obj));
    const winner = await this.raceAll(
      promises,
      state.cars.map((car) => car.id),
      obj,
    );
    return winner;
  }

  async raceAll(
    promises: Promises,
    ids: Array<number>,
    obj: State,
  ): Promise<{ name?: string; color?: string; id?: number; time: number }> {
    const { success, id, time } = await Promise.race(promises);
    const state = obj;

    if (!success) {
      const failedIndex = ids.findIndex((i) => i === id);
      const restPromises = [
        ...promises.slice(0, failedIndex),
        ...promises.slice(failedIndex + 1, promises.length),
      ];
      const restIds = [...ids.slice(0, failedIndex), ...ids.slice(failedIndex + 1, ids.length)];
      return this.raceAll(restPromises, restIds, obj);
    }
    return { ...state.cars.find((car) => car.id === id), time: +(time / 1000).toFixed(2) };
  }

  disableBtn(button: HTMLButtonElement) {
    const btn = button;
    btn.disabled = true;
  }

  enableBtn(button: HTMLButtonElement) {
    const btn = button;
    btn.disabled = false;
  }
}
