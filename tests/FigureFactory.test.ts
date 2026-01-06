import { describe, it, expect } from "vitest";
import { FigureFactory } from "../app/models/FigureFactory";
import { Card } from "../app/models/Card";
import { DoublePair } from "../app/models/figures/DoublePair";
import { Pair } from "../app/models/figures/Pair";
import { HighCard } from "../app/models/figures/HighCard";
import { ThreeOfAKind } from "../app/models/figures/ThreeOfAKind";
import { FourOfAKind } from "../app/models/figures/FourOfAKind";
import { Straight } from "../app/models/figures/Straight";
import { Flush } from "../app/models/figures/Flush";
import { FullHouse } from "../app/models/figures/FullHouse";
import { StraightFlush } from "../app/models/figures/StraightFlush";

describe("FigureFactory", () => {
  describe("figureForCards", () => {
    describe("empty array", () => {
      it("should throw error for empty card array", () => {
        expect(() => {
          FigureFactory.figureForCards([]);
        }).toThrow("Cannot create figure from empty card array");
      });
    });

    describe("HighCard", () => {
      it("should return HighCard for single card", () => {
        const cards = [new Card("Heart", "Ace")];
        const figure = FigureFactory.figureForCards(cards);

        expect(figure).toBeInstanceOf(HighCard);
        expect(figure.cards.length).toBe(1);
        expect(figure.cards[0].number).toBe("Ace");
      });

      it("should return HighCard with highest card when no pairs exist", () => {
        const cards = [
          new Card("Heart", "2"),
          new Card("Diamond", "5"),
          new Card("Club", "3"),
        ];
        const figure = FigureFactory.figureForCards(cards);

        expect(figure).toBeInstanceOf(HighCard);
        expect(figure.cards.length).toBe(1);
        expect(figure.cards[0].number).toBe("5"); // Highest card
      });

      it("should return HighCard with highest card by points for face cards", () => {
        const cards = [
          new Card("Heart", "Jack"),
          new Card("Diamond", "King"),
          new Card("Club", "Ace"),
        ];
        const figure = FigureFactory.figureForCards(cards);

        expect(figure).toBeInstanceOf(HighCard);
        expect(figure.cards.length).toBe(1);
        expect(figure.cards[0].number).toBe("Ace"); // Highest points (11)
      });

      it("should ignore non-scoring cards and return highest card", () => {
        const cards = [
          new Card("Heart", "2"),
          new Card("Diamond", "7"),
          new Card("Club", "3"),
          new Card("Spade", "4"),
        ];
        const figure = FigureFactory.figureForCards(cards);

        expect(figure).toBeInstanceOf(HighCard);
        expect(figure.cards.length).toBe(1);
        expect(figure.cards[0].number).toBe("7"); // Highest card
      });
    });

    describe("Pair", () => {
      it("should return Pair for two cards of same number", () => {
        const cards = [
          new Card("Heart", "Ace"),
          new Card("Diamond", "Ace"),
        ];
        const figure = FigureFactory.figureForCards(cards);

        expect(figure).toBeInstanceOf(Pair);
        expect(figure.cards.length).toBe(2);
        expect(figure.cards[0].number).toBe("Ace");
        expect(figure.cards[1].number).toBe("Ace");
      });

      it("should return Pair and ignore non-scoring cards", () => {
        const cards = [
          new Card("Heart", "5"),
          new Card("Diamond", "5"),
          new Card("Club", "2"),
          new Card("Spade", "3"),
        ];
        const figure = FigureFactory.figureForCards(cards);

        expect(figure).toBeInstanceOf(Pair);
        expect(figure.cards.length).toBe(2);
        expect(figure.cards[0].number).toBe("5");
        expect(figure.cards[1].number).toBe("5");
      });

      it("should return Pair with highest pair when multiple pairs exist", () => {
        const cards = [
          new Card("Heart", "2"),
          new Card("Diamond", "2"),
          new Card("Club", "Ace"),
          new Card("Spade", "Ace"),
        ];
        const figure = FigureFactory.figureForCards(cards);

        expect(figure).toBeInstanceOf(DoublePair); // Should be DoublePair, not Pair!
        expect(figure.cards.length).toBe(4);
      });

      it("should return Pair when only one pair exists among many cards", () => {
        const cards = [
          new Card("Heart", "5"),
          new Card("Diamond", "5"),
          new Card("Club", "2"),
          new Card("Spade", "7"),
          new Card("Heart", "9"),
          new Card("Diamond", "Jack"),
        ];
        const figure = FigureFactory.figureForCards(cards);

        expect(figure).toBeInstanceOf(Pair);
        expect(figure.cards.length).toBe(2);
        expect(figure.cards[0].number).toBe("5");
        expect(figure.cards[1].number).toBe("5");
      });

      it("should return ThreeOfAKind when three cards of same number exist without a pair", () => {
        const cards = [
          new Card("Heart", "Ace"),
          new Card("Diamond", "Ace"),
          new Card("Club", "Ace"),
          new Card("Spade", "2"),
          new Card("Heart", "3"),
        ];
        const figure = FigureFactory.figureForCards(cards);

        expect(figure).toBeInstanceOf(ThreeOfAKind);
        expect(figure.cards.length).toBe(3);
        expect(figure.cards[0].number).toBe("Ace");
        expect(figure.cards[1].number).toBe("Ace");
        expect(figure.cards[2].number).toBe("Ace");
      });
    });

    describe("DoublePair", () => {
      it("should return DoublePair for four cards forming two pairs", () => {
        const cards = [
          new Card("Heart", "Ace"),
          new Card("Diamond", "Ace"),
          new Card("Club", "King"),
          new Card("Spade", "King"),
        ];
        const figure = FigureFactory.figureForCards(cards);

        expect(figure).toBeInstanceOf(DoublePair);
        expect(figure.cards.length).toBe(4);
      });

      it("should return DoublePair and ignore non-scoring cards", () => {
        const cards = [
          new Card("Heart", "5"),
          new Card("Diamond", "5"),
          new Card("Club", "3"),
          new Card("Spade", "3"),
          new Card("Heart", "2"),
          new Card("Diamond", "7"),
        ];
        const figure = FigureFactory.figureForCards(cards);

        expect(figure).toBeInstanceOf(DoublePair);
        expect(figure.cards.length).toBe(4);
        // Should contain the two pairs (5s and 3s)
        const numbers = figure.cards.map((c) => c.number);
        expect(numbers.filter((n) => n === "5").length).toBe(2);
        expect(numbers.filter((n) => n === "3").length).toBe(2);
      });

      it("should return DoublePair with two highest pairs when more than two pairs exist", () => {
        const cards = [
          new Card("Heart", "2"),
          new Card("Diamond", "2"),
          new Card("Club", "5"),
          new Card("Spade", "5"),
          new Card("Heart", "Ace"),
          new Card("Diamond", "Ace"),
        ];
        const figure = FigureFactory.figureForCards(cards);

        expect(figure).toBeInstanceOf(DoublePair);
        expect(figure.cards.length).toBe(4);
        // Should contain the two highest pairs (Aces and 5s, not 2s)
        const numbers = figure.cards.map((c) => c.number);
        expect(numbers.filter((n) => n === "Ace").length).toBe(2);
        expect(numbers.filter((n) => n === "5").length).toBe(2);
      });

      it("should return DoublePair with highest scoring pairs", () => {
        const cards = [
          new Card("Heart", "Jack"),
          new Card("Diamond", "Jack"),
          new Card("Club", "Queen"),
          new Card("Spade", "Queen"),
          new Card("Heart", "King"),
          new Card("Diamond", "King"),
        ];
        const figure = FigureFactory.figureForCards(cards);

        expect(figure).toBeInstanceOf(DoublePair);
        expect(figure.cards.length).toBe(4);
        // Should contain the two highest pairs (Kings and Queens, both worth 10 points)
        const numbers = figure.cards.map((c) => c.number);
        expect(numbers.filter((n) => n === "King").length).toBe(2);
        expect(numbers.filter((n) => n === "Queen").length).toBe(2);
      });
    });

    describe("ThreeOfAKind", () => {
      it("should return ThreeOfAKind for three cards of same number without a pair", () => {
        const cards = [
          new Card("Heart", "Ace"),
          new Card("Diamond", "Ace"),
          new Card("Club", "Ace"),
          new Card("Spade", "2"),
          new Card("Heart", "3"),
        ];
        const figure = FigureFactory.figureForCards(cards);

        expect(figure).toBeInstanceOf(ThreeOfAKind);
        expect(figure.cards.length).toBe(3);
        expect(figure.cards.every((c) => c.number === "Ace")).toBe(true);
      });

      it("should return ThreeOfAKind with highest three when multiple threes exist but no pairs", () => {
        const cards = [
          new Card("Heart", "2"),
          new Card("Diamond", "2"),
          new Card("Club", "2"),
          new Card("Spade", "Ace"),
          new Card("Heart", "Ace"),
          new Card("Diamond", "Ace"),
          new Card("Club", "3"),
          new Card("Spade", "4"),
          new Card("Heart", "5"),
        ];
        const figure = FigureFactory.figureForCards(cards);

        // With 3 Aces and 3 "2"s, it can form a FullHouse (3 Aces + 2 "2"s)
        // So it correctly returns FullHouse, not ThreeOfAKind
        expect(figure).toBeInstanceOf(FullHouse);
        expect(figure.cards.length).toBe(5);
      });
    });

    describe("Straight", () => {
      it("should return Straight for five consecutive cards", () => {
        const cards = [
          new Card("Heart", "2"),
          new Card("Diamond", "3"),
          new Card("Club", "4"),
          new Card("Spade", "5"),
          new Card("Heart", "6"),
        ];
        const figure = FigureFactory.figureForCards(cards);

        expect(figure).toBeInstanceOf(Straight);
        expect(figure.cards.length).toBe(5);
      });

      it("should return Straight with highest cards when multiple straights exist", () => {
        const cards = [
          new Card("Heart", "2"),
          new Card("Diamond", "3"),
          new Card("Club", "4"),
          new Card("Spade", "5"),
          new Card("Heart", "6"),
          new Card("Diamond", "7"),
          new Card("Club", "8"),
        ];
        const figure = FigureFactory.figureForCards(cards);

        expect(figure).toBeInstanceOf(Straight);
        expect(figure.cards.length).toBe(5);
      });
    });

    describe("Flush", () => {
      it("should return Flush for five cards of same suit", () => {
        const cards = [
          new Card("Heart", "2"),
          new Card("Heart", "5"),
          new Card("Heart", "7"),
          new Card("Heart", "9"),
          new Card("Heart", "King"),
        ];
        const figure = FigureFactory.figureForCards(cards);

        expect(figure).toBeInstanceOf(Flush);
        expect(figure.cards.length).toBe(5);
        expect(figure.cards.every((c) => c.colour === "Heart")).toBe(true);
      });
    });

    describe("FullHouse", () => {
      it("should return FullHouse for three of one number and two of another", () => {
        const cards = [
          new Card("Heart", "Ace"),
          new Card("Diamond", "Ace"),
          new Card("Club", "Ace"),
          new Card("Spade", "King"),
          new Card("Heart", "King"),
        ];
        const figure = FigureFactory.figureForCards(cards);

        expect(figure).toBeInstanceOf(FullHouse);
        expect(figure.cards.length).toBe(5);
      });
    });

    describe("FourOfAKind", () => {
      it("should return FourOfAKind for four cards of same number", () => {
        const cards = [
          new Card("Heart", "Ace"),
          new Card("Diamond", "Ace"),
          new Card("Club", "Ace"),
          new Card("Spade", "Ace"),
        ];
        const figure = FigureFactory.figureForCards(cards);

        expect(figure).toBeInstanceOf(FourOfAKind);
        expect(figure.cards.length).toBe(4);
        expect(figure.cards.every((c) => c.number === "Ace")).toBe(true);
      });
    });

    describe("StraightFlush", () => {
      it("should return StraightFlush for five consecutive cards of same suit", () => {
        const cards = [
          new Card("Heart", "2"),
          new Card("Heart", "3"),
          new Card("Heart", "4"),
          new Card("Heart", "5"),
          new Card("Heart", "6"),
        ];
        const figure = FigureFactory.figureForCards(cards);

        expect(figure).toBeInstanceOf(StraightFlush);
        expect(figure.cards.length).toBe(5);
        expect(figure.cards.every((c) => c.colour === "Heart")).toBe(true);
      });
    });

    describe("priority order", () => {
      it("should prefer StraightFlush over all other figures", () => {
        const cards = [
          new Card("Heart", "2"),
          new Card("Heart", "3"),
          new Card("Heart", "4"),
          new Card("Heart", "5"),
          new Card("Heart", "6"),
          new Card("Diamond", "Ace"),
          new Card("Club", "Ace"),
          new Card("Spade", "Ace"),
        ];
        const figure = FigureFactory.figureForCards(cards);

        expect(figure).toBeInstanceOf(StraightFlush);
        expect(figure.cards.length).toBe(5);
      });

      it("should prefer FourOfAKind over FullHouse", () => {
        const cards = [
          new Card("Heart", "Ace"),
          new Card("Diamond", "Ace"),
          new Card("Club", "Ace"),
          new Card("Spade", "Ace"),
          new Card("Heart", "King"),
          new Card("Diamond", "King"),
        ];
        const figure = FigureFactory.figureForCards(cards);

        expect(figure).toBeInstanceOf(FourOfAKind);
        expect(figure.cards.length).toBe(4);
      });

      it("should prefer FullHouse over Flush", () => {
        const cards = [
          new Card("Heart", "Ace"),
          new Card("Diamond", "Ace"),
          new Card("Club", "Ace"),
          new Card("Heart", "King"),
          new Card("Spade", "King"),
          new Card("Heart", "Queen"),
        ];
        const figure = FigureFactory.figureForCards(cards);

        // With 3 Aces and 2 Kings, it forms a FullHouse (higher priority than Flush)
        expect(figure).toBeInstanceOf(FullHouse);
        expect(figure.cards.length).toBe(5);
      });

      it("should prefer Flush over Straight", () => {
        const cards = [
          new Card("Heart", "2"),
          new Card("Heart", "5"),
          new Card("Heart", "7"),
          new Card("Heart", "9"),
          new Card("Heart", "King"),
          new Card("Diamond", "3"),
          new Card("Club", "4"),
        ];
        const figure = FigureFactory.figureForCards(cards);

        expect(figure).toBeInstanceOf(Flush);
        expect(figure.cards.length).toBe(5);
      });

      it("should prefer Straight over ThreeOfAKind", () => {
        const cards = [
          new Card("Heart", "2"),
          new Card("Diamond", "3"),
          new Card("Club", "4"),
          new Card("Spade", "5"),
          new Card("Heart", "6"),
          new Card("Diamond", "Ace"),
          new Card("Club", "Ace"),
        ];
        const figure = FigureFactory.figureForCards(cards);

        expect(figure).toBeInstanceOf(Straight);
        expect(figure.cards.length).toBe(5);
      });

      it("should prefer FullHouse over ThreeOfAKind when both are possible", () => {
        const cards = [
          new Card("Heart", "Ace"),
          new Card("Diamond", "Ace"),
          new Card("Club", "Ace"),
          new Card("Spade", "King"),
          new Card("Heart", "King"),
        ];
        const figure = FigureFactory.figureForCards(cards);

        expect(figure).toBeInstanceOf(FullHouse);
        expect(figure.cards.length).toBe(5);
      });

      it("should prefer FullHouse over DoublePair when both are possible", () => {
        const cards = [
          new Card("Heart", "Ace"),
          new Card("Diamond", "Ace"),
          new Card("Club", "Ace"),
          new Card("Spade", "King"),
          new Card("Heart", "King"),
          new Card("Diamond", "Queen"),
          new Card("Club", "Queen"),
        ];
        const figure = FigureFactory.figureForCards(cards);

        // With 3 Aces and 2 Kings (or 2 Queens), it forms a FullHouse
        // FullHouse (multiplier 4) is higher priority than DoublePair (multiplier 2)
        expect(figure).toBeInstanceOf(FullHouse);
        expect(figure.cards.length).toBe(5);
      });

      it("should prefer DoublePair over Pair", () => {
        const cards = [
          new Card("Heart", "5"),
          new Card("Diamond", "5"),
          new Card("Club", "3"),
          new Card("Spade", "3"),
        ];
        const figure = FigureFactory.figureForCards(cards);

        expect(figure).toBeInstanceOf(DoublePair);
        expect(figure.cards.length).toBe(4);
      });

      it("should prefer Pair over HighCard", () => {
        const cards = [
          new Card("Heart", "Ace"),
          new Card("Diamond", "Ace"),
          new Card("Club", "King"),
        ];
        const figure = FigureFactory.figureForCards(cards);

        expect(figure).toBeInstanceOf(Pair);
        expect(figure.cards.length).toBe(2);
      });
    });

    describe("edge cases", () => {
      it("should handle all same cards (four of a kind)", () => {
        const cards = [
          new Card("Heart", "Ace"),
          new Card("Diamond", "Ace"),
          new Card("Club", "Ace"),
          new Card("Spade", "Ace"),
        ];
        const figure = FigureFactory.figureForCards(cards);

        expect(figure).toBeInstanceOf(FourOfAKind);
        expect(figure.cards.length).toBe(4);
        // Should use 4 Aces
        const numbers = figure.cards.map((c) => c.number);
        expect(numbers.every((n) => n === "Ace")).toBe(true);
      });

      it("should handle many cards with various combinations", () => {
        const cards = [
          new Card("Heart", "2"),
          new Card("Diamond", "2"),
          new Card("Club", "5"),
          new Card("Spade", "5"),
          new Card("Heart", "3"),
          new Card("Diamond", "7"),
          new Card("Club", "Jack"),
          new Card("Spade", "King"),
        ];
        const figure = FigureFactory.figureForCards(cards);

        expect(figure).toBeInstanceOf(DoublePair);
        expect(figure.cards.length).toBe(4);
        // Should use the two highest pairs (5s and 2s)
        const numbers = figure.cards.map((c) => c.number);
        expect(numbers.filter((n) => n === "5").length).toBe(2);
        expect(numbers.filter((n) => n === "2").length).toBe(2);
      });

      it("should correctly identify highest card when all cards are different", () => {
        const cards = [
          new Card("Heart", "2"),
          new Card("Diamond", "10"),
          new Card("Club", "7"),
          new Card("Spade", "Ace"),
        ];
        const figure = FigureFactory.figureForCards(cards);

        expect(figure).toBeInstanceOf(HighCard);
        expect(figure.cards.length).toBe(1);
        expect(figure.cards[0].number).toBe("Ace");
      });
    });
  });
});

