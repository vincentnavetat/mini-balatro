import { describe, it, expect } from "vitest";
import { Jimbo } from "../../app/models/jokers/Jimbo";
import { Card } from "../../app/models/Card";
import { Pair } from "../../app/models/figures/Pair";

describe("Jimbo Joker", () => {
  it("should have a name and price", () => {
    const jimbo = new Jimbo();
    expect(jimbo.name()).toBe("Jimbo");
    expect(jimbo.price()).toBe(2);
  });

  it("should increase the figure multiplier by 4", () => {
    const jimbo = new Jimbo();
    expect(jimbo.affectFigureMultiplier(10)).toBe(14);
    expect(jimbo.affectFigureMultiplier(1)).toBe(5);
  });

  it("should affect the figure score", () => {
    const jimbo = new Jimbo();
    const cards = [
      new Card("Heart", "2"),
      new Card("Diamond", "2"),
    ];
    const pair = new Pair(cards); // Pair multiplier is 2, chips is 10
    // Each card is 2 points.
    // Score without jokers: (2+10 + 2+10) * 2 = 24 * 2 = 48
    // Score with Jimbo: (2+10 + 2+10) * (2+4) = 24 * 6 = 144
    
    expect(pair.score()).toBe(48);
    expect(pair.score([jimbo])).toBe(144);
  });
});

