import { describe, it, expect } from "vitest";
import { FullHouse } from "../app/models/FullHouse";
import { Card } from "../app/models/Card";
import { Figure } from "../app/models/Figure";

describe("FullHouse", () => {
  describe("constructor", () => {
    it("should create a FullHouse with cards", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "Ace"),
        new Card("Club", "Ace"),
        new Card("Spade", "King"),
        new Card("Heart", "King"),
      ];
      const fullHouse = new FullHouse(cards);

      expect(fullHouse).toBeInstanceOf(FullHouse);
      expect(fullHouse).toBeInstanceOf(Figure);
      expect(fullHouse.cards).toEqual(cards);
    });

    it("should throw error when created with wrong number of cards", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "Ace"),
        new Card("Club", "Ace"),
      ];

      expect(() => {
        new FullHouse(cards);
      }).toThrow("Full house requires exactly 5 card(s), but got 3");
    });
  });

  describe("name", () => {
    it("should return 'Full house'", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "Ace"),
        new Card("Club", "Ace"),
        new Card("Spade", "King"),
        new Card("Heart", "King"),
      ];
      const fullHouse = new FullHouse(cards);

      expect(fullHouse.name()).toBe("Full house");
    });
  });

  describe("multiplier", () => {
    it("should return 4", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "Ace"),
        new Card("Club", "Ace"),
        new Card("Spade", "King"),
        new Card("Heart", "King"),
      ];
      const fullHouse = new FullHouse(cards);

      expect(fullHouse.multiplier()).toBe(4);
    });
  });

  describe("score", () => {
    it("should calculate score correctly for a full house", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "Ace"),
        new Card("Club", "Ace"),
        new Card("Spade", "King"),
        new Card("Heart", "King"),
      ];
      const fullHouse = new FullHouse(cards);

      expect(fullHouse.score()).toBe(253); // (11 + 40) + (11 + 40) + (11 + 40) + (10 + 40) + (10 + 40)
    });
  });

  describe("requiredCardCount", () => {
    it("should return 5", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "Ace"),
        new Card("Club", "Ace"),
        new Card("Spade", "King"),
        new Card("Heart", "King"),
      ];
      const fullHouse = new FullHouse(cards);

      expect(fullHouse.requiredCardCount()).toBe(5);
    });
  });
});

