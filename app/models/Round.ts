import { Deck } from "./Deck";
import { Hand } from "./Hand";
import { Figure } from "./Figure";

export const MAX_DISCARDS = 2;

export class Round {
  private _deck: Deck;
  private _hand: Hand;
  private _figure: Figure | null;
  private _discardCount: number;

  constructor(deck: Deck) {
    this._deck = deck;
    this._hand = new Hand(deck);
    this._figure = null;
    this._discardCount = 0;
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

  get discardCount(): number {
    return this._discardCount;
  }

  canDiscard(): boolean {
    return this._discardCount < MAX_DISCARDS;
  }

  incrementDiscardCount(): void {
    if (this._discardCount >= MAX_DISCARDS) {
      throw new Error(`Cannot discard more than ${MAX_DISCARDS} times per round`);
    }
    this._discardCount++;
  }
}

