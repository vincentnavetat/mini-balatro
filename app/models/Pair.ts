import { Figure } from "./Figure";
import { Card } from "./Card";

export class Pair extends Figure {
  constructor(cards: Card[]) {
    super(cards);
  }

  name(): string {
    return "Pair";
  }

  multiplier(): number {
    return 2;
  }

  requiredCardCount(): number {
    return 2;
  }

  score(): number {
    let score = 0;
    this._cards.forEach((card) => {
      score += card.points;
    });
    return score * this.multiplier();
  }
}

