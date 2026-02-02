import { Joker } from "../Joker";
import type { Card } from "../Card";

export class Odds extends Joker {
  affectFigureMultiplier(multiplier: number): number {
    return multiplier;
  }

  affectCardChip(card: Card): number {
    return card.points % 2 === 1 ? 30 : 0;
  }

  name(): string {
    return "Odds";
  }

  description(): string {
    return "+30 chips for every scoring card with an odd number";
  }

  price(): number {
    return 2;
  }
}
