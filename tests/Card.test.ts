import { describe, it, expect } from "vitest";
import { Card, type CardColour, type CardNumber } from "../app/models/Card";

describe("Card", () => {
  describe("constructor", () => {
    it("should create a card with valid colour and number", () => {
      const card = new Card("Heart", "Ace");
      expect(card.colour).toBe("Heart");
      expect(card.number).toBe("Ace");
    });

    it("should create cards with all valid colours", () => {
      const colours: CardColour[] = ["Heart", "Diamond", "Club", "Spade"];
      colours.forEach((colour) => {
        const card = new Card(colour, "5");
        expect(card.colour).toBe(colour);
      });
    });

    it("should create cards with all valid numbers", () => {
      const numbers: CardNumber[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"];
      numbers.forEach((number) => {
        const card = new Card("Heart", number);
        expect(card.number).toBe(number);
      });
    });

    it("should throw error for invalid colour", () => {
      expect(() => {
        new Card("Invalid" as CardColour, "5");
      }).toThrow("Invalid colour: Invalid");
    });

    it("should throw error for invalid number", () => {
      expect(() => {
        new Card("Heart", "Invalid" as CardNumber);
      }).toThrow("Invalid number: Invalid");
    });

    it("should throw error for 0", () => {
      expect(() => {
        new Card("Heart", "0" as CardNumber);
      }).toThrow("Invalid number: 0");
    });

    it("should throw error for 1", () => {
      expect(() => {
        new Card("Heart", "1" as CardNumber);
      }).toThrow("Invalid number: 1");
    });

    it("should throw error for empty colour", () => {
      expect(() => {
        new Card("" as CardColour, "5");
      }).toThrow("Invalid colour:");
    });

    it("should throw error for empty number", () => {
      expect(() => {
        new Card("Heart", "" as CardNumber);
      }).toThrow("Invalid number:");
    });
  });

  describe("getters", () => {
    it("should return the correct colour", () => {
      const card = new Card("Diamond", "King");
      expect(card.colour).toBe("Diamond");
    });

    it("should return the correct number", () => {
      const card = new Card("Club", "Queen");
      expect(card.number).toBe("Queen");
    });

    it("should return immutable properties", () => {
      const card = new Card("Spade", "Jack");
      const originalColour = card.colour;
      const originalNumber = card.number;
      
      // Properties are read-only, so we can't modify them directly
      // This test verifies the getters work correctly
      expect(card.colour).toBe(originalColour);
      expect(card.number).toBe(originalNumber);
    });
  });

  describe("edge cases", () => {
    it("should handle numeric strings correctly", () => {
      const card = new Card("Heart", "2");
      expect(card.number).toBe("2");
      
      const card10 = new Card("Heart", "10");
      expect(card10.number).toBe("10");
    });

    it("should handle face cards correctly", () => {
      const jack = new Card("Diamond", "Jack");
      const queen = new Card("Club", "Queen");
      const king = new Card("Spade", "King");
      const ace = new Card("Heart", "Ace");
      
      expect(jack.number).toBe("Jack");
      expect(queen.number).toBe("Queen");
      expect(king.number).toBe("King");
      expect(ace.number).toBe("Ace");
    });

    it("should create cards with all colour and number combinations", () => {
      const colours: CardColour[] = ["Heart", "Diamond", "Club", "Spade"];
      const numbers: CardNumber[] = ["Ace", "King", "Queen", "Jack"];
      
      colours.forEach((colour) => {
        numbers.forEach((number) => {
          const card = new Card(colour, number);
          expect(card.colour).toBe(colour);
          expect(card.number).toBe(number);
        });
      });
    });
  });
});

