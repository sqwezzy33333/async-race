import { CarInfo, NewCar, Order, Sort, WinnerInfo, WinnersObj } from '../../types/type';

export default class Loader {
  garage: string = 'http://127.0.0.1:3000/garage';

  engine: string = 'http://127.0.0.1:3000/engine';

  winners: string = 'http://127.0.0.1:3000/winners';

  async getCars(page: number, limit: number = 7) {
    const response = await fetch(`${this.garage}?_page=${page}&_limit=${limit}`);

    return {
      items: await response.json(),
      count: response.headers.get('X-Total-Count'),
    };
  }

  async getCar(id: number): Promise<CarInfo> {
    const car = (await fetch(`${this.garage}/${id}`)).json();
    return car;
  }

  async createCar(data: NewCar) {
    const response = await fetch(this.garage, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  }

  async deleteCar(id: number) {
    const response = await fetch(`${this.garage}/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }

  async updateCar(id: number, data: NewCar) {
    const response = await fetch(`${this.garage}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  }

  async startEngine(id: number) {
    const response = await fetch(`${this.engine}?id=${id}&status=started`, { method: 'PATCH' });
    return response.json();
  }

  async stopEngine(id: number) {
    const response = await fetch(`${this.engine}?id=${id}&status=stopped`, { method: 'PATCH' });
    return response.json();
  }

  async drive(id: number) {
    const response = await fetch(`${this.engine}?id=${id}&status=drive`, {
      method: 'PATCH',
    }).catch();
    return response.status !== 200 ? { success: false } : { ...(await response.json()) };
  }

  getSortOrder(sort: Sort, order: Order) {
    if (sort && order) return `&_sort=${sort}&_order=${order}`;
    return '';
  }

  async getWinners({ page, limit = 10, sort, order }: WinnersObj) {
    const response = await fetch(
      `${this.winners}?_page=${page}&_limit=${limit}${this.getSortOrder(sort, order)}`,
    );
    const items: WinnerInfo[] = await response.json();

    return {
      items: await Promise.all(
        items.map(async (winner: WinnerInfo) => ({ ...winner, car: await this.getCar(winner.id) })),
      ),
      count: response.headers.get('X-Total-Count'),
    };
  }

  async getWinner(id: number) {
    const winner = await fetch(`${this.winners}/${id}`);
    return winner.json();
  }

  async getWinnerStatus(id: number) {
    const winner = await fetch(`${this.winners}/${id}`);
    return winner.status;
  }

  async deleteWinner(id: number) {
    const winner = await fetch(`${this.winners}/${id}`, { method: 'DELETE' });
    return winner.json();
  }

  async createWinner(body: WinnerInfo) {
    const newWinner = await fetch(this.winners, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return newWinner.json();
  }

  async updateWinner(id: number, body: { wins: number; time: number }) {
    const updatedWinner = await fetch(`${this.winners}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return updatedWinner.json();
  }

  async saveWinner(obj: WinnerInfo) {
    const winnerStatus = await this.getWinnerStatus(obj.id);

    if (winnerStatus === 404) {
      await this.createWinner({
        id: obj.id,
        wins: 1,
        time: obj.time,
      });
    } else {
      const winner = await this.getWinner(obj.id);
      await this.updateWinner(obj.id, {
        wins: winner.wins + 1,
        time: obj.time < winner.time ? obj.time : winner.time,
      });
    }
  }
}
