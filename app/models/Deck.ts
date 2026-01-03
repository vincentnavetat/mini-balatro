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
