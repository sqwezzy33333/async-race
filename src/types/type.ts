export type CarInfo = {
  name: string;
  color: string;
  id: number;
};

export type Sort = "id" | "wins" | "time";

export type Order = "ASC" | "DESC";

export type NewCar = {
  name: string;
  color: string;
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

export type WinnersObj = {
  page: number;
  limit?: number;
  sort: Sort;
  order: Order;
};

export type WinnerInfo = {
  id: number;
  time: number;
  wins?: number;
};