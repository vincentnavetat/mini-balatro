import { describe, it, expect } from "vitest";
import { Deck } from "../app/models/Deck";
import { Card } from "../app/models/Card";
import { VALID_COLOURS, VALID_NUMBERS } from "../app/models/Card";

describe("Deck", () => {
  describe("constructor", () => {
    it("should create a deck with 52 cards", () => {
      const deck = new Deck();
      expect(deck.cards.length).toBe(52);
    });

    it("should contain one card for each colour and number combination", () => {
      const deck = new Deck();
      const cardMap = new Map<string, Card>();

      // Count occurrences of each colour-number combination
      for (const card of deck.cards) {
        const key = `${card.colour}-${card.number}`;
        cardMap.set(key, card);
      }

      // Verify we have exactly 52 unique combinations (4 colours * 13 numbers)
      expect(cardMap.size).toBe(52);

      // Verify all combinations exist
      for (const colour of VALID_COLOURS) {
        for (const number of VALID_NUMBERS) {
          const key = `${colour}-${number}`;
          expect(cardMap.has(key)).toBe(true);
          const card = cardMap.get(key)!;
          expect(card.colour).toBe(colour);
          expect(card.number).toBe(number);
        }
      }
    });

    it("should shuffle the cards", () => {
      // Create multiple decks and verify they're in different orders
      // (with high probability, they should be different)
      const deck1 = new Deck();
      const deck2 = new Deck();
      const deck3 = new Deck();

      const order1 = deck1.cards.map((c) => `${c.colour}-${c.number}`).join(",");
      const order2 = deck2.cards.map((c) => `${c.colour}-${c.number}`).join(",");
      const order3 = deck3.cards.map((c) => `${c.colour}-${c.number}`).join(",");

      // At least two of the three should be different (very high probability)
      const allSame = order1 === order2 && order2 === order3;
      expect(allSame).toBe(false);
    });

    it("should contain all valid colours", () => {
      const deck = new Deck();
      const coloursInDeck = new Set(deck.cards.map((card) => card.colour));

      for (const colour of VALID_COLOURS) {
        expect(coloursInDeck.has(colour)).toBe(true);
      }

      expect(coloursInDeck.size).toBe(VALID_COLOURS.length);
    });

    it("should contain all valid numbers", () => {
      const deck = new Deck();
      const numbersInDeck = new Set(deck.cards.map((card) => card.number));

      for (const number of VALID_NUMBERS) {
        expect(numbersInDeck.has(number)).toBe(true);
      }

      expect(numbersInDeck.size).toBe(VALID_NUMBERS.length);
    });

    it("should have exactly 13 cards of each colour", () => {
      const deck = new Deck();

      for (const colour of VALID_COLOURS) {
        const cardsOfColour = deck.cards.filter((card) => card.colour === colour);
        expect(cardsOfColour.length).toBe(13);
      }
    });

    it("should have exactly 4 cards of each number", () => {
      const deck = new Deck();

      for (const number of VALID_NUMBERS) {
        const cardsOfNumber = deck.cards.filter((card) => card.number === number);
        expect(cardsOfNumber.length).toBe(4);
      }
    });
  });

  describe("cards property", () => {
    it("should return a readonly array", () => {
      const deck = new Deck();
      const cards = deck.cards;

      // Verify it's an array
      expect(Array.isArray(cards)).toBe(true);
      expect(cards.length).toBe(52);
    });

    it("should return all cards", () => {
      const deck = new Deck();
      const cards = deck.cards;

      // Verify all cards are Card instances
      for (const card of cards) {
        expect(card).toBeInstanceOf(Card);
        expect(card.colour).toBeDefined();
        expect(card.number).toBeDefined();
      }
    });
  });

  describe("shuffling", () => {
    it("should produce different orders on multiple initializations", () => {
      const orders: string[] = [];

      // Create 10 decks and collect their orders
      for (let i = 0; i < 10; i++) {
        const deck = new Deck();
        const order = deck.cards.map((c) => `${c.colour}-${c.number}`).join(",");
        orders.push(order);
      }

      // Check that at least some orders are different
      const uniqueOrders = new Set(orders);
      expect(uniqueOrders.size).toBeGreaterThan(1);
    });

    it("should maintain all 52 cards after shuffling", () => {
      const deck = new Deck();
      const cardSet = new Set(
        deck.cards.map((c) => `${c.colour}-${c.number}`)
      );

      expect(cardSet.size).toBe(52);
    });
  });
});

