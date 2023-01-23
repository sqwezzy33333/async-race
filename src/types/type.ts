export type CarInfo = {
  name: string;
  color: string;
  id: number;
};

export type NewCar = {
  name: string;
  color: string;
};

export type Sort = 'id' | 'wins' | 'time';

export type Order = 'ASC' | 'DESC';

export type WinnersObj = {
  page: number;
  limit?: number;
  sort: Sort;
  order: Order;
};

export type UpdateCar = {
  name: string;
  color: string;
};

export type WinnerInfo = {
  id: number;
  time: number;
  wins?: number;
};

export type State = {
  view: string;
  page: number;
  animation: Animation[];
  cars: CarInfo[];
  winnersPage: number;
  sort: Sort;
  order: Order;
};

type Animation = {
  id: number;
};

export type AnimationInfo = {
  velocity: number;
  distance: number;
};

export type GetWinners = {
  items: {
    car: CarInfo;
    id: number;
    time: number;
    wins?: number | undefined;
  }[];
  count: string | null;
};

export type GetData = {
  items: CarInfo[];
  count: string | null;
};

export type Promises = Promise<{ success: boolean; id: number; time: number }>[];
