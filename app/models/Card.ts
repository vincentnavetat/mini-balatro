export const VALID_COLOURS = ["Heart", "Diamond", "Club", "Spade"] as const;
export const VALID_NUMBERS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"] as const;

export type CardColour = typeof VALID_COLOURS[number];
export type CardNumber = typeof VALID_NUMBERS[number];

export class Card {
  private _colour: CardColour;
  private _number: CardNumber;

  constructor(colour: CardColour, number: CardNumber) {
    this.validateColour(colour);
    this.validateNumber(number);
    this._colour = colour;
    this._number = number;
  }

  get colour(): CardColour {
    return this._colour;
  }

  get number(): CardNumber {
    return this._number;
  }

  get points(): number {
    // Numeric cards
    if (this._number === "2") return 2;
    if (this._number === "3") return 3;
    if (this._number === "4") return 4;
    if (this._number === "5") return 5;
    if (this._number === "6") return 6;
    if (this._number === "7") return 7;
    if (this._number === "8") return 8;
    if (this._number === "9") return 9;
    if (this._number === "10") return 10;

    // Face cards
    if (this._number === "Jack") return 10;
    if (this._number === "Queen") return 10;
    if (this._number === "King") return 10;
    if (this._number === "Ace") return 11;

    return 0;
  }

  private validateColour(colour: string): void {
    if (!VALID_COLOURS.includes(colour as CardColour)) {
      throw new Error(`Invalid colour: ${colour}. Must be one of: ${VALID_COLOURS.join(", ")}`);
    }
  }

  private validateNumber(number: string): void {
    if (!VALID_NUMBERS.includes(number as CardNumber)) {
      throw new Error(`Invalid number: ${number}. Must be one of: ${VALID_NUMBERS.join(", ")}`);
    }
  }
}

