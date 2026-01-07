import { describe, it, expect } from "vitest";
import { Joker } from "../app/models/Joker";

class TestJoker extends Joker {
  affectFigureMultiplier(multiplier: number): number {
    return multiplier + 2;
  }
}

describe("Joker", () => {
  it("should be able to affect the multiplier", () => {
    const joker = new TestJoker();
    expect(joker.affectFigureMultiplier(10)).toBe(12);
  });
});

