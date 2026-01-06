import { describe, it, expect } from "vitest";
import { Flush } from "../app/models/figures/Flush";
import { Card } from "../app/models/Card";
import { Figure } from "../app/models/Figure";

describe("Flush", () => {
  describe("constructor", () => {
    it("should create a Flush with cards", () => {
      const cards = [
        new Card("Heart", "2"),
        new Card("Heart", "5"),
        new Card("Heart", "7"),
        new Card("Heart", "9"),
        new Card("Heart", "King"),
      ];
      const flush = new Flush(cards);

      expect(flush).toBeInstanceOf(Flush);
      expect(flush).toBeInstanceOf(Figure);
      expect(flush.cards).toEqual(cards);
    });

    it("should throw error when created with wrong number of cards", () => {
      const cards = [
        new Card("Heart", "2"),
        new Card("Heart", "5"),
        new Card("Heart", "7"),
      ];

      expect(() => {
        new Flush(cards);
      }).toThrow("Flush requires exactly 5 card(s), but got 3");
    });
  });

  describe("name", () => {
    it("should return 'Flush'", () => {
      const cards = [
        new Card("Heart", "2"),
        new Card("Heart", "5"),
        new Card("Heart", "7"),
        new Card("Heart", "9"),
        new Card("Heart", "King"),
      ];
      const flush = new Flush(cards);

      expect(flush.name()).toBe("Flush");
    });
  });

  describe("multiplier", () => {
    it("should return 4", () => {
      const cards = [
        new Card("Heart", "2"),
        new Card("Heart", "5"),
        new Card("Heart", "7"),
        new Card("Heart", "9"),
        new Card("Heart", "King"),
      ];
      const flush = new Flush(cards);

      expect(flush.multiplier()).toBe(4);
    });
  });

  describe("score", () => {
    it("should calculate score correctly for a flush", () => {
      const cards = [
        new Card("Heart", "2"),
        new Card("Heart", "5"),
        new Card("Heart", "7"),
        new Card("Heart", "9"),
        new Card("Heart", "King"),
      ];
      const flush = new Flush(cards);

      expect(flush.score()).toBe(208); // (2 + 35) + (5 + 35) + (7 + 35) + (9 + 35) + (10 + 35)
    });
  });

  describe("requiredCardCount", () => {
    it("should return 5", () => {
      const cards = [
        new Card("Heart", "2"),
        new Card("Heart", "5"),
        new Card("Heart", "7"),
        new Card("Heart", "9"),
        new Card("Heart", "King"),
      ];
      const flush = new Flush(cards);

      expect(flush.requiredCardCount()).toBe(5);
    });
  });
});

