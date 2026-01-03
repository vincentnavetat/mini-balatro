import { Deck } from "./Deck";
import { Hand } from "./Hand";

export class Round {
  private _deck: Deck;
  private _hand: Hand;

  constructor(deck: Deck) {
    this._deck = deck;
    this._hand = new Hand(deck);
  }

  get deck(): Deck {
    return this._deck;
  }

  get hand(): Hand {
    return this._hand;
  }
}

