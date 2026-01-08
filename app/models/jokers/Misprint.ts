import { Joker } from "../Joker";

export class Misprint extends Joker {
  affectFigureMultiplier(multiplier: number): number {
    return multiplier + Math.floor(Math.random() * 22);
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

