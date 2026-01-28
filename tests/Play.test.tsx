import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Play from "../app/routes/play";
import { Round } from "../app/models/Round";
import { Deck } from "../app/models/Deck";
import { Player } from "../app/models/Player";

// Mock react-router
const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useOutletContext: vi.fn(),
  };
});

import { useOutletContext } from "react-router";

describe("Play Screen", () => {
  let mockRound: Round;
  let mockPlayer: Player;
  let mockContext: any;

  beforeEach(() => {
    vi.clearAllMocks();
    const deck = new Deck();
    mockRound = new Round(deck, 300);
    mockPlayer = new Player(10);
    mockContext = {
      round: mockRound,
      player: mockPlayer,
      roundNumber: 1,
      handUpdateTrigger: 0,
      setHandUpdateTrigger: vi.fn(),
      goToShop: vi.fn(),
      startNextRound: vi.fn(),
      resetGame: vi.fn(),
      hasNextRound: true,
      nextTargetScore: 450,
    };
    (useOutletContext as any).mockReturnValue(mockContext);
  });

  const renderComponent = () => {
    return render(<Play />);
  };

  describe("initial render", () => {
    it("should display the title", () => {
      renderComponent();
      expect(screen.getByText("Mini Balatro")).toBeInTheDocument();
    });

    it("should display the hand with cards", () => {
      renderComponent();
      expect(screen.getByText(/Your Hand/)).toBeInTheDocument();
    });

    it("should have submit button disabled initially", () => {
      renderComponent();
      const submitButton = screen.getByRole("button", { name: /play hand/i });
      expect(submitButton).toBeDisabled();
    });

    it("should display score indicator", () => {
      renderComponent();
      expect(screen.getByText(/Current Score/)).toBeInTheDocument();
      expect(screen.getByText(/Target Score/)).toBeInTheDocument();
      expect(screen.getByText(/Figures Played/)).toBeInTheDocument();
    });
  });

  describe("card selection", () => {
    const getClickableCard = () => {
      const cardNumbers = screen.getAllByText(/Ace|King|Queen|Jack|2|3|4|5|6|7|8|9|10/);
      let element: HTMLElement | null = cardNumbers[0] as HTMLElement;
      while (element) {
        if (element.getAttribute?.('class')?.includes('cursor-pointer')) return element;
        element = element.parentElement;
      }
      return null;
    };

    it("should enable submit button when a card is selected", async () => {
      const user = userEvent.setup();
      renderComponent();

      const submitButton = screen.getByRole("button", { name: /play hand/i });
      const card = getClickableCard();

      if (card) {
        await user.click(card);
        expect(submitButton).toBeEnabled();
      }
    });

    it("should disable submit button when cards are deselected", async () => {
      const user = userEvent.setup();
      renderComponent();

      const submitButton = screen.getByRole("button", { name: /play hand/i });
      const card = getClickableCard();

      if (card) {
        await user.click(card);
        expect(submitButton).toBeEnabled();
        await user.click(card);
        expect(submitButton).toBeDisabled();
      }
    });
  });

  describe("navigation", () => {
    it("should show 'Go to Shop' button when round is won", async () => {
      renderComponent();

      // Manually set round as won
      vi.spyOn(mockRound, 'isWon').mockReturnValue(true);

      // Re-render to pick up changes
      renderComponent();

      expect(screen.getByText(/You Won Round 1!/)).toBeInTheDocument();
      const shopButton = screen.getByRole("button", { name: /go to shop/i });
      expect(shopButton).toBeInTheDocument();
    });

    it("should display the reward amount when round is won", async () => {
      renderComponent();

      vi.spyOn(mockRound, 'isWon').mockReturnValue(true);
      vi.spyOn(mockRound, 'reward', 'get').mockReturnValue(5);

      renderComponent();

      expect(screen.getByText(/Reward: \+\$5/)).toBeInTheDocument();
    });

    it("should call player.addMoney when round is won", async () => {
      const addMoneySpy = vi.spyOn(mockPlayer, 'addMoney');
      vi.spyOn(mockRound, 'isWon').mockReturnValue(true);
      vi.spyOn(mockRound, 'reward', 'get').mockReturnValue(5);

      renderComponent();

      expect(addMoneySpy).toHaveBeenCalledWith(5);
      expect(mockContext.setHandUpdateTrigger).toHaveBeenCalled();
    });

    it("should call goToShop when the shop button is clicked", async () => {
      const user = userEvent.setup();
      vi.spyOn(mockRound, 'isWon').mockReturnValue(true);
      renderComponent();

      const shopButton = screen.getByRole("button", { name: /go to shop/i });
      await user.click(shopButton);
      expect(mockContext.goToShop).toHaveBeenCalled();
    });

    it("should show 'Claim Victory!' button when final round is won", async () => {
      const user = userEvent.setup();
      mockContext.hasNextRound = false;
      vi.spyOn(mockRound, 'isWon').mockReturnValue(true);
      renderComponent();

      const victoryButton = screen.getByRole("button", { name: /claim victory/i });
      expect(victoryButton).toBeInTheDocument();

      await user.click(victoryButton);
      expect(mockContext.startNextRound).toHaveBeenCalled();
    });

    it("should navigate to /game-over when round is lost", async () => {
      vi.spyOn(mockRound, 'isLost').mockReturnValue(true);
      renderComponent();

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/game-over", { viewTransition: true });
      });
    });
  });
});

