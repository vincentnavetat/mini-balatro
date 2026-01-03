import { Figure } from "./Figure";
import { Card } from "./Card";

export class HighCard extends Figure {
  constructor(cards: Card[]) {
    super(cards);
  }

  name(): string {
    return "High card";
  }

  multiplier(): number {
    return 1;
  }

  score(): number {
    if (this._cards.length === 0) {
      return 0;
    }
    return this._cards[0].points * this.multiplier();
  }
}

