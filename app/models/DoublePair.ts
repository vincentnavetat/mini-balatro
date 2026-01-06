import { Figure } from "./Figure";
import { Card } from "./Card";

export class DoublePair extends Figure {
  constructor(cards: Card[]) {
    super(cards);
  }

  name(): string {
    return "Double Pair";
  }

  multiplier(): number {
    return 2;
  }

  chips(): number {
    return 20;
  }

  requiredCardCount(): number {
    return 4;
  }
}

