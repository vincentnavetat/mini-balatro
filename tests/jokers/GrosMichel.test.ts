import { describe, it, expect } from "vitest";
import { GrosMichel } from "../../app/models/jokers/GrosMichel";
import { Card } from "../../app/models/Card";
import { Pair } from "../../app/models/figures/Pair";

describe("Gros Michel Joker", () => {
  it("should have a name, description and price", () => {
    const grosMichel = new GrosMichel();
    expect(grosMichel.name()).toBe("Gros Michel");
    expect(grosMichel.description()).toBe("+15 Multiplier to every figure played");
    expect(grosMichel.price()).toBe(4);
  });

  it("should increase the figure multiplier by 15", () => {
    const grosMichel = new GrosMichel();
    expect(grosMichel.affectFigureMultiplier(10)).toBe(25);
    expect(grosMichel.affectFigureMultiplier(1)).toBe(16);
  });

  it("should affect the figure score", () => {
    const grosMichel = new GrosMichel();
    const cards = [
      new Card("Heart", "2"),
      new Card("Diamond", "2"),
    ];
    const pair = new Pair(cards); // Pair multiplier is 2, chips is 10
    // Each card is 2 points.
    // Score without jokers: (2 + 2 + 10) * 2 = 14 * 2 = 28
    // Score with Gros Michel: (2 + 2 + 10) * (2 + 15) = 14 * 17 = 238
    
    expect(pair.score()).toBe(28);
    expect(pair.score([grosMichel])).toBe(238);
  });
});

