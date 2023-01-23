import Garage from "./garage";
import { State } from "../../types/type";

export default class MainSection {
  mainSection: HTMLElement;
  garage: Garage;

  constructor() {
    this.mainSection = document.createElement("div");
    this.garage = new Garage();
  }

  drawMainSection(obj: State) {
    const mainContainer = document.querySelector(".main");
    this.garage.drawGarage(obj);
    this.mainSection.classList.add("mainSection");
    this.mainSection.append(this.garage.garageContainer);
    if (mainContainer) {
      mainContainer.innerHTML = "";
      mainContainer.append(this.mainSection);
    }
  }
}
