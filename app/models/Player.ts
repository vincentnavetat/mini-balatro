export class Player {
  private _money: number;

  constructor(money: number = 0) {
    this._money = money;
  }

  get money(): number {
    return this._money;
  }

  set money(value: number) {
    this._money = value;
  }
}

