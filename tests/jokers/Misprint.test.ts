import { describe, it, expect } from "vitest";
import { Misprint } from "../../app/models/jokers/Misprint";
import { Card } from "../../app/models/Card";
import { Pair } from "../../app/models/figures/Pair";

describe("Misprint Joker", () => {
  it("should have a name, description and price", () => {
    const misprint = new Misprint();
    expect(misprint.name()).toBe("Misprint");
    expect(misprint.description()).toBe("+0 to +22 Multiplier to every figure played");
    expect(misprint.price()).toBe(4);
  });

  it("should increase the figure multiplier by a random amount between 0 and 21", () => {
    const misprint = new Misprint();
    
    // Run multiple times to check range
    for (let i = 0; i < 100; i++) {
      const result = misprint.affectFigureMultiplier(10);
      expect(result).toBeGreaterThanOrEqual(10);
      expect(result).toBeLessThanOrEqual(31); // 10 + 21
    }
  });

  it("should affect the figure score within a range", () => {
    const misprint = new Misprint();
    const cards = [
      new Card("Heart", "2"),
      new Card("Diamond", "2"),
    ];
    const pair = new Pair(cards); // Pair multiplier is 2, chips is 10
    // Each card is 2 points.
    // Score without jokers: (2 + 2 + 10) * 2 = 28
    // Min Score with Misprint: (14) * (2 + 0) = 28
    // Max Score with Misprint: (14) * (2 + 21) = 322
    
    expect(pair.score()).toBe(28);
    
    for (let i = 0; i < 100; i++) {
      const score = pair.score([misprint]);
      expect(score).toBeGreaterThanOrEqual(28);
      expect(score).toBeLessThanOrEqual(322);
    }
  });
});

