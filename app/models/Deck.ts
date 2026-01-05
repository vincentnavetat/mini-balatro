import { Card, VALID_COLOURS, VALID_NUMBERS } from "./Card";

export class Deck {
  private _cards: Card[];

  constructor() {
    this._cards = this.createFullDeck();

    this.shuffle();
  }

  get cards(): readonly Card[] {
    return this._cards;
  }

  drawCards(count: number): Card[] {
    if (count < 0) {
      throw new Error(`Cannot draw negative number of cards: ${count}`);
    }
    if (count > this._cards.length) {
      throw new Error(`Cannot draw ${count} cards: only ${this._cards.length} cards remaining in deck`);
    }
    return this._cards.splice(0, count);
  }

  private createFullDeck(): Card[] {
    const cards: Card[] = [];
    for (const colour of VALID_COLOURS) {
      for (const number of VALID_NUMBERS) {
        cards.push(new Card(colour, number));
      }
    }
    return cards;
  }

  private shuffle(): void {
    // Fisher-Yates shuffle algorithm
    for (let i = this._cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this._cards[i], this._cards[j]] = [this._cards[j], this._cards[i]];
    }
  }
}
