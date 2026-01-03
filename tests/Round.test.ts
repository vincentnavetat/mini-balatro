import { describe, it, expect } from "vitest";
import { Round } from "../app/models/Round";
import { Deck } from "../app/models/Deck";
import { Hand } from "../app/models/Hand";
import { Card } from "../app/models/Card";

describe("Round", () => {
  describe("constructor", () => {
    it("should create a round with an existing deck", () => {
      const deck = new Deck();
      const round = new Round(deck);

      expect(round.deck).toBe(deck);
    });

    it("should create a hand when round starts", () => {
      const deck = new Deck();
      const round = new Round(deck);

      expect(round.hand).toBeInstanceOf(Hand);
      expect(round.hand.cards.length).toBe(7);
    });

    it("should draw cards from the deck when creating the hand", () => {
      const deck = new Deck();
      const initialDeckSize = deck.cards.length;
      const round = new Round(deck);

      expect(deck.cards.length).toBe(initialDeckSize - 7);
      expect(round.hand.cards.length).toBe(7);
    });

    it("should move cards from deck to hand (not duplicate)", () => {
      const deck = new Deck();
      const round = new Round(deck);

      // Verify the cards in hand are not in deck anymore
      const handCardKeys = new Set(
        round.hand.cards.map((c) => `${c.colour}-${c.number}`)
      );
      const deckCardKeys = new Set(
        deck.cards.map((c) => `${c.colour}-${c.number}`)
      );

      // No overlap between hand and deck
      for (const key of handCardKeys) {
        expect(deckCardKeys.has(key)).toBe(false);
      }

      // Total cards should still be 52
      expect(handCardKeys.size + deckCardKeys.size).toBe(52);
    });

    it("should contain valid Card instances in hand", () => {
      const deck = new Deck();
      const round = new Round(deck);

      for (const card of round.hand.cards) {
        expect(card).toBeInstanceOf(Card);
        expect(card.colour).toBeDefined();
        expect(card.number).toBeDefined();
      }
    });

    it("should ensure no duplicate cards in hand", () => {
      const deck = new Deck();
      const round = new Round(deck);

      const cardKeys = round.hand.cards.map((c) => `${c.colour}-${c.number}`);
      const uniqueKeys = new Set(cardKeys);

      expect(uniqueKeys.size).toBe(7);
    });
  });

  describe("deck property", () => {
    it("should return the deck passed to the constructor", () => {
      const deck = new Deck();
      const round = new Round(deck);

      expect(round.deck).toBe(deck);
    });

    it("should return the same deck instance", () => {
      const deck = new Deck();
      const round = new Round(deck);

      // Verify it's the same reference
      expect(round.deck).toBe(deck);
    });
  });

  describe("hand property", () => {
    it("should return a Hand instance", () => {
      const deck = new Deck();
      const round = new Round(deck);

      expect(round.hand).toBeInstanceOf(Hand);
    });

    it("should return a hand with 7 cards", () => {
      const deck = new Deck();
      const round = new Round(deck);

      expect(round.hand.cards.length).toBe(7);
    });

    it("should return the same hand instance", () => {
      const deck = new Deck();
      const round = new Round(deck);
      const hand1 = round.hand;
      const hand2 = round.hand;

      expect(hand1).toBe(hand2);
    });
  });

  describe("edge cases", () => {
    it("should handle drawing from a deck with exactly 7 cards", () => {
      const deck = new Deck();
      // Draw cards until only 7 remain
      deck.drawCards(45);
      expect(deck.cards.length).toBe(7);

      const round = new Round(deck);
      expect(round.hand.cards.length).toBe(7);
      expect(deck.cards.length).toBe(0);
    });

    it("should throw error when deck has fewer than 7 cards", () => {
      const deck = new Deck();
      deck.drawCards(46); // Only 6 cards remaining

      expect(() => {
        new Round(deck);
      }).toThrow("Cannot draw 7 cards: only 6 cards remaining in deck");
    });

    it("should work with multiple rounds from the same deck", () => {
      const deck = new Deck();
      const round1 = new Round(deck);
      const round2 = new Round(deck);

      expect(round1.hand.cards.length).toBe(7);
      expect(round2.hand.cards.length).toBe(7);
      expect(deck.cards.length).toBe(52 - 14);
    });

    it("should ensure no duplicate cards across multiple rounds from same deck", () => {
      const deck = new Deck();
      const round1 = new Round(deck);
      const round2 = new Round(deck);

      const allHandCards = [
        ...round1.hand.cards,
        ...round2.hand.cards,
      ];
      const cardKeys = allHandCards.map((c) => `${c.colour}-${c.number}`);
      const uniqueKeys = new Set(cardKeys);
      expect(uniqueKeys.size).toBe(14);
    });
  });
});

