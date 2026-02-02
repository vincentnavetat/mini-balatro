import type { Card } from "./Card";

export abstract class Joker {
  abstract affectFigureMultiplier(multiplier: number): number;

  /**
   * Extra chips added for a single scoring card. Called once per scoring card
   * when the figure is scored. Override to add chips based on card (e.g. +30 for odd).
   */
  abstract affectCardChip(card: Card): number;

  abstract name(): string;
  abstract description(): string;
  abstract price(): number;
}

