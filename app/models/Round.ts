import { Deck } from "./Deck";
import { Hand } from "./Hand";
import { Figure } from "./Figure";
import { Joker } from "./Joker";

export const MAX_DISCARDS = 2;
export const MAX_FIGURES = 5;

export class Round {
  private _deck: Deck;
  private _hand: Hand;
  private _figure: Figure | null;
  private _discardCount: number;
  private _targetScore: number;
  private _reward: number;
  private _currentScore: number;
  private _figuresPlayed: number;

  constructor(deck: Deck, targetScore: number = 300, reward: number = 0) {
    this._deck = deck;
    this._hand = new Hand(deck);
    this._figure = null;
    this._discardCount = 0;
    this._targetScore = targetScore;
    this._reward = reward;
    this._currentScore = 0;
    this._figuresPlayed = 0;
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

  get targetScore(): number {
    return this._targetScore;
  }

  get reward(): number {
    return this._reward;
  }

  get currentScore(): number {
    return this._currentScore;
  }

  get figuresPlayed(): number {
    return this._figuresPlayed;
  }

  canDiscard(): boolean {
    return this._discardCount < MAX_DISCARDS;
  }

  canPlayFigure(): boolean {
    return this._figuresPlayed < MAX_FIGURES && !this.isWon() && !this.isLost();
  }

  isWon(): boolean {
    return this._currentScore >= this._targetScore;
  }

  isLost(): boolean {
    return this._figuresPlayed >= MAX_FIGURES && this._currentScore < this._targetScore;
  }

  incrementDiscardCount(): void {
    if (this._discardCount >= MAX_DISCARDS) {
      throw new Error(`Cannot discard more than ${MAX_DISCARDS} times per round`);
    }
    this._discardCount++;
  }

  playFigure(figure: Figure, jokers: readonly Joker[] = []): void {
    if (!this.canPlayFigure()) {
      throw new Error("Cannot play figure: either max figures reached, already won, or already lost");
    }

    // Add figure's score to current score
    this._currentScore += figure.score(jokers);

    // Discard only the cards from the figure, keep remaining cards in hand
    // Then draw new cards to fill hand
    this._hand.removeCards([...figure.cards]);
    this._hand.drawToFill(this._deck, 7);
    this._figure = null;

    // Increment figures played count
    this._figuresPlayed++;
  }
}

