import { Deck } from "./Deck";
import { Hand } from "./Hand";
import { Figure } from "./Figure";

export class Round {
  private _deck: Deck;
  private _hand: Hand;
  private _figure: Figure | null;

  constructor(deck: Deck) {
    this._deck = deck;
    this._hand = new Hand(deck);
    this._figure = null;
  }

  get deck(): Deck {
    return this._deck;
  }

  get hand(): Hand {
    return this._hand;
  }

  get figure(): Figure | null {
    return this._figure;
  }

  set figure(figure: Figure | null) {
    this._figure = figure;
  }
}

