import { Card } from "./Card";
import { Deck } from "./Deck";

export class Hand {
  private _cards: Card[];

  constructor(deck: Deck) {
    this._cards = deck.drawCards(7);
  }

  get cards(): readonly Card[] {
    return this._cards;
  }

  discardAndReplace(indices: number[], deck: Deck): void {
    // Sort indices in descending order to remove from end to beginning
    const sortedIndices = [...indices].sort((a, b) => b - a);

    // Validate indices
    for (const index of sortedIndices) {
      if (index < 0 || index >= this._cards.length) {
        throw new Error(`Invalid card index: ${index}`);
      }
    }

    // Remove cards at specified indices
    for (const index of sortedIndices) {
      this._cards.splice(index, 1);
    }

    // Draw new cards to replace discarded ones
    const newCards = deck.drawCards(indices.length);
    this._cards.push(...newCards);
  }

  removeCards(cardsToRemove: Card[]): void {
    // Remove cards by matching colour and number
    for (const cardToRemove of cardsToRemove) {
      const index = this._cards.findIndex(
        (card) => card.colour === cardToRemove.colour && card.number === cardToRemove.number
      );
      if (index !== -1) {
        this._cards.splice(index, 1);
      }
    }
  }

  drawToFill(deck: Deck, targetCount: number): void {
    // Draw cards until hand has targetCount cards
    const cardsNeeded = targetCount - this._cards.length;
    if (cardsNeeded > 0) {
      const newCards = deck.drawCards(cardsNeeded);
      this._cards.push(...newCards);
    }
  }
}

