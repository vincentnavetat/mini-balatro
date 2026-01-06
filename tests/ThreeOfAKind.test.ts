import { describe, it, expect } from "vitest";
import { ThreeOfAKind } from "../app/models/ThreeOfAKind";
import { Card } from "../app/models/Card";
import { Figure } from "../app/models/Figure";

describe("ThreeOfAKind", () => {
  describe("constructor", () => {
    it("should create a ThreeOfAKind with cards", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "Ace"),
        new Card("Club", "Ace"),
      ];
      const threeOfAKind = new ThreeOfAKind(cards);

      expect(threeOfAKind).toBeInstanceOf(ThreeOfAKind);
      expect(threeOfAKind).toBeInstanceOf(Figure);
      expect(threeOfAKind.cards).toEqual(cards);
    });

    it("should throw error when created with wrong number of cards", () => {
      const cards = [new Card("Heart", "Ace"), new Card("Diamond", "Ace")];

      expect(() => {
        new ThreeOfAKind(cards);
      }).toThrow("Three of a kind requires exactly 3 card(s), but got 2");
    });
  });

  describe("name", () => {
    it("should return 'Three of a kind'", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "Ace"),
        new Card("Club", "Ace"),
      ];
      const threeOfAKind = new ThreeOfAKind(cards);

      expect(threeOfAKind.name()).toBe("Three of a kind");
    });
  });

  describe("multiplier", () => {
    it("should return 3", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "Ace"),
        new Card("Club", "Ace"),
      ];
      const threeOfAKind = new ThreeOfAKind(cards);

      expect(threeOfAKind.multiplier()).toBe(3);
    });
  });

  describe("score", () => {
    it("should return (11 + 30) + (11 + 30) + (11 + 30) for three Aces", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "Ace"),
        new Card("Club", "Ace"),
      ];
      const threeOfAKind = new ThreeOfAKind(cards);

      expect(threeOfAKind.score()).toBe(123); // (11 + 30) + (11 + 30) + (11 + 30)
    });

    it("should return (5 + 30) + (5 + 30) + (5 + 30) for three 5s", () => {
      const cards = [
        new Card("Heart", "5"),
        new Card("Diamond", "5"),
        new Card("Club", "5"),
      ];
      const threeOfAKind = new ThreeOfAKind(cards);

      expect(threeOfAKind.score()).toBe(105); // (5 + 30) + (5 + 30) + (5 + 30)
    });
  });

  describe("requiredCardCount", () => {
    it("should return 3", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "Ace"),
        new Card("Club", "Ace"),
      ];
      const threeOfAKind = new ThreeOfAKind(cards);

      expect(threeOfAKind.requiredCardCount()).toBe(3);
    });
  });
});

