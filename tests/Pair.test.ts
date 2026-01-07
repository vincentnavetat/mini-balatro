import { describe, it, expect } from "vitest";
import { Pair } from "../app/models/figures/Pair";
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
    it("should return ((2 + 10) + (2 + 10)) * 2 for two 2s", () => {
      const cards = [new Card("Heart", "2"), new Card("Diamond", "2")];
      const pair = new Pair(cards);

      expect(pair.score()).toBe(48); // ((2 + 10) + (2 + 10)) * 2
    });

    it("should return ((3 + 10) + (3 + 10)) * 2 for two 3s", () => {
      const cards = [new Card("Heart", "3"), new Card("Diamond", "3")];
      const pair = new Pair(cards);

      expect(pair.score()).toBe(52); // ((3 + 10) + (3 + 10)) * 2
    });

    it("should return ((10 + 10) + (10 + 10)) * 2 for two 10s", () => {
      const cards = [new Card("Heart", "10"), new Card("Diamond", "10")];
      const pair = new Pair(cards);

      expect(pair.score()).toBe(80); // ((10 + 10) + (10 + 10)) * 2
    });

    it("should return ((10 + 10) + (10 + 10)) * 2 for two Jacks", () => {
      const cards = [new Card("Heart", "Jack"), new Card("Diamond", "Jack")];
      const pair = new Pair(cards);

      expect(pair.score()).toBe(80); // ((10 + 10) + (10 + 10)) * 2
    });

    it("should return ((10 + 10) + (10 + 10)) * 2 for two Queens", () => {
      const cards = [new Card("Heart", "Queen"), new Card("Diamond", "Queen")];
      const pair = new Pair(cards);

      expect(pair.score()).toBe(80); // ((10 + 10) + (10 + 10)) * 2
    });

    it("should return ((10 + 10) + (10 + 10)) * 2 for two Kings", () => {
      const cards = [new Card("Heart", "King"), new Card("Diamond", "King")];
      const pair = new Pair(cards);

      expect(pair.score()).toBe(80); // ((10 + 10) + (10 + 10)) * 2
    });

    it("should return ((11 + 10) + (11 + 10)) * 2 for two Aces", () => {
      const cards = [new Card("Heart", "Ace"), new Card("Diamond", "Ace")];
      const pair = new Pair(cards);

      expect(pair.score()).toBe(84); // ((11 + 10) + (11 + 10)) * 2
    });

    it("should sum both cards with chips added to each and multiply by 2", () => {
      const cards = [
        new Card("Heart", "2"),
        new Card("Diamond", "3"),
      ];
      const pair = new Pair(cards);

      expect(pair.score()).toBe(50); // ((2 + 10) + (3 + 10)) * 2
    });


    it("should calculate score correctly for all numeric cards", () => {
      const numbers = ["2", "3", "4", "5", "6", "7", "8", "9", "10"];
      numbers.forEach((number, index) => {
        const cards = [
          new Card("Heart", number as any),
          new Card("Diamond", number as any),
        ];
        const pair = new Pair(cards);
        const expected = (index + 2 + 10) * 2 * 2; // (card + chips) * 2 cards * multiplier(2)
        expect(pair.score()).toBe(expected);
      });
    });

    it("should calculate score correctly for all face cards", () => {
      const testCases = [
        { number: "Jack", expected: 80 }, // ((10 + 10) + (10 + 10)) * 2
        { number: "Queen", expected: 80 }, // ((10 + 10) + (10 + 10)) * 2
        { number: "King", expected: 80 }, // ((10 + 10) + (10 + 10)) * 2
        { number: "Ace", expected: 84 }, // ((11 + 10) + (11 + 10)) * 2
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

      expect(pair.score()).toBe(82); // ((11 + 10) + (10 + 10)) * 2
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
      expect(typeof pair.chips()).toBe("number");
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

      expect(pair.score()).toBe(84); // ((11 + 10) + (11 + 10)) * 2
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
    it("should use inherited score() from Figure that adds chips to each card's points", () => {
      const cards = [
        new Card("Heart", "5"),
        new Card("Diamond", "3"),
      ];
      const pair = new Pair(cards);

      // Inherited score() = (sum of (card points + chips) for each card) * multiplier
      // = ((5 + 10) + (3 + 10)) * 2 = 56
      expect(pair.score()).toBe(56);
    });
  });
});

