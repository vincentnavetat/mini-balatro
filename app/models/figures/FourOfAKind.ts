import { Figure } from "../Figure";
import { Card } from "../Card";

export class FourOfAKind extends Figure {
  constructor(cards: Card[]) {
    super(cards);
  }

  name(): string {
    return "Four of a kind";
  }

  multiplier(): number {
    return 7;
  }

  chips(): number {
    return 60;
  }

  requiredCardCount(): number {
    return 4;
  }
}



