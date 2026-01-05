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
    // Sort indices in ascending order to maintain position order
    const sortedIndices = [...indices].sort((a, b) => a - b);

    // Validate indices
    for (const index of sortedIndices) {
      if (index < 0 || index >= this._cards.length) {
        throw new Error(`Invalid card index: ${index}`);
      }
    }

    // Draw new cards first
    const newCards = deck.drawCards(indices.length);

    // Remove and replace cards at specified indices, maintaining positions
    // Process from end to beginning to preserve indices
    for (let i = sortedIndices.length - 1; i >= 0; i--) {
      const index = sortedIndices[i];
      this._cards.splice(index, 1, newCards[i]);
    }
  }

  removeCards(cardsToRemove: Card[]): number[] {
    // Find and collect indices of cards to remove (track original positions)
    const indicesToRemove: number[] = [];
    const cardsToRemoveSet = new Set(
      cardsToRemove.map(c => `${c.colour}-${c.number}`)
    );
    
    // Find all matching cards and their indices
    for (let i = 0; i < this._cards.length; i++) {
      const cardKey = `${this._cards[i].colour}-${this._cards[i].number}`;
      if (cardsToRemoveSet.has(cardKey)) {
        indicesToRemove.push(i);
        // Remove from set to handle duplicates correctly
        cardsToRemoveSet.delete(cardKey);
        if (cardsToRemoveSet.size === 0) break;
      }
    }
    
    // Sort indices in descending order to remove from end to beginning
    const sortedIndices = [...indicesToRemove].sort((a, b) => b - a);
    
    // Remove cards
    for (const index of sortedIndices) {
      this._cards.splice(index, 1);
    }
    
    // Return original indices (before removal) in ascending order for replacement
    return indicesToRemove.sort((a, b) => a - b);
  }

  drawToFill(deck: Deck, targetCount: number, insertAtIndices?: number[]): void {
    // Draw cards until hand has targetCount cards
    const cardsNeeded = targetCount - this._cards.length;
    if (cardsNeeded > 0) {
      const newCards = deck.drawCards(cardsNeeded);
      
      if (insertAtIndices && insertAtIndices.length === cardsNeeded) {
        // Insert new cards at specified positions, maintaining order
        // Sort indices in descending order to insert from end to beginning
        const sortedIndices = [...insertAtIndices].sort((a, b) => b - a);
        for (let i = 0; i < sortedIndices.length; i++) {
          const index = sortedIndices[i];
          this._cards.splice(index, 0, newCards[sortedIndices.length - 1 - i]);
        }
      } else {
        // Fallback: append to end if no positions specified
        this._cards.push(...newCards);
      }
    }
  }
}

