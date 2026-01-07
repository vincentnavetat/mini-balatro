import { describe, it, expect } from "vitest";
import { Player } from "../app/models/Player";
import { Joker } from "../app/models/Joker";

class TestJoker extends Joker {
  affectFigureMultiplier(multiplier: number): number {
    return multiplier;
  }
}

describe("Player", () => {
  it("should start with 0 money by default", () => {
    const player = new Player();
    expect(player.money).toBe(0);
  });

  it("should allow setting money", () => {
    const player = new Player();
    player.money = 100;
    expect(player.money).toBe(100);
  });

  it("should allow initializing with a specific amount of money", () => {
    const player = new Player(50);
    expect(player.money).toBe(50);
  });

  it("should allow adding money", () => {
    const player = new Player(50);
    player.addMoney(25);
    expect(player.money).toBe(75);
  });

  it("should start with no jokers", () => {
    const player = new Player();
    expect(player.jokers).toEqual([]);
  });

  it("should allow adding up to 5 jokers", () => {
    const player = new Player();
    for (let i = 0; i < 5; i++) {
      player.addJoker(new TestJoker());
    }
    expect(player.jokers.length).toBe(5);
  });

  it("should throw an error when adding more than 5 jokers", () => {
    const player = new Player();
    for (let i = 0; i < 5; i++) {
      player.addJoker(new TestJoker());
    }
    expect(() => player.addJoker(new TestJoker())).toThrow(
      "Cannot have more than 5 jokers"
    );
  });
});

