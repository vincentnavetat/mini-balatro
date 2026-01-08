import { Joker } from "../Joker";

export class GrosMichel extends Joker {
  affectFigureMultiplier(multiplier: number): number {
    return multiplier + 15;
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

