import { Figure } from "../Figure";
import { Card } from "../Card";

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

  chips(): number {
    return 5;
  }

  requiredCardCount(): number {
    return 1;
  }
}



