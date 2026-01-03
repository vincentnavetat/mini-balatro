import { Card } from "./Card";

export abstract class Figure {
  protected _cards: Card[];

  constructor(cards: Card[]) {
    this._cards = cards;
  }

  get cards(): readonly Card[] {
    return this._cards;
  }

  abstract name(): string;
  abstract multiplier(): number;
  abstract score(): number;
}

