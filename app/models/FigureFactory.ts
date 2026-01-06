import { Card, VALID_NUMBERS } from "./Card";
import { Figure } from "./Figure";
import { DoublePair } from "./figures/DoublePair";
import { Pair } from "./figures/Pair";
import { HighCard } from "./figures/HighCard";
import { ThreeOfAKind } from "./figures/ThreeOfAKind";
import { FourOfAKind } from "./figures/FourOfAKind";
import { Straight } from "./figures/Straight";
import { Flush } from "./figures/Flush";
import { FullHouse } from "./figures/FullHouse";
import { StraightFlush } from "./figures/StraightFlush";

export class FigureFactory {
  static figureForCards(cards: Card[]): Figure {
    if (cards.length === 0) {
      throw new Error("Cannot create figure from empty card array");
    }

    // Check figures in priority order (highest multiplier first)

    // 1. Straight Flush (multiplier 8) - 5 cards of same suit in sequence
    const straightFlush = this.findStraightFlush(cards);
    if (straightFlush) {
      return new StraightFlush(straightFlush);
    }

    // 2. Four of a Kind (multiplier 7) - 4 cards of same number
    const fourOfAKind = this.findFourOfAKind(cards);
    if (fourOfAKind) {
      return new FourOfAKind(fourOfAKind);
    }

    // 3. Full House (multiplier 4) - 3 cards of one number + 2 cards of another
    const fullHouse = this.findFullHouse(cards);
    if (fullHouse) {
      return new FullHouse(fullHouse);
    }

    // 4. Flush (multiplier 4) - 5 cards of same suit
    const flush = this.findFlush(cards);
    if (flush) {
      return new Flush(flush);
    }

    // 5. Straight (multiplier 4) - 5 cards in sequence
    const straight = this.findStraight(cards);
    if (straight) {
      return new Straight(straight);
    }

    // 6. Three of a Kind (multiplier 3) - 3 cards of same number
    const threeOfAKind = this.findThreeOfAKind(cards);
    if (threeOfAKind) {
      return new ThreeOfAKind(threeOfAKind);
    }

    // 7. Double Pair (multiplier 2) - 2 pairs
    const pairs = this.findPairs(cards);
    if (pairs.length >= 2) {
      const sortedPairs = pairs.sort((a, b) => {
        const aPoints = a[0].points;
        const bPoints = b[0].points;
        if (bPoints !== aPoints) {
          return bPoints - aPoints;
        }
        return this.compareCardNumbers(a[0].number, b[0].number);
      });
      return new DoublePair([...sortedPairs[0], ...sortedPairs[1]]);
    }

    // 8. Pair (multiplier 2) - 1 pair
    if (pairs.length >= 1) {
      const sortedPairs = pairs.sort((a, b) => {
        const aPoints = a[0].points;
        const bPoints = b[0].points;
        if (bPoints !== aPoints) {
          return bPoints - aPoints;
        }
        return this.compareCardNumbers(a[0].number, b[0].number);
      });
      return new Pair(sortedPairs[0]);
    }

    // 9. High Card (multiplier 1) - highest single card
    const sortedCards = [...cards].sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      return this.compareCardNumbers(a.number, b.number);
    });
    return new HighCard([sortedCards[0]]);
  }

  private static findStraightFlush(cards: Card[]): Card[] | null {
    if (cards.length < 5) return null;

    // Group cards by suit
    const groupsBySuit = new Map<string, Card[]>();
    for (const card of cards) {
      if (!groupsBySuit.has(card.colour)) {
        groupsBySuit.set(card.colour, []);
      }
      groupsBySuit.get(card.colour)!.push(card);
    }

    // Check each suit for a straight
    for (const [suit, suitCards] of groupsBySuit.entries()) {
      if (suitCards.length >= 5) {
        const straight = this.findStraightInCards(suitCards);
        if (straight) {
          return straight;
        }
      }
    }

    return null;
  }

  private static findFourOfAKind(cards: Card[]): Card[] | null {
    const groupsByNumber = this.groupByNumber(cards);

    for (const [number, groupCards] of groupsByNumber.entries()) {
      if (groupCards.length >= 4) {
        // Return highest 4 cards of this number
        const sorted = this.sortCardsByPoints(groupCards);
        return sorted.slice(0, 4);
      }
    }

    return null;
  }

  private static findFullHouse(cards: Card[]): Card[] | null {
    const groupsByNumber = this.groupByNumber(cards);

    // Find groups with 3+ cards and groups with 2+ cards
    const threeGroups: Card[][] = [];
    const twoGroups: Card[][] = [];

    for (const [number, groupCards] of groupsByNumber.entries()) {
      if (groupCards.length >= 3) {
        threeGroups.push(groupCards);
      }
      if (groupCards.length >= 2) {
        twoGroups.push(groupCards);
      }
    }

    if (threeGroups.length === 0 || twoGroups.length === 0) {
      return null;
    }

    // Sort by points, then by number rank
    threeGroups.sort((a, b) => {
      if (b[0].points !== a[0].points) {
        return b[0].points - a[0].points;
      }
      return this.compareCardNumbers(a[0].number, b[0].number);
    });

    twoGroups.sort((a, b) => {
      if (b[0].points !== a[0].points) {
        return b[0].points - a[0].points;
      }
      return this.compareCardNumbers(a[0].number, b[0].number);
    });

    const bestThree = threeGroups[0];
    // Find best pair that's not the same number as the three
    const bestTwo = twoGroups.find(group => group[0].number !== bestThree[0].number);

    // Must have a pair that's different from the three-of-a-kind
    if (!bestTwo) {
      return null;
    }

    const sortedThree = this.sortCardsByPoints(bestThree).slice(0, 3);
    const sortedTwo = this.sortCardsByPoints(bestTwo).slice(0, 2);

    return [...sortedThree, ...sortedTwo];
  }

  private static findFlush(cards: Card[]): Card[] | null {
    if (cards.length < 5) return null;

    const groupsBySuit = new Map<string, Card[]>();
    for (const card of cards) {
      if (!groupsBySuit.has(card.colour)) {
        groupsBySuit.set(card.colour, []);
      }
      groupsBySuit.get(card.colour)!.push(card);
    }

    for (const [suit, suitCards] of groupsBySuit.entries()) {
      if (suitCards.length >= 5) {
        // Return highest 5 cards of this suit
        const sorted = this.sortCardsByPoints(suitCards);
        return sorted.slice(0, 5);
      }
    }

    return null;
  }

  private static findStraight(cards: Card[]): Card[] | null {
    if (cards.length < 5) return null;
    return this.findStraightInCards(cards);
  }

  private static findStraightInCards(cards: Card[]): Card[] | null {
    if (cards.length < 5) return null;

    // Get unique numbers and sort by rank
    const uniqueNumbers = new Set(cards.map(c => c.number));
    const sortedNumbers = Array.from(uniqueNumbers).sort((a, b) => {
      return VALID_NUMBERS.indexOf(a as any) - VALID_NUMBERS.indexOf(b as any);
    });

    // Try to find 5 consecutive numbers
    for (let i = 0; i <= sortedNumbers.length - 5; i++) {
      const sequence = sortedNumbers.slice(i, i + 5);
      if (this.isConsecutive(sequence)) {
        // Find the highest card for each number in the sequence
        const straightCards: Card[] = [];
        for (const number of sequence) {
          const cardsWithNumber = cards.filter(c => c.number === number);
          const sorted = this.sortCardsByPoints(cardsWithNumber);
          straightCards.push(sorted[0]);
        }
        // Sort by points descending to get highest scoring straight
        return this.sortCardsByPoints(straightCards);
      }
    }

    return null;
  }

  private static isConsecutive(numbers: string[]): boolean {
    for (let i = 0; i < numbers.length - 1; i++) {
      const currentIndex = VALID_NUMBERS.indexOf(numbers[i] as any);
      const nextIndex = VALID_NUMBERS.indexOf(numbers[i + 1] as any);
      if (nextIndex !== currentIndex + 1) {
        return false;
      }
    }
    return true;
  }

  private static findThreeOfAKind(cards: Card[]): Card[] | null {
    const groupsByNumber = this.groupByNumber(cards);

    const threeGroups: Card[][] = [];
    for (const [number, groupCards] of groupsByNumber.entries()) {
      if (groupCards.length >= 3) {
        threeGroups.push(groupCards);
      }
    }

    if (threeGroups.length === 0) {
      return null;
    }

    // Sort by points, then by number rank
    threeGroups.sort((a, b) => {
      if (b[0].points !== a[0].points) {
        return b[0].points - a[0].points;
      }
      return this.compareCardNumbers(a[0].number, b[0].number);
    });

    const bestThree = threeGroups[0];
    const sorted = this.sortCardsByPoints(bestThree);
    return sorted.slice(0, 3);
  }

  private static findPairs(cards: Card[]): Card[][] {
    const groupsByNumber = this.groupByNumber(cards);
    const pairs: Card[][] = [];

    for (const [number, groupCards] of groupsByNumber.entries()) {
      if (groupCards.length >= 4) {
        // Create 2 pairs from 4+ cards
        const sorted = this.sortCardsByPoints(groupCards);
        pairs.push(sorted.slice(0, 2));
        pairs.push(sorted.slice(2, 4));
      } else if (groupCards.length >= 2) {
        const sorted = this.sortCardsByPoints(groupCards);
        pairs.push(sorted.slice(0, 2));
      }
    }

    return pairs;
  }

  private static groupByNumber(cards: Card[]): Map<string, Card[]> {
    const groupsByNumber = new Map<string, Card[]>();
    for (const card of cards) {
      if (!groupsByNumber.has(card.number)) {
        groupsByNumber.set(card.number, []);
      }
      groupsByNumber.get(card.number)!.push(card);
    }
    return groupsByNumber;
  }

  private static sortCardsByPoints(cards: Card[]): Card[] {
    return [...cards].sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      return this.compareCardNumbers(a.number, b.number);
    });
  }

  private static compareCardNumbers(a: string, b: string): number {
    const aIndex = VALID_NUMBERS.indexOf(a as any);
    const bIndex = VALID_NUMBERS.indexOf(b as any);
    return bIndex - aIndex;
  }
}

