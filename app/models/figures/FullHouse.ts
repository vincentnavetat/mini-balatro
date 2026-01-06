import { Figure } from "../Figure";
import { Card } from "../Card";

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

  chips(): number {
    return 40;
  }

  requiredCardCount(): number {
    return 5;
  }
}

