import { describe, it, expect } from "vitest";
import { DoublePair } from "../app/models/DoublePair";
import { Card } from "../app/models/Card";
import { Figure } from "../app/models/Figure";

describe("DoublePair", () => {
  describe("constructor", () => {
    it("should create a DoublePair with cards", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "Ace"),
        new Card("Club", "King"),
        new Card("Spade", "King"),
      ];
      const doublePair = new DoublePair(cards);

      expect(doublePair).toBeInstanceOf(DoublePair);
      expect(doublePair).toBeInstanceOf(Figure);
      expect(doublePair.cards).toEqual(cards);
    });

    it("should throw error when created with less than 4 cards", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "Ace"),
        new Card("Club", "King"),
      ];

      expect(() => {
        new DoublePair(cards);
      }).toThrow("Double Pair requires exactly 4 card(s), but got 3");
    });

    it("should throw error when created with single card", () => {
      const cards = [new Card("Heart", "Ace")];

      expect(() => {
        new DoublePair(cards);
      }).toThrow("Double Pair requires exactly 4 card(s), but got 1");
    });

    it("should throw error when created with no cards", () => {
      const cards: Card[] = [];

      expect(() => {
        new DoublePair(cards);
      }).toThrow("Double Pair requires exactly 4 card(s), but got 0");
    });

    it("should throw error when created with more than 4 cards", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "Ace"),
        new Card("Club", "King"),
        new Card("Spade", "King"),
        new Card("Heart", "Queen"),
      ];

      expect(() => {
        new DoublePair(cards);
      }).toThrow("Double Pair requires exactly 4 card(s), but got 5");
    });
  });

  describe("name", () => {
    it("should return 'Double Pair'", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "Ace"),
        new Card("Club", "King"),
        new Card("Spade", "King"),
      ];
      const doublePair = new DoublePair(cards);

      expect(doublePair.name()).toBe("Double Pair");
    });
  });

  describe("multiplier", () => {
    it("should return 2", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "Ace"),
        new Card("Club", "King"),
        new Card("Spade", "King"),
      ];
      const doublePair = new DoublePair(cards);

      expect(doublePair.multiplier()).toBe(2);
    });

    it("should always return 2 regardless of cards", () => {
      const cards1 = [
        new Card("Heart", "2"),
        new Card("Diamond", "2"),
        new Card("Club", "3"),
        new Card("Spade", "3"),
      ];
      const cards2 = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "Ace"),
        new Card("Club", "King"),
        new Card("Spade", "King"),
      ];
      const doublePair1 = new DoublePair(cards1);
      const doublePair2 = new DoublePair(cards2);

      expect(doublePair1.multiplier()).toBe(2);
      expect(doublePair2.multiplier()).toBe(2);
    });
  });

  describe("score", () => {
    it("should return (2 + 2 + 3 + 3) * 2 for two 2s and two 3s", () => {
      const cards = [
        new Card("Heart", "2"),
        new Card("Diamond", "2"),
        new Card("Club", "3"),
        new Card("Spade", "3"),
      ];
      const doublePair = new DoublePair(cards);

      expect(doublePair.score()).toBe(20); // (2 + 2 + 3 + 3) * 2
    });

    it("should return (5 + 5 + 10 + 10) * 2 for two 5s and two 10s", () => {
      const cards = [
        new Card("Heart", "5"),
        new Card("Diamond", "5"),
        new Card("Club", "10"),
        new Card("Spade", "10"),
      ];
      const doublePair = new DoublePair(cards);

      expect(doublePair.score()).toBe(60); // (5 + 5 + 10 + 10) * 2
    });

    it("should return (10 + 10 + 10 + 10) * 2 for four Jacks", () => {
      const cards = [
        new Card("Heart", "Jack"),
        new Card("Diamond", "Jack"),
        new Card("Club", "Jack"),
        new Card("Spade", "Jack"),
      ];
      const doublePair = new DoublePair(cards);

      expect(doublePair.score()).toBe(80); // (10 + 10 + 10 + 10) * 2
    });

    it("should return (11 + 11 + 11 + 11) * 2 for four Aces", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "Ace"),
        new Card("Club", "Ace"),
        new Card("Spade", "Ace"),
      ];
      const doublePair = new DoublePair(cards);

      expect(doublePair.score()).toBe(88); // (11 + 11 + 11 + 11) * 2
    });

    it("should sum all four cards and multiply by 2", () => {
      const cards = [
        new Card("Heart", "2"),
        new Card("Diamond", "3"),
        new Card("Club", "4"),
        new Card("Spade", "5"),
      ];
      const doublePair = new DoublePair(cards);

      expect(doublePair.score()).toBe(28); // (2 + 3 + 4 + 5) * 2
    });

    it("should calculate score correctly for mixed card values", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "King"),
        new Card("Club", "Queen"),
        new Card("Spade", "Jack"),
      ];
      const doublePair = new DoublePair(cards);

      expect(doublePair.score()).toBe(82); // (11 + 10 + 10 + 10) * 2
    });

    it("should calculate score correctly for all numeric cards", () => {
      const numbers = ["2", "3", "4", "5"];
      const cards = numbers.map((number, index) => {
        const suits: Array<"Heart" | "Diamond" | "Club" | "Spade"> = [
          "Heart",
          "Diamond",
          "Club",
          "Spade",
        ];
        return new Card(suits[index], number as any);
      });
      const doublePair = new DoublePair(cards);

      // (2 + 3 + 4 + 5) * 2 = 28
      expect(doublePair.score()).toBe(28);
    });

    it("should calculate score correctly for all face cards", () => {
      const cards = [
        new Card("Heart", "Jack"),
        new Card("Diamond", "Queen"),
        new Card("Club", "King"),
        new Card("Spade", "Ace"),
      ];
      const doublePair = new DoublePair(cards);

      // (10 + 10 + 10 + 11) * 2 = 82
      expect(doublePair.score()).toBe(82);
    });
  });

  describe("inheritance", () => {
    it("should be an instance of Figure", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "Ace"),
        new Card("Club", "King"),
        new Card("Spade", "King"),
      ];
      const doublePair = new DoublePair(cards);

      expect(doublePair).toBeInstanceOf(Figure);
    });

    it("should implement all abstract methods from Figure", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "Ace"),
        new Card("Club", "King"),
        new Card("Spade", "King"),
      ];
      const doublePair = new DoublePair(cards);

      expect(typeof doublePair.name()).toBe("string");
      expect(typeof doublePair.multiplier()).toBe("number");
      expect(typeof doublePair.requiredCardCount()).toBe("number");
    });
  });

  describe("edge cases", () => {
    it("should handle cards with different colours but same numbers", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "Ace"),
        new Card("Club", "Ace"),
        new Card("Spade", "Ace"),
      ];
      const doublePair = new DoublePair(cards);

      expect(doublePair.score()).toBe(88); // (11 + 11 + 11 + 11) * 2
    });

    it("should work with exactly 4 cards", () => {
      const cards = [
        new Card("Spade", "7"),
        new Card("Heart", "8"),
        new Card("Diamond", "9"),
        new Card("Club", "10"),
      ];
      const doublePair = new DoublePair(cards);

      expect(doublePair.score()).toBe(68); // (7 + 8 + 9 + 10) * 2
      expect(doublePair.name()).toBe("Double Pair");
      expect(doublePair.multiplier()).toBe(2);
    });
  });

  describe("requiredCardCount", () => {
    it("should return 4", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "Ace"),
        new Card("Club", "King"),
        new Card("Spade", "King"),
      ];
      const doublePair = new DoublePair(cards);

      expect(doublePair.requiredCardCount()).toBe(4);
    });
  });

  describe("inherited score method", () => {
    it("should use inherited score() from Figure that sums card points and multiplies by multiplier", () => {
      const cards = [
        new Card("Heart", "5"),
        new Card("Diamond", "5"),
        new Card("Club", "3"),
        new Card("Spade", "3"),
      ];
      const doublePair = new DoublePair(cards);

      // Inherited score() = sum of card points * multiplier
      // = (5 + 5 + 3 + 3) * 2 = 32
      expect(doublePair.score()).toBe(32);
    });
  });
});

