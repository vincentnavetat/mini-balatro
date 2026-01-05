import { Figure } from "./Figure";
import { Card } from "./Card";

export class FullHouse extends Figure {
  constructor(cards: Card[]) {
    super(cards);
  }

  name(): string {
    return "Full house";
  }

  multiplier(): number {
    return 4;
  }

  requiredCardCount(): number {
    return 5;
  }
}

