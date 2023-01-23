export default class Animation {
  getPositionAtCenter(element: HTMLElement) {
    const { top, left, width, height } = element.getBoundingClientRect();
    return {
      x: left + width / 2,
      y: top + height / 2,
    };
  }

  getDistanceBetweenElements(a: HTMLElement, b: HTMLElement) {
    const aPosition = this.getPositionAtCenter(a);
    const bPosition = this.getPositionAtCenter(b);

    return Math.hypot(aPosition.x - bPosition.x, aPosition.y - bPosition.y);
  }

  animation(car: HTMLElement, distance: number, animationTime: number) {
    let start: number | null = null;
    const animatedCar = car;
    const state = {
      id: 0,
    };
    function step(timestamp: number) {
      if (!start) start = timestamp;
      const time = timestamp - start;
      const passed = Math.round(time * (distance / animationTime));

      animatedCar.style.transform = `translateX(${Math.min(passed, distance)}px)`;

      if (passed < distance) {
        state.id = window.requestAnimationFrame(step);
      }
    }

    state.id = window.requestAnimationFrame(step);
    return state;
  }
}
