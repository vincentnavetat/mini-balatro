import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GameWon from "../app/routes/game-won";
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

describe("GameWon Screen", () => {
  let mockContext: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockContext = {
      player: new Player(150),
      resetGame: vi.fn(),
    };
    (useOutletContext as any).mockReturnValue(mockContext);
  });

  it("should display the You Won title", () => {
    render(<GameWon />);
    expect(screen.getByText("YOU WON!")).toBeInTheDocument();
  });

  it("should display total money earned", () => {
    render(<GameWon />);
    expect(screen.getByText("$150")).toBeInTheDocument();
  });

  it("should call resetGame when 'PLAY AGAIN' is clicked", async () => {
    const user = userEvent.setup();
    render(<GameWon />);
    
    const resetButton = screen.getByRole("button", { name: /PLAY AGAIN/i });
    await user.click(resetButton);
    
    expect(mockContext.resetGame).toHaveBeenCalled();
  });
});

