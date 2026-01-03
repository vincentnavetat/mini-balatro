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
}

