import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Shop from "../app/routes/shop";
import { Player } from "../app/models/Player";
import { JokerFactory } from "../app/models/JokerFactory";

// Mock react-router
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useOutletContext: vi.fn(),
  };
});

import { useOutletContext } from "react-router";

describe("Shop Screen", () => {
  let mockContext: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockContext = {
      player: new Player(50),
      roundNumber: 1,
      startNextRound: vi.fn(),
      nextTargetScore: 450,
      setHandUpdateTrigger: vi.fn(),
      boughtJokerNames: [],
      setBoughtJokerNames: vi.fn(),
      shopJokers: [],
      setShopJokers: vi.fn(),
    };
    (useOutletContext as any).mockReturnValue(mockContext);
  });

  it("should display the shop title", () => {
    render(<Shop />);
    expect(screen.getByText("THE SHOP")).toBeInTheDocument();
  });

  it("should display the player's money", () => {
    render(<Shop />);
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("should display the current round", () => {
    render(<Shop />);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("should show the next target score", () => {
    render(<Shop />);
    // Round 1 target is 300, next is 450
    expect(screen.getByText("450")).toBeInTheDocument();
  });

  it("should call startNextRound when 'PLAY NEXT ROUND' is clicked", async () => {
    const user = userEvent.setup();
    render(<Shop />);

    const playButton = screen.getByRole("button", { name: /PLAY NEXT ROUND/i });
    await user.click(playButton);

    expect(mockContext.startNextRound).toHaveBeenCalled();
  });

  it("should display jokers in the shop", () => {
    mockContext.shopJokers = ["Jimbo", "Misprint"];
    render(<Shop />);
    expect(screen.getByText("Jimbo")).toBeInTheDocument();
    expect(screen.getByText("Misprint")).toBeInTheDocument();
  });

  it("should show 'Sold Out' for empty slots", () => {
    mockContext.shopJokers = [null, "Jimbo"];
    render(<Shop />);
    expect(screen.getByText("Sold Out")).toBeInTheDocument();
    expect(screen.getByText("Jimbo")).toBeInTheDocument();
  });

  it("should allow buying a joker if player has enough money", async () => {
    const user = userEvent.setup();
    mockContext.shopJokers = ["Jimbo", null]; // Jimbo costs 2
    render(<Shop />);

    const buyButton = screen.getByRole("button", { name: /Buy for \$2/i });
    await user.click(buyButton);

    expect(mockContext.setShopJokers).toHaveBeenCalled();
    expect(mockContext.setBoughtJokerNames).toHaveBeenCalled();
    expect(mockContext.player.money).toBe(48);
    expect(mockContext.player.jokers.length).toBe(1);
  });

  it("should disable buy button if player cannot afford it", () => {
    mockContext.player = new Player(1);
    mockContext.shopJokers = ["Jimbo", null]; // Jimbo costs 2
    render(<Shop />);

    const buyButton = screen.getByRole("button", { name: /Buy for \$2/i });
    expect(buyButton).toBeDisabled();
  });

  it("should disable buy button if player has max jokers", () => {
    mockContext.player = new Player(50);
    for (let i = 0; i < 5; i++) {
      mockContext.player.addJoker(JokerFactory.createJoker("Jimbo")!);
    }
    mockContext.shopJokers = ["Misprint", null];
    render(<Shop />);

    const buyButton = screen.getByRole("button", { name: /Buy for \$4/i });
    expect(buyButton).toBeDisabled();
  });
});

