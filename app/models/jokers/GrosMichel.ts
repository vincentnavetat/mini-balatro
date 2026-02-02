import { Joker } from "../Joker";
import type { Card } from "../Card";

export class GrosMichel extends Joker {
  affectFigureMultiplier(multiplier: number): number {
    return multiplier + 15;
  }

  affectCardChip(_card: Card): number {
    return 0;
  }

  name(): string {
    return "Gros Michel";
  }

  description(): string {
    return "+15 Multiplier to every figure played";
  }

  price(): number {
    return 4;
  }
}

