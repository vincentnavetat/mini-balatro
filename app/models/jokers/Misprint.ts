import { Joker } from "../Joker";
import type { Card } from "../Card";

export class Misprint extends Joker {
  affectFigureMultiplier(multiplier: number): number {
    return multiplier + Math.floor(Math.random() * 22);
  }

  affectCardChip(_card: Card): number {
    return 0;
  }

  name(): string {
    return "Misprint";
  }

  description(): string {
    return "+0 to +22 Multiplier to every figure played";
  }

  price(): number {
    return 4;
  }
}

