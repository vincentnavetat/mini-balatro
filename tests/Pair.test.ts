import { describe, it, expect } from "vitest";
import { Pair } from "../app/models/Pair";
import { Card } from "../app/models/Card";
import { Figure } from "../app/models/Figure";

describe("Pair", () => {
  describe("constructor", () => {
    it("should create a Pair with cards", () => {
      const cards = [new Card("Heart", "Ace"), new Card("Diamond", "Ace")];
      const pair = new Pair(cards);

      expect(pair).toBeInstanceOf(Pair);
      expect(pair).toBeInstanceOf(Figure);
      expect(pair.cards).toEqual(cards);
    });

    it("should throw error when created with single card", () => {
      const cards = [new Card("Heart", "Ace")];

      expect(() => {
        new Pair(cards);
      }).toThrow("Pair requires exactly 2 card(s), but got 1");
    });

    it("should throw error when created with no cards", () => {
      const cards: Card[] = [];

      expect(() => {
        new Pair(cards);
      }).toThrow("Pair requires exactly 2 card(s), but got 0");
    });

    it("should throw error when created with more than 2 cards", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "Ace"),
        new Card("Club", "King"),
      ];

      expect(() => {
        new Pair(cards);
      }).toThrow("Pair requires exactly 2 card(s), but got 3");
    });
  });

  describe("name", () => {
    it("should return 'Pair'", () => {
      const cards = [new Card("Heart", "Ace"), new Card("Diamond", "Ace")];
      const pair = new Pair(cards);

      expect(pair.name()).toBe("Pair");
    });
  });

  describe("multiplier", () => {
    it("should return 2", () => {
      const cards = [new Card("Heart", "Ace"), new Card("Diamond", "Ace")];
      const pair = new Pair(cards);

      expect(pair.multiplier()).toBe(2);
    });

    it("should always return 2 regardless of cards", () => {
      const cards1 = [new Card("Heart", "2"), new Card("Diamond", "2")];
      const cards2 = [new Card("Heart", "Ace"), new Card("Diamond", "Ace")];
      const pair1 = new Pair(cards1);
      const pair2 = new Pair(cards2);

      expect(pair1.multiplier()).toBe(2);
      expect(pair2.multiplier()).toBe(2);
    });
  });

  describe("score", () => {
    it("should return (2 + 2) * 2 for two 2s", () => {
      const cards = [new Card("Heart", "2"), new Card("Diamond", "2")];
      const pair = new Pair(cards);

      expect(pair.score()).toBe(8); // (2 + 2) * 2
    });

    it("should return (3 + 3) * 2 for two 3s", () => {
      const cards = [new Card("Heart", "3"), new Card("Diamond", "3")];
      const pair = new Pair(cards);

      expect(pair.score()).toBe(12); // (3 + 3) * 2
    });

    it("should return (10 + 10) * 2 for two 10s", () => {
      const cards = [new Card("Heart", "10"), new Card("Diamond", "10")];
      const pair = new Pair(cards);

      expect(pair.score()).toBe(40); // (10 + 10) * 2
    });

    it("should return (10 + 10) * 2 for two Jacks", () => {
      const cards = [new Card("Heart", "Jack"), new Card("Diamond", "Jack")];
      const pair = new Pair(cards);

      expect(pair.score()).toBe(40); // (10 + 10) * 2
    });

    it("should return (10 + 10) * 2 for two Queens", () => {
      const cards = [new Card("Heart", "Queen"), new Card("Diamond", "Queen")];
      const pair = new Pair(cards);

      expect(pair.score()).toBe(40); // (10 + 10) * 2
    });

    it("should return (10 + 10) * 2 for two Kings", () => {
      const cards = [new Card("Heart", "King"), new Card("Diamond", "King")];
      const pair = new Pair(cards);

      expect(pair.score()).toBe(40); // (10 + 10) * 2
    });

    it("should return (11 + 11) * 2 for two Aces", () => {
      const cards = [new Card("Heart", "Ace"), new Card("Diamond", "Ace")];
      const pair = new Pair(cards);

      expect(pair.score()).toBe(44); // (11 + 11) * 2
    });

    it("should sum both cards and multiply by 2", () => {
      const cards = [
        new Card("Heart", "2"),
        new Card("Diamond", "3"),
      ];
      const pair = new Pair(cards);

      expect(pair.score()).toBe(10); // (2 + 3) * 2
    });


    it("should calculate score correctly for all numeric cards", () => {
      const numbers = ["2", "3", "4", "5", "6", "7", "8", "9", "10"];
      numbers.forEach((number, index) => {
        const cards = [
          new Card("Heart", number as any),
          new Card("Diamond", number as any),
        ];
        const pair = new Pair(cards);
        const expected = (index + 2) * 2 * 2; // (card1 + card2) * multiplier
        expect(pair.score()).toBe(expected);
      });
    });

    it("should calculate score correctly for all face cards", () => {
      const testCases = [
        { number: "Jack", expected: 40 }, // (10 + 10) * 2
        { number: "Queen", expected: 40 }, // (10 + 10) * 2
        { number: "King", expected: 40 }, // (10 + 10) * 2
        { number: "Ace", expected: 44 }, // (11 + 11) * 2
      ];

      testCases.forEach(({ number, expected }) => {
        const cards = [
          new Card("Heart", number as any),
          new Card("Diamond", number as any),
        ];
        const pair = new Pair(cards);
        expect(pair.score()).toBe(expected);
      });
    });

    it("should handle mixed card values", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "King"),
      ];
      const pair = new Pair(cards);

      expect(pair.score()).toBe(42); // (11 + 10) * 2
    });
  });

  describe("inheritance", () => {
    it("should be an instance of Figure", () => {
      const cards = [new Card("Heart", "Ace"), new Card("Diamond", "Ace")];
      const pair = new Pair(cards);

      expect(pair).toBeInstanceOf(Figure);
    });

    it("should implement all abstract methods from Figure", () => {
      const cards = [new Card("Heart", "Ace"), new Card("Diamond", "Ace")];
      const pair = new Pair(cards);

      expect(typeof pair.name()).toBe("string");
      expect(typeof pair.multiplier()).toBe("number");
      expect(typeof pair.requiredCardCount()).toBe("number");
    });
  });

  describe("edge cases", () => {
    it("should handle cards with different colours but same number", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "Ace"),
      ];
      const pair = new Pair(cards);

      expect(pair.score()).toBe(44); // (11 + 11) * 2
    });
  });

  describe("requiredCardCount", () => {
    it("should return 2", () => {
      const cards = [new Card("Heart", "Ace"), new Card("Diamond", "Ace")];
      const pair = new Pair(cards);

      expect(pair.requiredCardCount()).toBe(2);
    });
  });

  describe("inherited score method", () => {
    it("should use inherited score() from Figure that sums card points and multiplies by multiplier", () => {
      const cards = [
        new Card("Heart", "5"),
        new Card("Diamond", "3"),
      ];
      const pair = new Pair(cards);

      // Inherited score() = sum of card points * multiplier
      // = (5 + 3) * 2 = 16
      expect(pair.score()).toBe(16);
    });
  });
});

