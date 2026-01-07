import { describe, it, expect } from "vitest";
import { Straight } from "../app/models/figures/Straight";
import { Card } from "../app/models/Card";
import { Figure } from "../app/models/Figure";

describe("Straight", () => {
  describe("constructor", () => {
    it("should create a Straight with cards", () => {
      const cards = [
        new Card("Heart", "2"),
        new Card("Diamond", "3"),
        new Card("Club", "4"),
        new Card("Spade", "5"),
        new Card("Heart", "6"),
      ];
      const straight = new Straight(cards);

      expect(straight).toBeInstanceOf(Straight);
      expect(straight).toBeInstanceOf(Figure);
      expect(straight.cards).toEqual(cards);
    });

    it("should throw error when created with wrong number of cards", () => {
      const cards = [
        new Card("Heart", "2"),
        new Card("Diamond", "3"),
        new Card("Club", "4"),
      ];

      expect(() => {
        new Straight(cards);
      }).toThrow("Straight requires exactly 5 card(s), but got 3");
    });
  });

  describe("name", () => {
    it("should return 'Straight'", () => {
      const cards = [
        new Card("Heart", "2"),
        new Card("Diamond", "3"),
        new Card("Club", "4"),
        new Card("Spade", "5"),
        new Card("Heart", "6"),
      ];
      const straight = new Straight(cards);

      expect(straight.name()).toBe("Straight");
    });
  });

  describe("multiplier", () => {
    it("should return 4", () => {
      const cards = [
        new Card("Heart", "2"),
        new Card("Diamond", "3"),
        new Card("Club", "4"),
        new Card("Spade", "5"),
        new Card("Heart", "6"),
      ];
      const straight = new Straight(cards);

      expect(straight.multiplier()).toBe(4);
    });
  });

  describe("score", () => {
    it("should calculate score correctly for a straight", () => {
      const cards = [
        new Card("Heart", "2"),
        new Card("Diamond", "3"),
        new Card("Club", "4"),
        new Card("Spade", "5"),
        new Card("Heart", "6"),
      ];
      const straight = new Straight(cards);

      // (2 + 3 + 4 + 5 + 6 + 30) * 4 = 50 * 4 = 200
      expect(straight.score()).toBe(200);
    });

    it("should calculate score correctly for a high straight", () => {
      const cards = [
        new Card("Heart", "10"),
        new Card("Diamond", "Jack"),
        new Card("Club", "Queen"),
        new Card("Spade", "King"),
        new Card("Heart", "Ace"),
      ];
      const straight = new Straight(cards);

      // (10 + 10 + 10 + 10 + 11 + 30) * 4 = 81 * 4 = 324
      expect(straight.score()).toBe(324);
    });
  });

  describe("requiredCardCount", () => {
    it("should return 5", () => {
      const cards = [
        new Card("Heart", "2"),
        new Card("Diamond", "3"),
        new Card("Club", "4"),
        new Card("Spade", "5"),
        new Card("Heart", "6"),
      ];
      const straight = new Straight(cards);

      expect(straight.requiredCardCount()).toBe(5);
    });
  });
});

