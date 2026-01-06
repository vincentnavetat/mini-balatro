import { describe, it, expect } from "vitest";
import { Hand } from "../app/models/Hand";
import { Deck } from "../app/models/Deck";
import { Card, VALID_NUMBERS } from "../app/models/Card";

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

    it("should have cards sorted by number (lowest to highest)", () => {
      const deck = new Deck();
      const hand = new Hand(deck);
      
      const cards = hand.cards;
      for (let i = 0; i < cards.length - 1; i++) {
        const currentRank = VALID_NUMBERS.indexOf(cards[i].number as any);
        const nextRank = VALID_NUMBERS.indexOf(cards[i+1].number as any);
        expect(currentRank).toBeLessThanOrEqual(nextRank);
      }
    });

    it("should draw cards from the top of the deck and contain them", () => {
      const deck = new Deck();
      const topCards = deck.cards.slice(0, 7);
      
      const hand = new Hand(deck);
      
      // The hand should contain all top cards drawn from the deck, but they might be reordered
      for (const card of topCards) {
        expect(hand.cards).toContain(card);
      }
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

  describe("discardAndReplace", () => {
    it("should discard and replace a single card", () => {
      const deck = new Deck();
      const hand = new Hand(deck);
      const initialHandSize = hand.cards.length;
      const initialDeckSize = deck.cards.length;
      const discardedCard = hand.cards[0];
      
      hand.discardAndReplace([0], deck);
      
      expect(hand.cards.length).toBe(initialHandSize);
      expect(deck.cards.length).toBe(initialDeckSize - 1);
      expect(hand.cards[0]).not.toBe(discardedCard);
    });

    it("should discard and replace multiple cards", () => {
      const deck = new Deck();
      const hand = new Hand(deck);
      const initialHandSize = hand.cards.length;
      const initialDeckSize = deck.cards.length;
      const discardedCards = [hand.cards[0], hand.cards[2], hand.cards[4]];
      
      hand.discardAndReplace([0, 2, 4], deck);
      
      expect(hand.cards.length).toBe(initialHandSize);
      expect(deck.cards.length).toBe(initialDeckSize - 3);
      expect(hand.cards[0]).not.toBe(discardedCards[0]);
      expect(hand.cards[2]).not.toBe(discardedCards[1]);
      expect(hand.cards[4]).not.toBe(discardedCards[2]);
    });

    it("should discard up to 5 cards", () => {
      const deck = new Deck();
      const hand = new Hand(deck);
      const initialHandSize = hand.cards.length;
      const initialDeckSize = deck.cards.length;
      
      hand.discardAndReplace([0, 1, 2, 3, 4], deck);
      
      expect(hand.cards.length).toBe(initialHandSize);
      expect(deck.cards.length).toBe(initialDeckSize - 5);
    });

    it("should remove discarded cards from hand and add new ones", () => {
      const deck = new Deck();
      const hand = new Hand(deck);
      const initialDeckSize = deck.cards.length;
      const discardedCardKeys = new Set(
        [hand.cards[1], hand.cards[3]].map((c) => `${c.colour}-${c.number}`)
      );
      
      hand.discardAndReplace([1, 3], deck);
      
      // Verify discarded cards are no longer in hand
      const handCardKeys = new Set(
        hand.cards.map((c) => `${c.colour}-${c.number}`)
      );
      for (const key of discardedCardKeys) {
        expect(handCardKeys.has(key)).toBe(false);
      }
      
      // Verify new cards were added from deck
      expect(deck.cards.length).toBe(initialDeckSize - 2);
    });

    it("should handle discarding cards in any order", () => {
      const deck = new Deck();
      const hand = new Hand(deck);
      const initialHandSize = hand.cards.length;
      const initialDeckSize = deck.cards.length;
      
      // Discard in reverse order
      hand.discardAndReplace([4, 2, 0], deck);
      
      expect(hand.cards.length).toBe(initialHandSize);
      expect(deck.cards.length).toBe(initialDeckSize - 3);
    });

    it("should keep non-discarded cards in hand", () => {
      const deck = new Deck();
      const hand = new Hand(deck);
      const cardAtPosition1 = hand.cards[1];
      const cardAtPosition3 = hand.cards[3];
      const cardAtPosition5 = hand.cards[5];
      const cardAtPosition6 = hand.cards[6];
      
      // Discard card at position 4
      hand.discardAndReplace([4], deck);
      
      // Cards at other positions should still be in the hand
      expect(hand.cards).toContain(cardAtPosition1);
      expect(hand.cards).toContain(cardAtPosition3);
      expect(hand.cards).toContain(cardAtPosition5);
      expect(hand.cards).toContain(cardAtPosition6);
    });

    it("should keep non-discarded cards when discarding multiple cards", () => {
      const deck = new Deck();
      const hand = new Hand(deck);
      const cardAtPosition0 = hand.cards[0];
      const cardAtPosition2 = hand.cards[2];
      const cardAtPosition6 = hand.cards[6];
      
      // Discard cards at positions 1, 3, 4, 5
      hand.discardAndReplace([1, 3, 4, 5], deck);
      
      // Cards at non-discarded positions should still be in the hand
      expect(hand.cards).toContain(cardAtPosition0);
      expect(hand.cards).toContain(cardAtPosition2);
      expect(hand.cards).toContain(cardAtPosition6);
      
      // Hand should still have 7 cards
      expect(hand.cards.length).toBe(7);
    });

    it("should ensure no duplicate cards after discard and replace", () => {
      const deck = new Deck();
      const hand = new Hand(deck);
      
      hand.discardAndReplace([0, 1, 2], deck);
      
      const cardKeys = hand.cards.map((c) => `${c.colour}-${c.number}`);
      const uniqueKeys = new Set(cardKeys);
      expect(uniqueKeys.size).toBe(hand.cards.length);
    });

    it("should throw error for invalid negative index", () => {
      const deck = new Deck();
      const hand = new Hand(deck);
      
      expect(() => {
        hand.discardAndReplace([-1], deck);
      }).toThrow("Invalid card index: -1");
    });

    it("should throw error for index out of bounds", () => {
      const deck = new Deck();
      const hand = new Hand(deck);
      
      expect(() => {
        hand.discardAndReplace([10], deck);
      }).toThrow("Invalid card index: 10");
    });

    it("should throw error when deck has insufficient cards", () => {
      const deck = new Deck();
      const hand = new Hand(deck);
      // Draw most cards from deck, leaving only 2
      deck.drawCards(43);
      
      expect(() => {
        hand.discardAndReplace([0, 1, 2], deck);
      }).toThrow("Cannot draw 3 cards: only 2 cards remaining in deck");
    });

    it("should maintain hand size of 7 after discard and replace", () => {
      const deck = new Deck();
      const hand = new Hand(deck);
      
      hand.discardAndReplace([0, 1, 2, 3, 4], deck);
      expect(hand.cards.length).toBe(7);
      
      hand.discardAndReplace([0], deck);
      expect(hand.cards.length).toBe(7);
    });

    it("should replace cards with new cards from deck", () => {
      const deck = new Deck();
      const hand = new Hand(deck);
      const topDeckCard = deck.cards[0];
      const secondDeckCard = deck.cards[1];
      
      hand.discardAndReplace([0], deck);
      
      // The hand should now contain the top card from the deck
      expect(hand.cards).toContain(topDeckCard);
      
      hand.discardAndReplace([0], deck);
      
      // The hand should now contain the second card from original deck
      expect(hand.cards).toContain(secondDeckCard);
    });

    it("should handle discarding the same index multiple times correctly", () => {
      const deck = new Deck();
      const hand = new Hand(deck);
      const initialHandSize = hand.cards.length;
      const initialDeckSize = deck.cards.length;
      
      // First discard
      hand.discardAndReplace([0], deck);
      expect(hand.cards.length).toBe(initialHandSize);
      expect(deck.cards.length).toBe(initialDeckSize - 1);
      
      // Discard again (index 0 now refers to a different card)
      const newCardAt0 = hand.cards[0];
      hand.discardAndReplace([0], deck);
      expect(hand.cards.length).toBe(initialHandSize);
      expect(hand.cards[0]).not.toBe(newCardAt0);
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

