import { Joker } from "./Joker";

export class Player {
  private _money: number;
  private _jokers: Joker[] = [];

  constructor(money: number = 0) {
    this._money = money;
  }

  get money(): number {
    return this._money;
  }

  set money(value: number) {
    this._money = value;
  }

  get jokers(): readonly Joker[] {
    return this._jokers;
  }

  addJoker(joker: Joker): void {
    if (this._jokers.length >= 5) {
      throw new Error("Cannot have more than 5 jokers");
    }
    this._jokers.push(joker);
  }

  addMoney(amount: number): void {
    this._money += amount;
  }
}

