import { describe, it, expect } from "vitest";
import { Joker } from "../app/models/Joker";
import { Card } from "../app/models/Card";

class TestJoker extends Joker {
  affectFigureMultiplier(multiplier: number): number {
    return multiplier + 2;
  }

  affectCardChip(_card: Card): number {
    return 0;
  }

  name(): string {
    return "Test Joker";
  }

  description(): string {
    return "Test";
  }

  price(): number {
    return 0;
  }
}

describe("Joker", () => {
  it("should be able to affect the multiplier", () => {
    const joker = new TestJoker();
    expect(joker.affectFigureMultiplier(10)).toBe(12);
  });

  it("should have affectCardChip called per scoring card", () => {
    const joker = new TestJoker();
    const card = new Card("Heart", "5");
    expect(joker.affectCardChip(card)).toBe(0);
  });
});

