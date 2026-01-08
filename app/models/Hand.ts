import { Card, VALID_NUMBERS, VALID_COLOURS } from "./Card";
import { Deck } from "./Deck";

export type SortMethod = "rank" | "colour";

export class Hand {
  private _cards: Card[];
  private _sortMethod: SortMethod = "rank";

  constructor(deck: Deck) {
    this._cards = deck.drawCards(7);
    this.sortCards();
  }

  get cards(): readonly Card[] {
    return this._cards;
  }

  get sortMethod(): SortMethod {
    return this._sortMethod;
  }

  setSortMethod(method: SortMethod): void {
    this._sortMethod = method;
    this.sortCards();
  }

  private sortCards(): void {
    this._cards.sort((a, b) => {
      if (this._sortMethod === "rank") {
        const aIndex = VALID_NUMBERS.indexOf(a.number);
        const bIndex = VALID_NUMBERS.indexOf(b.number);
        if (aIndex !== bIndex) {
          return bIndex - aIndex;
        }
        // If ranks are equal, sort by colour to keep it stable
        return VALID_COLOURS.indexOf(a.colour) - VALID_COLOURS.indexOf(b.colour);
      } else {
        const aColIndex = VALID_COLOURS.indexOf(a.colour);
        const bColIndex = VALID_COLOURS.indexOf(b.colour);
        if (aColIndex !== bColIndex) {
          return aColIndex - bColIndex;
        }
        // If colours are equal, sort by rank
        const aRankIndex = VALID_NUMBERS.indexOf(a.number);
        const bRankIndex = VALID_NUMBERS.indexOf(b.number);
        return bRankIndex - aRankIndex;
      }
    });
  }

  discardAndReplace(indices: number[], deck: Deck): void {
    // Validate indices
    const sortedIndices = [...indices].sort((a, b) => b - a);
    for (const index of sortedIndices) {
      if (index < 0 || index >= this._cards.length) {
        throw new Error(`Invalid card index: ${index}`);
      }
    }

    // Draw new cards
    const newCards = deck.drawCards(indices.length);

    // Remove old cards (from end to beginning to preserve indices)
    for (const index of sortedIndices) {
      this._cards.splice(index, 1);
    }

    // Add new cards and sort
    this._cards.push(...newCards);
    this.sortCards();
  }

  removeCards(cardsToRemove: Card[]): void {
    const cardsToRemoveSet = new Set(
      cardsToRemove.map(c => `${c.colour}-${c.number}`)
    );

    // Filter out the cards to remove
    this._cards = this._cards.filter(card => {
      const cardKey = `${card.colour}-${card.number}`;
      if (cardsToRemoveSet.has(cardKey)) {
        cardsToRemoveSet.delete(cardKey);
        return false;
      }
      return true;
    });
  }

  drawToFill(deck: Deck, targetCount: number): void {
    // Draw cards until hand has targetCount cards
    const cardsNeeded = targetCount - this._cards.length;
    if (cardsNeeded > 0) {
      const newCards = deck.drawCards(cardsNeeded);
      this._cards.push(...newCards);
      this.sortCards();
    }
  }
}

