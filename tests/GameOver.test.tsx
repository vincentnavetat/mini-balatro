import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GameOver from "../app/routes/game-over";
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

describe("GameOver Screen", () => {
  let mockContext: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockContext = {
      player: new Player(25),
      roundNumber: 3,
      resetGame: vi.fn(),
    };
    (useOutletContext as any).mockReturnValue(mockContext);
  });

  it("should display the Game Over title", () => {
    render(<GameOver />);
    expect(screen.getByText("GAME OVER")).toBeInTheDocument();
  });

  it("should display final stats", () => {
    render(<GameOver />);
    expect(screen.getByText("3")).toBeInTheDocument(); // round number
    expect(screen.getByText("$25")).toBeInTheDocument(); // money
  });

  it("should call resetGame when 'TRY AGAIN' is clicked", async () => {
    const user = userEvent.setup();
    render(<GameOver />);
    
    const resetButton = screen.getByRole("button", { name: /TRY AGAIN/i });
    await user.click(resetButton);
    
    expect(mockContext.resetGame).toHaveBeenCalled();
  });
});

