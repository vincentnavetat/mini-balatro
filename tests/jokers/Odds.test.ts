import { describe, it, expect } from "vitest";
import { Odds } from "../../app/models/jokers/Odds";
import { Card } from "../../app/models/Card";
import { Pair } from "../../app/models/figures/Pair";
import { HighCard } from "../../app/models/figures/HighCard";

describe("Odds Joker", () => {
  it("should have a name, description and price", () => {
    const odds = new Odds();
    expect(odds.name()).toBe("Odds");
    expect(odds.description()).toBe("+30 chips for every scoring card with an odd number");
    expect(odds.price()).toBe(2);
  });

  it("should not change the figure multiplier", () => {
    const odds = new Odds();
    expect(odds.affectFigureMultiplier(2)).toBe(2);
    expect(odds.affectFigureMultiplier(10)).toBe(10);
  });

  it("should add +30 per odd card via affectCardChip, 0 for even", () => {
    const odds = new Odds();
    expect(odds.affectCardChip(new Card("Heart", "2"))).toBe(0);
    expect(odds.affectCardChip(new Card("Heart", "3"))).toBe(30);
    expect(odds.affectCardChip(new Card("Heart", "5"))).toBe(30);
    expect(odds.affectCardChip(new Card("Heart", "Ace"))).toBe(30);
    expect(odds.affectCardChip(new Card("Heart", "10"))).toBe(0);
  });

  it("should add 30 chips per odd-numbered card (3, 5, 7, 9, Ace)", () => {
    const odds = new Odds();
    // Pair of 3s: 2 odd cards -> 60 extra chips
    const cards = [
      new Card("Heart", "3"),
      new Card("Diamond", "3"),
    ];
    const pair = new Pair(cards);
    // Score without jokers: (3 + 3 + 10) * 2 = 32
    // Score with Odds: (3 + 3 + 10 + 60) * 2 = 76 * 2 = 152
    expect(pair.score()).toBe(32);
    expect(pair.score([odds])).toBe(152);
  });

  it("should add no extra chips when no odd cards are played", () => {
    const odds = new Odds();
    const cards = [
      new Card("Heart", "2"),
      new Card("Diamond", "2"),
    ];
    const pair = new Pair(cards);
    // Score without jokers: (2 + 2 + 10) * 2 = 28
    // Score with Odds: same, no odd cards
    expect(pair.score()).toBe(28);
    expect(pair.score([odds])).toBe(28);
  });

  it("should add 30 chips for a single odd card in the hand", () => {
    const odds = new Odds();
    const cards = [
      new Card("Heart", "2"),
      new Card("Diamond", "5"),
    ];
    const pair = new Pair(cards);
    // One odd card (5) -> 30 extra chips
    // Score with Odds: (2 + 5 + 10 + 30) * 2 = 47 * 2 = 94
    expect(pair.score([odds])).toBe(94);
  });

  it("should count Ace as odd (11 points)", () => {
    const odds = new Odds();
    const cards = [
      new Card("Heart", "Ace"),
      new Card("Diamond", "Ace"),
    ];
    const pair = new Pair(cards);
    // Two odd cards (Ace = 11) -> 60 extra chips
    // Score with Odds: (11 + 11 + 10 + 60) * 2 = 92 * 2 = 184
    expect(pair.score([odds])).toBe(184);
  });

  it("should only count scoring cards (figure.cards), not non-scoring selected cards", () => {
    const odds = new Odds();
    // High Card: only 1 card is scoring. figureForCards returns HighCard([highest]).
    // Odds only sees that 1 card, so only scoring cards get +30.
    const ace = new Card("Heart", "Ace");
    const highCard = new HighCard([ace]);
    // One odd scoring card (Ace) -> 30 extra chips. (11 + 5 + 30) * 1 = 46
    expect(highCard.score([odds])).toBe(46);
    // Pair of 2s: 0 odd cards in scoring set -> no extra chips
    const twoCards = [new Card("Spade", "2"), new Card("Club", "2")];
    const pair = new Pair(twoCards);
    expect(pair.score([odds])).toBe(28);
  });
});
