import { Card, VALID_NUMBERS } from "./Card";
import { Figure } from "./Figure";
import { DoublePair } from "./DoublePair";
import { Pair } from "./Pair";
import { HighCard } from "./HighCard";

export class FigureFactory {
  static figureForCards(cards: Card[]): Figure {
    if (cards.length === 0) {
      throw new Error("Cannot create figure from empty card array");
    }

    // Find all pairs (groups of cards with the same number, with at least 2 cards)
    const pairs = this.findPairs(cards);

    // Check for Double Pair (need at least 2 pairs)
    if (pairs.length >= 2) {
      // Take the two highest pairs
      // Sort by points first, then by card number rank for tie-breaking
      const sortedPairs = pairs.sort((a, b) => {
        const aPoints = a[0].points;
        const bPoints = b[0].points;
        if (bPoints !== aPoints) {
          return bPoints - aPoints; // Sort descending by points
        }
        // Tie-break by card number rank (higher rank first)
        return this.compareCardNumbers(a[0].number, b[0].number);
      });

      const firstPair = sortedPairs[0];
      const secondPair = sortedPairs[1];

      // Return DoublePair with 4 cards (2 from first pair, 2 from second pair)
      return new DoublePair([...firstPair, ...secondPair]);
    }

    // Check for Pair (need at least 1 pair)
    if (pairs.length >= 1) {
      // Take the highest pair
      // Sort by points first, then by card number rank for tie-breaking
      const sortedPairs = pairs.sort((a, b) => {
        const aPoints = a[0].points;
        const bPoints = b[0].points;
        if (bPoints !== aPoints) {
          return bPoints - aPoints; // Sort descending by points
        }
        // Tie-break by card number rank (higher rank first)
        return this.compareCardNumbers(a[0].number, b[0].number);
      });

      const bestPair = sortedPairs[0];
      // Return Pair with 2 cards
      return new Pair(bestPair);
    }

    // Fall back to High Card (highest single card)
    // Sort by points first, then by card number rank for tie-breaking
    const sortedCards = [...cards].sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points; // Sort descending by points
      }
      // Tie-break by card number rank (higher rank first)
      return this.compareCardNumbers(a.number, b.number);
    });
    return new HighCard([sortedCards[0]]);
  }

  private static findPairs(cards: Card[]): Card[][] {
    // Group cards by number
    const groupsByNumber = new Map<string, Card[]>();

    for (const card of cards) {
      const number = card.number;
      if (!groupsByNumber.has(number)) {
        groupsByNumber.set(number, []);
      }
      groupsByNumber.get(number)!.push(card);
    }

    // Find groups with at least 2 cards (pairs)
    // For groups with 4+ cards, create 2 pairs
    const pairs: Card[][] = [];
    for (const [number, groupCards] of groupsByNumber.entries()) {
      if (groupCards.length >= 4) {
        // Create 2 pairs from 4+ cards
        pairs.push(groupCards.slice(0, 2));
        pairs.push(groupCards.slice(2, 4));
      } else if (groupCards.length >= 2) {
        // Take exactly 2 cards for the pair
        pairs.push(groupCards.slice(0, 2));
      }
    }

    return pairs;
  }

  private static compareCardNumbers(a: string, b: string): number {
    const aIndex = VALID_NUMBERS.indexOf(a as any);
    const bIndex = VALID_NUMBERS.indexOf(b as any);
    // For descending order (higher rank first): return negative if a > b
    // Higher index = higher rank, so return bIndex - aIndex
    return bIndex - aIndex;
  }
}

