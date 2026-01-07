import { Joker } from "../Joker";

export class Jimbo extends Joker {
  affectFigureMultiplier(multiplier: number): number {
    return multiplier + 4;
  }

  name(): string {
    return "Jimbo";
  }

  price(): number {
    return 2;
  }
}

