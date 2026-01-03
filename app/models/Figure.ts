import { Card } from "./Card";

export abstract class Figure {
  protected _cards: Card[];

  constructor(cards: Card[]) {
    this._cards = cards;
    this.validateCardCount();
  }

  get cards(): readonly Card[] {
    return this._cards;
  }

  abstract name(): string;
  abstract multiplier(): number;
  abstract score(): number;
  abstract requiredCardCount(): number;

  protected validateCardCount(): void {
    const required = this.requiredCardCount();
    if (this._cards.length !== required) {
      throw new Error(
        `${this.name()} requires exactly ${required} card(s), but got ${this._cards.length}`
      );
    }
  }
}

