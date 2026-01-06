import { Figure } from "../Figure";
import { Card } from "../Card";

export class Straight extends Figure {
  constructor(cards: Card[]) {
    super(cards);
  }

  name(): string {
    return "Straight";
  }

  multiplier(): number {
    return 4;
  }

  chips(): number {
    return 30;
  }

  requiredCardCount(): number {
    return 5;
  }
}

