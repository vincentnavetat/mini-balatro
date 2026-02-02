import { Card } from "./Card";
import { Joker } from "./Joker";

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
  abstract chips(): number;
  abstract requiredCardCount(): number;

  score(jokers: readonly Joker[] = []): number {
    let multiplier = this.multiplier();
    for (const joker of jokers) {
      multiplier = joker.affectFigureMultiplier(multiplier);
    }

    let score = 0;
    this._cards.forEach((card) => {
      score += card.points;
    });
    const extraChips = this._cards.reduce(
      (sum, card) => sum + jokers.reduce((cardSum, joker) => cardSum + joker.affectCardChip(card), 0),
      0
    );
    const totalChips = this.chips() + extraChips;
    return (score + totalChips) * multiplier;
  }

  protected validateCardCount(): void {
    const required = this.requiredCardCount();
    if (this._cards.length !== required) {
      throw new Error(
        `${this.name()} requires exactly ${required} card(s), but got ${this._cards.length}`
      );
    }
  }
}

