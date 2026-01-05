import { describe, it, expect } from "vitest";
import { FourOfAKind } from "../app/models/FourOfAKind";
import { Card } from "../app/models/Card";
import { Figure } from "../app/models/Figure";

describe("FourOfAKind", () => {
  describe("constructor", () => {
    it("should create a FourOfAKind with cards", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "Ace"),
        new Card("Club", "Ace"),
        new Card("Spade", "Ace"),
      ];
      const fourOfAKind = new FourOfAKind(cards);

      expect(fourOfAKind).toBeInstanceOf(FourOfAKind);
      expect(fourOfAKind).toBeInstanceOf(Figure);
      expect(fourOfAKind.cards).toEqual(cards);
    });

    it("should throw error when created with wrong number of cards", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "Ace"),
        new Card("Club", "Ace"),
      ];

      expect(() => {
        new FourOfAKind(cards);
      }).toThrow("Four of a kind requires exactly 4 card(s), but got 3");
    });
  });

  describe("name", () => {
    it("should return 'Four of a kind'", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "Ace"),
        new Card("Club", "Ace"),
        new Card("Spade", "Ace"),
      ];
      const fourOfAKind = new FourOfAKind(cards);

      expect(fourOfAKind.name()).toBe("Four of a kind");
    });
  });

  describe("multiplier", () => {
    it("should return 7", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "Ace"),
        new Card("Club", "Ace"),
        new Card("Spade", "Ace"),
      ];
      const fourOfAKind = new FourOfAKind(cards);

      expect(fourOfAKind.multiplier()).toBe(7);
    });
  });

  describe("score", () => {
    it("should return (11 + 11 + 11 + 11) * 7 for four Aces", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "Ace"),
        new Card("Club", "Ace"),
        new Card("Spade", "Ace"),
      ];
      const fourOfAKind = new FourOfAKind(cards);

      expect(fourOfAKind.score()).toBe(308); // (11 + 11 + 11 + 11) * 7
    });

    it("should return (5 + 5 + 5 + 5) * 7 for four 5s", () => {
      const cards = [
        new Card("Heart", "5"),
        new Card("Diamond", "5"),
        new Card("Club", "5"),
        new Card("Spade", "5"),
      ];
      const fourOfAKind = new FourOfAKind(cards);

      expect(fourOfAKind.score()).toBe(140); // (5 + 5 + 5 + 5) * 7
    });
  });

  describe("requiredCardCount", () => {
    it("should return 4", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "Ace"),
        new Card("Club", "Ace"),
        new Card("Spade", "Ace"),
      ];
      const fourOfAKind = new FourOfAKind(cards);

      expect(fourOfAKind.requiredCardCount()).toBe(4);
    });
  });
});

