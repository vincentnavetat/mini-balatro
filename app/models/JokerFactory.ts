import { Jimbo } from "./jokers/Jimbo";
import { GrosMichel } from "./jokers/GrosMichel";
import { Misprint } from "./jokers/Misprint";
import type { Joker } from "./Joker";

export class JokerFactory {
  static getAllJokers(): Joker[] {
    return [
      new Jimbo(),
      new GrosMichel(),
      new Misprint(),
    ];
  }

  static createJoker(name: string): Joker | null {
    switch (name) {
      case "Jimbo": return new Jimbo();
      case "Gros Michel": return new GrosMichel();
      case "Misprint": return new Misprint();
      default: return null;
    }
  }
}

