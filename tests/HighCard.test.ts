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

    it("should throw error when created with multiple cards", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "King"),
      ];

      expect(() => {
        new HighCard(cards);
      }).toThrow("High card requires exactly 1 card(s), but got 2");
    });

    it("should throw error when created with no cards", () => {
      const cards: Card[] = [];

      expect(() => {
        new HighCard(cards);
      }).toThrow("High card requires exactly 1 card(s), but got 0");
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
    it("should return 2 + 5 for a 2", () => {
      const cards = [new Card("Heart", "2")];
      const highCard = new HighCard(cards);

      expect(highCard.score()).toBe(7); // 2 + 5
    });

    it("should return 3 + 5 for a 3", () => {
      const cards = [new Card("Heart", "3")];
      const highCard = new HighCard(cards);

      expect(highCard.score()).toBe(8); // 3 + 5
    });

    it("should return 10 + 5 for a 10", () => {
      const cards = [new Card("Heart", "10")];
      const highCard = new HighCard(cards);

      expect(highCard.score()).toBe(15); // 10 + 5
    });

    it("should return 10 + 5 for a Jack", () => {
      const cards = [new Card("Heart", "Jack")];
      const highCard = new HighCard(cards);

      expect(highCard.score()).toBe(15); // 10 + 5
    });

    it("should return 10 + 5 for a Queen", () => {
      const cards = [new Card("Heart", "Queen")];
      const highCard = new HighCard(cards);

      expect(highCard.score()).toBe(15); // 10 + 5
    });

    it("should return 10 + 5 for a King", () => {
      const cards = [new Card("Heart", "King")];
      const highCard = new HighCard(cards);

      expect(highCard.score()).toBe(15); // 10 + 5
    });

    it("should return 11 + 5 for an Ace", () => {
      const cards = [new Card("Heart", "Ace")];
      const highCard = new HighCard(cards);

      expect(highCard.score()).toBe(16); // 11 + 5
    });


    it("should calculate score correctly for all numeric cards", () => {
      const numbers = ["2", "3", "4", "5", "6", "7", "8", "9", "10"];
      numbers.forEach((number, index) => {
        const cards = [new Card("Heart", number as any)];
        const highCard = new HighCard(cards);
        expect(highCard.score()).toBe(index + 2 + 5); // 2+5, 3+5, 4+5, ..., 10+5
      });
    });

    it("should calculate score correctly for all face cards", () => {
      const testCases = [
        { number: "Jack", expected: 15 }, // 10 + 5
        { number: "Queen", expected: 15 }, // 10 + 5
        { number: "King", expected: 15 }, // 10 + 5
        { number: "Ace", expected: 16 }, // 11 + 5
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
      expect(typeof highCard.requiredCardCount()).toBe("number");
    });
  });

  describe("edge cases", () => {
    it("should work with a single card", () => {
      const cards = [new Card("Spade", "7")];
      const highCard = new HighCard(cards);

      expect(highCard.score()).toBe(12); // 7 + 5
      expect(highCard.name()).toBe("High card");
      expect(highCard.multiplier()).toBe(1);
    });
  });

  describe("requiredCardCount", () => {
    it("should return 1", () => {
      const cards = [new Card("Heart", "Ace")];
      const highCard = new HighCard(cards);

      expect(highCard.requiredCardCount()).toBe(1);
    });
  });

  describe("inherited score method", () => {
    it("should use inherited score() from Figure that adds chips to each card's points", () => {
      const cards = [new Card("Heart", "5")];
      const highCard = new HighCard(cards);

      // Inherited score() = sum of (card points + chips) for each card
      // = 5 + 5 = 10
      expect(highCard.score()).toBe(10);
    });
  });
});

