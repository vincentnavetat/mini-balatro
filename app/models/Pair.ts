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

  chips(): number {
    return 10;
  }

  requiredCardCount(): number {
    return 2;
  }
}

