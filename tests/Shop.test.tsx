import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Shop from "../app/routes/shop";
import { Player } from "../app/models/Player";

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
});

