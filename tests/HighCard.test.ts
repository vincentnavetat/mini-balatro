import { describe, it, expect } from "vitest";
import { HighCard } from "../app/models/HighCard";
import { Card } from "../app/models/Card";
import { Figure } from "../app/models/Figure";

describe("HighCard", () => {
  describe("constructor", () => {
    it("should create a HighCard with cards", () => {
      const cards = [new Card("Heart", "Ace")];
      const highCard = new HighCard(cards);

      expect(highCard).toBeInstanceOf(HighCard);
      expect(highCard).toBeInstanceOf(Figure);
      expect(highCard.cards).toEqual(cards);
    });

    it("should create a HighCard with multiple cards", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "King"),
      ];
      const highCard = new HighCard(cards);

      expect(highCard.cards.length).toBe(2);
    });
  });

  describe("name", () => {
    it("should return 'High card'", () => {
      const cards = [new Card("Heart", "Ace")];
      const highCard = new HighCard(cards);

      expect(highCard.name()).toBe("High card");
    });
  });

  describe("multiplier", () => {
    it("should return 1", () => {
      const cards = [new Card("Heart", "Ace")];
      const highCard = new HighCard(cards);

      expect(highCard.multiplier()).toBe(1);
    });

    it("should always return 1 regardless of cards", () => {
      const cards1 = [new Card("Heart", "2")];
      const cards2 = [new Card("Diamond", "Ace")];
      const highCard1 = new HighCard(cards1);
      const highCard2 = new HighCard(cards2);

      expect(highCard1.multiplier()).toBe(1);
      expect(highCard2.multiplier()).toBe(1);
    });
  });

  describe("score", () => {
    it("should return 2 * 1 for a 2", () => {
      const cards = [new Card("Heart", "2")];
      const highCard = new HighCard(cards);

      expect(highCard.score()).toBe(2);
    });

    it("should return 3 * 1 for a 3", () => {
      const cards = [new Card("Heart", "3")];
      const highCard = new HighCard(cards);

      expect(highCard.score()).toBe(3);
    });

    it("should return 10 * 1 for a 10", () => {
      const cards = [new Card("Heart", "10")];
      const highCard = new HighCard(cards);

      expect(highCard.score()).toBe(10);
    });

    it("should return 10 * 1 for a Jack", () => {
      const cards = [new Card("Heart", "Jack")];
      const highCard = new HighCard(cards);

      expect(highCard.score()).toBe(10);
    });

    it("should return 10 * 1 for a Queen", () => {
      const cards = [new Card("Heart", "Queen")];
      const highCard = new HighCard(cards);

      expect(highCard.score()).toBe(10);
    });

    it("should return 10 * 1 for a King", () => {
      const cards = [new Card("Heart", "King")];
      const highCard = new HighCard(cards);

      expect(highCard.score()).toBe(10);
    });

    it("should return 11 * 1 for an Ace", () => {
      const cards = [new Card("Heart", "Ace")];
      const highCard = new HighCard(cards);

      expect(highCard.score()).toBe(11);
    });

    it("should use the first card for score calculation", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "King"),
      ];
      const highCard = new HighCard(cards);

      // Should use cards[0] (Ace = 11), not cards[1] (King = 10)
      expect(highCard.score()).toBe(11);
    });

    it("should return 0 for empty cards array", () => {
      const cards: Card[] = [];
      const highCard = new HighCard(cards);

      expect(highCard.score()).toBe(0);
    });

    it("should calculate score correctly for all numeric cards", () => {
      const numbers = ["2", "3", "4", "5", "6", "7", "8", "9", "10"];
      numbers.forEach((number, index) => {
        const cards = [new Card("Heart", number as any)];
        const highCard = new HighCard(cards);
        expect(highCard.score()).toBe(index + 2); // 2, 3, 4, ..., 10
      });
    });

    it("should calculate score correctly for all face cards", () => {
      const testCases = [
        { number: "Jack", expected: 10 },
        { number: "Queen", expected: 10 },
        { number: "King", expected: 10 },
        { number: "Ace", expected: 11 },
      ];

      testCases.forEach(({ number, expected }) => {
        const cards = [new Card("Heart", number as any)];
        const highCard = new HighCard(cards);
        expect(highCard.score()).toBe(expected);
      });
    });
  });

  describe("inheritance", () => {
    it("should be an instance of Figure", () => {
      const cards = [new Card("Heart", "Ace")];
      const highCard = new HighCard(cards);

      expect(highCard).toBeInstanceOf(Figure);
    });

    it("should implement all abstract methods from Figure", () => {
      const cards = [new Card("Heart", "Ace")];
      const highCard = new HighCard(cards);

      expect(typeof highCard.name()).toBe("string");
      expect(typeof highCard.multiplier()).toBe("number");
      expect(typeof highCard.score()).toBe("number");
    });
  });

  describe("edge cases", () => {
    it("should handle cards with different colours but same number", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "Ace"),
        new Card("Club", "Ace"),
      ];
      const highCard = new HighCard(cards);

      // Should still use first card
      expect(highCard.score()).toBe(11);
    });

    it("should work with a single card", () => {
      const cards = [new Card("Spade", "7")];
      const highCard = new HighCard(cards);

      expect(highCard.score()).toBe(7);
      expect(highCard.name()).toBe("High card");
      expect(highCard.multiplier()).toBe(1);
    });
  });
});

