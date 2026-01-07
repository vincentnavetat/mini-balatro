import { describe, it, expect } from "vitest";
import { Round, MAX_FIGURES } from "../app/models/Round";
import { Deck } from "../app/models/Deck";
import { Hand } from "../app/models/Hand";
import { Card } from "../app/models/Card";
import { HighCard } from "../app/models/figures/HighCard";
import { Pair } from "../app/models/figures/Pair";

describe("Round", () => {
  describe("constructor", () => {
    it("should create a round with an existing deck", () => {
      const deck = new Deck();
      const round = new Round(deck);

      expect(round.deck).toBe(deck);
    });

    it("should initialize with default target score of 300", () => {
      const deck = new Deck();
      const round = new Round(deck);

      expect(round.targetScore).toBe(300);
    });

    it("should initialize with custom target score", () => {
      const deck = new Deck();
      const round = new Round(deck, 500);

      expect(round.targetScore).toBe(500);
    });

    it("should initialize with custom reward", () => {
      const deck = new Deck();
      const round = new Round(deck, 300, 10);

      expect(round.reward).toBe(10);
    });

    it("should initialize with default reward of 0", () => {
      const deck = new Deck();
      const round = new Round(deck, 300);

      expect(round.reward).toBe(0);
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

  describe("discard count", () => {
    it("should start with discard count of 0", () => {
      const deck = new Deck();
      const round = new Round(deck);

      expect(round.discardCount).toBe(0);
    });

    it("should allow discarding when count is less than 2", () => {
      const deck = new Deck();
      const round = new Round(deck);

      expect(round.canDiscard()).toBe(true);
      round.incrementDiscardCount();
      expect(round.canDiscard()).toBe(true);
    });

    it("should not allow discarding after 2 discards", () => {
      const deck = new Deck();
      const round = new Round(deck);

      round.incrementDiscardCount();
      expect(round.discardCount).toBe(1);
      expect(round.canDiscard()).toBe(true);

      round.incrementDiscardCount();
      expect(round.discardCount).toBe(2);
      expect(round.canDiscard()).toBe(false);
    });

    it("should throw error when trying to increment beyond 2", () => {
      const deck = new Deck();
      const round = new Round(deck);

      round.incrementDiscardCount();
      round.incrementDiscardCount();

      expect(() => {
        round.incrementDiscardCount();
      }).toThrow("Cannot discard more than 2 times per round");
    });
  });

  describe("score tracking", () => {
    it("should start with current score of 0", () => {
      const deck = new Deck();
      const round = new Round(deck);

      expect(round.currentScore).toBe(0);
    });

    it("should have default target score of 300", () => {
      const deck = new Deck();
      const round = new Round(deck);

      expect(round.targetScore).toBe(300);
    });

    it("should allow custom target score", () => {
      const deck = new Deck();
      const round = new Round(deck, 500);

      expect(round.targetScore).toBe(500);
    });

    it("should start with 0 figures played", () => {
      const deck = new Deck();
      const round = new Round(deck);

      expect(round.figuresPlayed).toBe(0);
    });
  });

  describe("playing figures", () => {
    it("should allow playing a figure when under limit", () => {
      const deck = new Deck();
      const round = new Round(deck);

      expect(round.canPlayFigure()).toBe(true);
    });

    it("should add figure score to current score when playing", () => {
      const deck = new Deck();
      const round = new Round(deck);
      const card = new Card("Heart", "Ace");
      const figure = new HighCard([card]);
      const expectedScore = figure.score();

      round.playFigure(figure);

      expect(round.currentScore).toBe(expectedScore);
      expect(round.figuresPlayed).toBe(1);
    });

    it("should accumulate score across multiple figures", () => {
      const deck = new Deck();
      const round = new Round(deck);
      const card1 = new Card("Heart", "Ace");
      const card2 = new Card("Diamond", "King");
      const figure1 = new HighCard([card1]);
      const figure2 = new HighCard([card2]);
      const expectedTotal = figure1.score() + figure2.score();

      round.playFigure(figure1);
      round.playFigure(figure2);

      expect(round.currentScore).toBe(expectedTotal);
      expect(round.figuresPlayed).toBe(2);
    });

    it("should discard only figure cards and keep remaining cards in hand", () => {
      const deck = new Deck();
      const round = new Round(deck);
      const initialHandCards = [...round.hand.cards];
      const initialDeckSize = round.deck.cards.length;
      
      // Find a card from the hand to use in the figure
      const cardToPlay = initialHandCards[0];
      const figure = new HighCard([cardToPlay]);

      round.playFigure(figure);

      // Should still have 7 cards in hand
      expect(round.hand.cards.length).toBe(7);
      
      // The played card should not be in the hand anymore
      const newHandCards = round.hand.cards;
      const playedCardKey = `${cardToPlay.colour}-${cardToPlay.number}`;
      const newHandKeys = new Set(newHandCards.map(c => `${c.colour}-${c.number}`));
      expect(newHandKeys.has(playedCardKey)).toBe(false);

      // The remaining 6 cards from the original hand should still be there
      const remainingCards = initialHandCards.slice(1);
      const remainingKeys = new Set(remainingCards.map(c => `${c.colour}-${c.number}`));
      for (const key of remainingKeys) {
        expect(newHandKeys.has(key)).toBe(true);
      }

      // Deck should have 1 fewer card (1 drawn to replace the played card)
      expect(round.deck.cards.length).toBe(initialDeckSize - 1);
    });

    it("should reset figure to null after playing", () => {
      const deck = new Deck();
      const round = new Round(deck);
      const card = new Card("Heart", "Ace");
      const figure = new HighCard([card]);

      round.figure = figure;
      expect(round.figure).toBe(figure);

      round.playFigure(figure);
      expect(round.figure).toBe(null);
    });

    it("should not allow playing more than 5 figures", () => {
      const deck = new Deck();
      const round = new Round(deck);
      const card = new Card("Heart", "2");
      const figure = new HighCard([card]);

      // Play 5 figures
      for (let i = 0; i < MAX_FIGURES; i++) {
        round.playFigure(figure);
      }

      expect(round.figuresPlayed).toBe(MAX_FIGURES);
      expect(round.canPlayFigure()).toBe(false);

      expect(() => {
        round.playFigure(figure);
      }).toThrow("Cannot play figure: either max figures reached, already won, or already lost");
    });
  });

  describe("winning and losing", () => {
    it("should not be won at start", () => {
      const deck = new Deck();
      const round = new Round(deck);

      expect(round.isWon()).toBe(false);
      expect(round.isLost()).toBe(false);
    });

    it("should win when reaching target score", () => {
      const deck = new Deck();
      const round = new Round(deck, 50); // Lower target for testing (achievable with 5 Aces = 55)
      const card = new Card("Heart", "Ace");
      const figure = new HighCard([card]);

      // Play figures until we reach or exceed target
      while (round.currentScore < 50 && round.canPlayFigure()) {
        round.playFigure(figure);
      }

      expect(round.isWon()).toBe(true);
      expect(round.currentScore).toBeGreaterThanOrEqual(50);
    });

    it("should lose when playing all figures without reaching target", () => {
      const deck = new Deck();
      const round = new Round(deck, 10000); // Very high target
      const card = new Card("Heart", "2");
      const figure = new HighCard([card]);

      // Play all 5 figures
      for (let i = 0; i < MAX_FIGURES; i++) {
        round.playFigure(figure);
      }

      expect(round.isLost()).toBe(true);
      expect(round.isWon()).toBe(false);
      expect(round.currentScore).toBeLessThan(10000);
    });

    it("should not allow playing figure after winning", () => {
      const deck = new Deck();
      const round = new Round(deck, 50); // Low target
      const card = new Card("Heart", "Ace");
      const figure = new HighCard([card]);

      // Play until we win
      while (round.canPlayFigure() && !round.isWon()) {
        round.playFigure(figure);
      }

      expect(round.isWon()).toBe(true);
      expect(round.canPlayFigure()).toBe(false);

      expect(() => {
        round.playFigure(figure);
      }).toThrow("Cannot play figure: either max figures reached, already won, or already lost");
    });

    it("should not allow playing figure after losing", () => {
      const deck = new Deck();
      const round = new Round(deck, 10000); // Very high target
      const card = new Card("Heart", "2");
      const figure = new HighCard([card]);

      // Play all 5 figures
      for (let i = 0; i < MAX_FIGURES; i++) {
        round.playFigure(figure);
      }

      expect(round.isLost()).toBe(true);
      expect(round.canPlayFigure()).toBe(false);

      expect(() => {
        round.playFigure(figure);
      }).toThrow("Cannot play figure: either max figures reached, already won, or already lost");
    });

    it("should win exactly at target score", () => {
      const deck = new Deck();
      const round = new Round(deck, 16); // Target of 16 (Ace = 11 + 5 chips)
      const card = new Card("Heart", "Ace");
      const figure = new HighCard([card]); // Ace = 11 + 5 = 16 points

      round.playFigure(figure);

      expect(round.currentScore).toBe(16);
      expect(round.isWon()).toBe(true);
    });

    it("should handle pair chips correctly in score", () => {
      const deck = new Deck();
      const round = new Round(deck, 100);
      const card1 = new Card("Heart", "Ace");
      const card2 = new Card("Diamond", "Ace");
      const pair = new Pair([card1, card2]);
      // Pair score = (11 + 10) + (11 + 10) = 42

      round.playFigure(pair);

      expect(round.currentScore).toBe(42);
    });

    it("should play multiple figures in sequence correctly", () => {
      const deck = new Deck();
      const round = new Round(deck, 100);
      
      // Use cards from the actual hand
      const card1 = round.hand.cards[0];
      const figure1 = new HighCard([card1]);
      const score1 = figure1.score();

      round.playFigure(figure1);
      expect(round.currentScore).toBe(score1);
      expect(round.figuresPlayed).toBe(1);
      expect(round.hand.cards.length).toBe(7);

      // Use a card from the new hand
      const card2 = round.hand.cards[0];
      const figure2 = new HighCard([card2]);
      const score2 = figure2.score();

      round.playFigure(figure2);
      expect(round.currentScore).toBe(score1 + score2);
      expect(round.figuresPlayed).toBe(2);
      expect(round.hand.cards.length).toBe(7);

      // Use a card from the new hand
      const card3 = round.hand.cards[0];
      const figure3 = new HighCard([card3]);
      const score3 = figure3.score();
      const expectedTotal = score1 + score2 + score3;

      round.playFigure(figure3);
      expect(round.currentScore).toBe(expectedTotal);
      expect(round.figuresPlayed).toBe(3);
      expect(round.hand.cards.length).toBe(7);
    });

    it("should update canPlayFigure after each figure played", () => {
      const deck = new Deck();
      const round = new Round(deck, 1000); // High target so we don't win
      const card = new Card("Heart", "2");
      const figure = new HighCard([card]);

      expect(round.canPlayFigure()).toBe(true);

      for (let i = 0; i < MAX_FIGURES - 1; i++) {
        round.playFigure(figure);
        expect(round.canPlayFigure()).toBe(true);
      }

      round.playFigure(figure);
      expect(round.canPlayFigure()).toBe(false);
      expect(round.isLost()).toBe(true);
    });

    it("should update canPlayFigure when winning", () => {
      const deck = new Deck();
      const round = new Round(deck, 11); // Low target
      const card = new Card("Heart", "Ace");
      const figure = new HighCard([card]); // Score = 11

      expect(round.canPlayFigure()).toBe(true);
      expect(round.isWon()).toBe(false);

      round.playFigure(figure);

      expect(round.isWon()).toBe(true);
      expect(round.canPlayFigure()).toBe(false);
    });

    it("should maintain hand size of 7 after each figure play", () => {
      const deck = new Deck();
      const round = new Round(deck, 1000);

      // Play multiple figures and verify hand size stays at 7
      for (let i = 0; i < 5; i++) {
        expect(round.hand.cards.length).toBe(7);
        // Use a card from the current hand
        const cardFromHand = round.hand.cards[0];
        const figure = new HighCard([cardFromHand]);
        round.playFigure(figure);
        expect(round.hand.cards.length).toBe(7);
      }
    });

    it("should keep remaining cards when playing a pair", () => {
      const deck = new Deck();
      const round = new Round(deck, 1000);
      const initialHandCards = [...round.hand.cards];
      
      // Find two cards with the same number to make a pair
      const card1 = initialHandCards[0];
      let card2 = initialHandCards.find(c => c.number === card1.number && c !== card1);
      
      // If no pair found, we'll need to create one - but for this test, let's assume we find one
      // or we can create cards that we know exist
      if (!card2) {
        // Create a pair from cards we know exist in the deck
        card2 = new Card(card1.colour === "Heart" ? "Diamond" : "Heart", card1.number);
      }
      
      const pair = new Pair([card1, card2]);
      const cardsToKeep = initialHandCards.filter(c => c !== card1 && c !== card2);
      
      round.playFigure(pair);
      
      // Should still have 7 cards
      expect(round.hand.cards.length).toBe(7);
      
      // The two played cards should not be in the hand
      const newHandCards = round.hand.cards;
      const newHandKeys = new Set(newHandCards.map(c => `${c.colour}-${c.number}`));
      expect(newHandKeys.has(`${card1.colour}-${card1.number}`)).toBe(false);
      expect(newHandKeys.has(`${card2.colour}-${card2.number}`)).toBe(false);
      
      // At least some of the remaining cards should still be there (we drew 2 new ones)
      // We should have 5 original cards + 2 new cards = 7 total
      const remainingKeys = new Set(cardsToKeep.map(c => `${c.colour}-${c.number}`));
      let foundRemaining = 0;
      for (const key of remainingKeys) {
        if (newHandKeys.has(key)) {
          foundRemaining++;
        }
      }
      // We should have at least 5 of the original remaining cards
      expect(foundRemaining).toBeGreaterThanOrEqual(5);
    });
  });
});

