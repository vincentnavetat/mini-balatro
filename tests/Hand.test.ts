import { describe, it, expect } from "vitest";
import { Hand } from "../app/models/Hand";
import { Deck } from "../app/models/Deck";
import { Card } from "../app/models/Card";

describe("Hand", () => {
  describe("constructor", () => {
    it("should create a hand with 7 cards", () => {
      const deck = new Deck();
      const hand = new Hand(deck);
      expect(hand.cards.length).toBe(7);
    });

    it("should remove 7 cards from the deck", () => {
      const deck = new Deck();
      const initialDeckSize = deck.cards.length;
      const hand = new Hand(deck);
      
      expect(deck.cards.length).toBe(initialDeckSize - 7);
      expect(hand.cards.length).toBe(7);
    });

    it("should move cards from deck to hand (not duplicate)", () => {
      const deck = new Deck();
      const hand = new Hand(deck);
      
      // Verify the cards in hand are not in deck anymore
      const handCardKeys = new Set(
        hand.cards.map((c) => `${c.colour}-${c.number}`)
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

    it("should draw cards from the top of the deck", () => {
      const deck = new Deck();
      const topCard = deck.cards[0];
      const secondCard = deck.cards[1];
      
      const hand = new Hand(deck);
      
      // The first card in hand should be the top card from deck
      expect(hand.cards[0]).toBe(topCard);
      expect(hand.cards[1]).toBe(secondCard);
    });

    it("should contain valid Card instances", () => {
      const deck = new Deck();
      const hand = new Hand(deck);
      
      for (const card of hand.cards) {
        expect(card).toBeInstanceOf(Card);
        expect(card.colour).toBeDefined();
        expect(card.number).toBeDefined();
      }
    });

    it("should work with multiple hands from the same deck", () => {
      const deck = new Deck();
      const hand1 = new Hand(deck);
      const hand2 = new Hand(deck);
      
      expect(hand1.cards.length).toBe(7);
      expect(hand2.cards.length).toBe(7);
      expect(deck.cards.length).toBe(52 - 14);
    });

    it("should ensure no duplicate cards in hand", () => {
      const deck = new Deck();
      const hand = new Hand(deck);
      
      const cardKeys = hand.cards.map((c) => `${c.colour}-${c.number}`);
      const uniqueKeys = new Set(cardKeys);
      
      expect(uniqueKeys.size).toBe(7);
    });
  });

  describe("cards property", () => {
    it("should return a readonly array", () => {
      const deck = new Deck();
      const hand = new Hand(deck);
      const cards = hand.cards;
      
      expect(Array.isArray(cards)).toBe(true);
      expect(cards.length).toBe(7);
    });

    it("should return all 7 cards", () => {
      const deck = new Deck();
      const hand = new Hand(deck);
      
      expect(hand.cards.length).toBe(7);
      for (let i = 0; i < 7; i++) {
        expect(hand.cards[i]).toBeInstanceOf(Card);
      }
    });
  });

  describe("edge cases", () => {
    it("should handle drawing from a deck with exactly 7 cards", () => {
      const deck = new Deck();
      // Draw cards until only 7 remain
      deck.drawCards(45);
      expect(deck.cards.length).toBe(7);
      
      const hand = new Hand(deck);
      expect(hand.cards.length).toBe(7);
      expect(deck.cards.length).toBe(0);
    });

    it("should throw error when deck has fewer than 7 cards", () => {
      const deck = new Deck();
      deck.drawCards(46); // Only 6 cards remaining
      
      expect(() => {
        new Hand(deck);
      }).toThrow("Cannot draw 7 cards: only 6 cards remaining in deck");
    });

    it("should handle multiple hands correctly", () => {
      const deck = new Deck();
      const hand1 = new Hand(deck);
      const hand2 = new Hand(deck);
      const hand3 = new Hand(deck);
      
      expect(hand1.cards.length).toBe(7);
      expect(hand2.cards.length).toBe(7);
      expect(hand3.cards.length).toBe(7);
      expect(deck.cards.length).toBe(52 - 21);
      
      // Verify no duplicates across hands
      const allHandCards = [
        ...hand1.cards,
        ...hand2.cards,
        ...hand3.cards,
      ];
      const cardKeys = allHandCards.map((c) => `${c.colour}-${c.number}`);
      const uniqueKeys = new Set(cardKeys);
      expect(uniqueKeys.size).toBe(21);
    });
  });
});

