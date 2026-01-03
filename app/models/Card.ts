const VALID_COLOURS = ["Heart", "Diamond", "Club", "Spade"] as const;
const VALID_NUMBERS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"] as const;

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

