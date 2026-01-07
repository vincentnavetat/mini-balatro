import { describe, it, expect } from "vitest";
import { StraightFlush } from "../app/models/figures/StraightFlush";
import { Card } from "../app/models/Card";
import { Figure } from "../app/models/Figure";

describe("StraightFlush", () => {
  describe("constructor", () => {
    it("should create a StraightFlush with cards", () => {
      const cards = [
        new Card("Heart", "2"),
        new Card("Heart", "3"),
        new Card("Heart", "4"),
        new Card("Heart", "5"),
        new Card("Heart", "6"),
      ];
      const straightFlush = new StraightFlush(cards);

      expect(straightFlush).toBeInstanceOf(StraightFlush);
      expect(straightFlush).toBeInstanceOf(Figure);
      expect(straightFlush.cards).toEqual(cards);
    });

    it("should throw error when created with wrong number of cards", () => {
      const cards = [
        new Card("Heart", "2"),
        new Card("Heart", "3"),
        new Card("Heart", "4"),
      ];

      expect(() => {
        new StraightFlush(cards);
      }).toThrow("Straight flush requires exactly 5 card(s), but got 3");
    });
  });

  describe("name", () => {
    it("should return 'Straight flush'", () => {
      const cards = [
        new Card("Heart", "2"),
        new Card("Heart", "3"),
        new Card("Heart", "4"),
        new Card("Heart", "5"),
        new Card("Heart", "6"),
      ];
      const straightFlush = new StraightFlush(cards);

      expect(straightFlush.name()).toBe("Straight flush");
    });
  });

  describe("multiplier", () => {
    it("should return 8", () => {
      const cards = [
        new Card("Heart", "2"),
        new Card("Heart", "3"),
        new Card("Heart", "4"),
        new Card("Heart", "5"),
        new Card("Heart", "6"),
      ];
      const straightFlush = new StraightFlush(cards);

      expect(straightFlush.multiplier()).toBe(8);
    });
  });

  describe("score", () => {
    it("should calculate score correctly for a straight flush", () => {
      const cards = [
        new Card("Heart", "2"),
        new Card("Heart", "3"),
        new Card("Heart", "4"),
        new Card("Heart", "5"),
        new Card("Heart", "6"),
      ];
      const straightFlush = new StraightFlush(cards);

      // (2 + 3 + 4 + 5 + 6 + 100) * 8 = 120 * 8 = 960
      expect(straightFlush.score()).toBe(960);
    });

    it("should calculate score correctly for a high straight flush", () => {
      const cards = [
        new Card("Heart", "10"),
        new Card("Heart", "Jack"),
        new Card("Heart", "Queen"),
        new Card("Heart", "King"),
        new Card("Heart", "Ace"),
      ];
      const straightFlush = new StraightFlush(cards);

      // (10 + 10 + 10 + 10 + 11 + 100) * 8 = 151 * 8 = 1208
      expect(straightFlush.score()).toBe(1208);
    });
  });

  describe("requiredCardCount", () => {
    it("should return 5", () => {
      const cards = [
        new Card("Heart", "2"),
        new Card("Heart", "3"),
        new Card("Heart", "4"),
        new Card("Heart", "5"),
        new Card("Heart", "6"),
      ];
      const straightFlush = new StraightFlush(cards);

      expect(straightFlush.requiredCardCount()).toBe(5);
    });
  });
});

