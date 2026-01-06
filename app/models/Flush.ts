import { Figure } from "./Figure";
import { Card } from "./Card";

export class Flush extends Figure {
  constructor(cards: Card[]) {
    super(cards);
  }

  name(): string {
    return "Flush";
  }

  multiplier(): number {
    return 4;
  }

  chips(): number {
    return 35;
  }

  requiredCardCount(): number {
    return 5;
  }
}

