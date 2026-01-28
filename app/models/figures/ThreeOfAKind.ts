import { Figure } from "../Figure";
import { Card } from "../Card";

export class ThreeOfAKind extends Figure {
  constructor(cards: Card[]) {
    super(cards);
  }

  name(): string {
    return "Three of a kind";
  }

  multiplier(): number {
    return 3;
  }

  chips(): number {
    return 30;
  }

  requiredCardCount(): number {
    return 3;
  }
}



