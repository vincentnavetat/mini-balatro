import { Figure } from "./Figure";
import { Card } from "./Card";

export class StraightFlush extends Figure {
  constructor(cards: Card[]) {
    super(cards);
  }

  name(): string {
    return "Straight flush";
  }

  multiplier(): number {
    return 8;
  }

  requiredCardCount(): number {
    return 5;
  }
}

