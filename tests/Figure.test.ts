import { describe, it, expect } from "vitest";
import { Figure } from "../app/models/Figure";
import { Card } from "../app/models/Card";

// Concrete implementation for testing abstract class
class TestFigure extends Figure {
  constructor(cards: Card[]) {
    super(cards);
  }

  name(): string {
    return "Test Figure";
  }

  multiplier(): number {
    return 1;
  }

  score(): number {
    return 10;
  }
}

describe("Figure", () => {
  describe("constructor", () => {
    it("should create a figure with an array of cards", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "King"),
      ];
      const figure = new TestFigure(cards);

      expect(figure.cards).toEqual(cards);
      expect(figure.cards.length).toBe(2);
    });

    it("should create a figure with an empty array of cards", () => {
      const cards: Card[] = [];
      const figure = new TestFigure(cards);

      expect(figure.cards).toEqual([]);
      expect(figure.cards.length).toBe(0);
    });

    it("should create a figure with multiple cards", () => {
      const cards = [
        new Card("Heart", "2"),
        new Card("Diamond", "3"),
        new Card("Club", "4"),
        new Card("Spade", "5"),
      ];
      const figure = new TestFigure(cards);

      expect(figure.cards.length).toBe(4);
      expect(figure.cards[0].colour).toBe("Heart");
      expect(figure.cards[1].colour).toBe("Diamond");
      expect(figure.cards[2].colour).toBe("Club");
      expect(figure.cards[3].colour).toBe("Spade");
    });
  });

  describe("cards property", () => {
    it("should return a readonly array of cards", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "King"),
      ];
      const figure = new TestFigure(cards);

      expect(Array.isArray(figure.cards)).toBe(true);
      expect(figure.cards.length).toBe(2);
    });

    it("should return the same cards passed to constructor", () => {
      const cards = [
        new Card("Heart", "Ace"),
        new Card("Diamond", "King"),
        new Card("Club", "Queen"),
      ];
      const figure = new TestFigure(cards);

      expect(figure.cards[0]).toBe(cards[0]);
      expect(figure.cards[1]).toBe(cards[1]);
      expect(figure.cards[2]).toBe(cards[2]);
    });

    it("should return all valid Card instances", () => {
      const cards = [
        new Card("Heart", "2"),
        new Card("Diamond", "Jack"),
        new Card("Club", "Ace"),
      ];
      const figure = new TestFigure(cards);

      for (const card of figure.cards) {
        expect(card).toBeInstanceOf(Card);
        expect(card.colour).toBeDefined();
        expect(card.number).toBeDefined();
      }
    });
  });

  describe("abstract methods", () => {
    it("should require subclasses to implement name()", () => {
      const cards = [new Card("Heart", "Ace")];
      const figure = new TestFigure(cards);

      expect(figure.name()).toBe("Test Figure");
      expect(typeof figure.name()).toBe("string");
    });

    it("should require subclasses to implement multiplier()", () => {
      const cards = [new Card("Heart", "Ace")];
      const figure = new TestFigure(cards);

      expect(figure.multiplier()).toBe(1);
      expect(typeof figure.multiplier()).toBe("number");
    });

    it("should require subclasses to implement score()", () => {
      const cards = [new Card("Heart", "Ace")];
      const figure = new TestFigure(cards);

      expect(figure.score()).toBe(10);
      expect(typeof figure.score()).toBe("number");
    });

    it("should allow different implementations in subclasses", () => {
      class CustomFigure extends Figure {
        constructor(cards: Card[]) {
          super(cards);
        }

        name(): string {
          return "Custom Figure";
        }

        multiplier(): number {
          return 2.5;
        }

        score(): number {
          return 20;
        }
      }

      const cards = [new Card("Heart", "Ace")];
      const figure = new CustomFigure(cards);

      expect(figure.name()).toBe("Custom Figure");
      expect(figure.multiplier()).toBe(2.5);
      expect(figure.score()).toBe(20);
    });
  });

  describe("edge cases", () => {
    it("should handle a single card", () => {
      const cards = [new Card("Heart", "Ace")];
      const figure = new TestFigure(cards);

      expect(figure.cards.length).toBe(1);
      expect(figure.cards[0].colour).toBe("Heart");
      expect(figure.cards[0].number).toBe("Ace");
    });

    it("should handle many cards", () => {
      const cards: Card[] = [];
      for (let i = 0; i < 10; i++) {
        cards.push(new Card("Heart", "2"));
      }
      const figure = new TestFigure(cards);

      expect(figure.cards.length).toBe(10);
    });

    it("should preserve card order", () => {
      const cards = [
        new Card("Heart", "2"),
        new Card("Diamond", "3"),
        new Card("Club", "4"),
      ];
      const figure = new TestFigure(cards);

      expect(figure.cards[0].number).toBe("2");
      expect(figure.cards[1].number).toBe("3");
      expect(figure.cards[2].number).toBe("4");
    });
  });
});

