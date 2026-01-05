import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "../app/routes/home";

// Helper to render component
// Since Home doesn't use router hooks, we can render it directly
const renderComponent = () => {
  return render(<Home />);
};

describe("Home", () => {
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
      const submitButton = screen.getByRole("button", { name: /submit/i });
      expect(submitButton).toBeDisabled();
    });

    it("should not display score initially", () => {
      renderComponent();
      expect(screen.queryByText(/Figure:/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Score:/)).not.toBeInTheDocument();
    });
  });

  describe("card selection", () => {
    it("should enable submit button when at least one card is selected", async () => {
      const user = userEvent.setup();
      renderComponent();

      const submitButton = screen.getByRole("button", { name: /submit/i });
      expect(submitButton).toBeDisabled();

      // Find the first card by finding a card number and getting its clickable parent
      const cardNumbers = screen.getAllByText(/Ace|King|Queen|Jack|2|3|4|5|6|7|8|9|10/);

      if (cardNumbers.length > 0) {
        // The card structure: card number is in a div, parent is the clickable div
        // Navigate up to find the clickable parent (has cursor-pointer class)
        let element: HTMLElement | null = cardNumbers[0] as HTMLElement;
        let clickableDiv: HTMLElement | null = null;

        // Go up the DOM tree to find the div with cursor-pointer
        while (element && !clickableDiv) {
          if (element.getAttribute?.('class')?.includes('cursor-pointer')) {
            clickableDiv = element;
            break;
          }
          element = element.parentElement;
        }

        if (clickableDiv) {
          await user.click(clickableDiv);
          await waitFor(() => {
            expect(submitButton).toBeEnabled();
          }, { timeout: 3000 });
        }
      }
    });

    it("should disable submit button when all cards are deselected", async () => {
      const user = userEvent.setup();
      renderComponent();

      const submitButton = screen.getByRole("button", { name: /submit/i });
      const cardNumbers = screen.getAllByText(/Ace|King|Queen|Jack|2|3|4|5|6|7|8|9|10/);

      if (cardNumbers.length > 0) {
        let element: HTMLElement | null = cardNumbers[0] as HTMLElement;
        let clickableDiv: HTMLElement | null = null;

        while (element && !clickableDiv) {
          if (element.getAttribute?.('class')?.includes('cursor-pointer')) {
            clickableDiv = element;
            break;
          }
          element = element.parentElement;
        }

        if (clickableDiv) {
          // Select
          await user.click(clickableDiv);
          await waitFor(() => {
            expect(submitButton).toBeEnabled();
          }, { timeout: 3000 });

          // Deselect
          await user.click(clickableDiv);
          await waitFor(() => {
            expect(submitButton).toBeDisabled();
          }, { timeout: 3000 });
        }
      }
    });
  });

  describe("submit functionality", () => {
    const getClickableCard = (cardNumberElement: HTMLElement): HTMLElement | null => {
      let element: HTMLElement | null = cardNumberElement;
      while (element) {
        const className = element.getAttribute?.('class') || '';
        if (className.includes('cursor-pointer')) {
          return element;
        }
        element = element.parentElement;
      }
      return null;
    };

    it("should create a figure from selected cards when submit is clicked", async () => {
      const user = userEvent.setup();
      renderComponent();

      const submitButton = screen.getByRole("button", { name: /submit/i });
      const cardNumbers = screen.getAllByText(/Ace|King|Queen|Jack|2|3|4|5|6|7|8|9|10/);

      if (cardNumbers.length >= 2) {
        const firstCard = getClickableCard(cardNumbers[0] as HTMLElement);
        const secondCard = getClickableCard(cardNumbers[1] as HTMLElement);

        if (firstCard && secondCard) {
          await user.click(firstCard);
          await user.click(secondCard);

          await waitFor(() => {
            expect(submitButton).toBeEnabled();
          }, { timeout: 3000 });

          await user.click(submitButton);

          // Should display the figure name and score
          await waitFor(() => {
            expect(screen.getByText(/Figure:/)).toBeInTheDocument();
            expect(screen.getByText(/Score:/)).toBeInTheDocument();
          }, { timeout: 3000 });
        }
      }
    });

    it("should disable submit button after submission", async () => {
      const user = userEvent.setup();
      renderComponent();

      const submitButton = screen.getByRole("button", { name: /submit/i });
      const cardNumbers = screen.getAllByText(/Ace|King|Queen|Jack|2|3|4|5|6|7|8|9|10/);

      if (cardNumbers.length > 0) {
        const clickableCard = getClickableCard(cardNumbers[0] as HTMLElement);

        if (clickableCard) {
          await user.click(clickableCard);
          await waitFor(() => {
            expect(submitButton).toBeEnabled();
          }, { timeout: 3000 });

          await user.click(submitButton);

          await waitFor(() => {
            expect(submitButton).toBeDisabled();
          }, { timeout: 3000 });
        }
      }
    });

    it("should display score after submission", async () => {
      const user = userEvent.setup();
      renderComponent();

      const submitButton = screen.getByRole("button", { name: /submit/i });
      const cardNumbers = screen.getAllByText(/Ace|King|Queen|Jack|2|3|4|5|6|7|8|9|10/);

      if (cardNumbers.length > 0) {
        const clickableCard = getClickableCard(cardNumbers[0] as HTMLElement);

        if (clickableCard) {
          await user.click(clickableCard);
          await waitFor(() => {
            expect(submitButton).toBeEnabled();
          }, { timeout: 3000 });

          await user.click(submitButton);

          // Should display score
          await waitFor(() => {
            expect(screen.getByText(/Score:/)).toBeInTheDocument();
            expect(screen.getByText(/Figure:/)).toBeInTheDocument();
          }, { timeout: 3000 });
        }
      }
    });
  });

  describe("discard functionality", () => {
    const getClickableCard = (cardNumberElement: HTMLElement): HTMLElement | null => {
      let element: HTMLElement | null = cardNumberElement;
      while (element) {
        const className = element.getAttribute?.('class') || '';
        if (className.includes('cursor-pointer')) {
          return element;
        }
        element = element.parentElement;
      }
      return null;
    };

    it("should display discard count initially", async () => {
      renderComponent();
      await waitFor(() => {
        expect(screen.getByText(/Discards remaining: 2 \/ 2/)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it("should allow discarding when count is less than 2", async () => {
      const user = userEvent.setup();
      renderComponent();

      const discardButton = screen.getByRole("button", { name: /discard/i });
      const cardNumbers = screen.getAllByText(/Ace|King|Queen|Jack|2|3|4|5|6|7|8|9|10/);

      if (cardNumbers.length > 0) {
        const clickableCard = getClickableCard(cardNumbers[0] as HTMLElement);

        if (clickableCard) {
          await user.click(clickableCard);
          await waitFor(() => {
            expect(discardButton).toBeEnabled();
          }, { timeout: 3000 });

          await user.click(discardButton);
          await waitFor(() => {
            expect(screen.getByText(/Discards remaining: 1 \/ 2/)).toBeInTheDocument();
          }, { timeout: 3000 });
        }
      }
    });

    it("should disable discard button after 2 discards", async () => {
      const user = userEvent.setup();
      renderComponent();

      const discardButton = screen.getByRole("button", { name: /discard/i });
      const cardNumbers = screen.getAllByText(/Ace|King|Queen|Jack|2|3|4|5|6|7|8|9|10/);

      if (cardNumbers.length >= 2) {
        // First discard
        const firstCard = getClickableCard(cardNumbers[0] as HTMLElement);
        if (firstCard) {
          await user.click(firstCard);
          await waitFor(() => {
            expect(discardButton).toBeEnabled();
          }, { timeout: 3000 });
          await user.click(discardButton);
          await waitFor(() => {
            expect(screen.getByText(/Discards remaining: 1 \/ 2/)).toBeInTheDocument();
          }, { timeout: 3000 });
        }

        // Second discard
        const secondCard = getClickableCard(cardNumbers[1] as HTMLElement);
        if (secondCard) {
          await user.click(secondCard);
          await waitFor(() => {
            expect(discardButton).toBeEnabled();
          }, { timeout: 3000 });
          await user.click(discardButton);
          await waitFor(() => {
            expect(screen.getByText(/Discards remaining: 0 \/ 2/)).toBeInTheDocument();
            expect(discardButton).toBeDisabled();
          }, { timeout: 3000 });
        }
      }
    });

    it("should keep discard button disabled after reaching limit even with cards selected", async () => {
      const user = userEvent.setup();
      renderComponent();

      const discardButton = screen.getByRole("button", { name: /discard/i });
      const cardNumbers = screen.getAllByText(/Ace|King|Queen|Jack|2|3|4|5|6|7|8|9|10/);

      if (cardNumbers.length >= 3) {
        // Perform 2 discards
        for (let i = 0; i < 2; i++) {
          const card = getClickableCard(cardNumbers[i] as HTMLElement);
          if (card) {
            await user.click(card);
            await waitFor(() => {
              expect(discardButton).toBeEnabled();
            }, { timeout: 3000 });
            await user.click(discardButton);
            await waitFor(() => {
              expect(discardButton).toBeDisabled();
            }, { timeout: 3000 });
          }
        }

        // Try to select a card after reaching limit
        const thirdCard = getClickableCard(cardNumbers[2] as HTMLElement);
        if (thirdCard) {
          await user.click(thirdCard);
          await waitFor(() => {
            // Button should still be disabled even with a card selected
            expect(discardButton).toBeDisabled();
          }, { timeout: 3000 });
        }
      }
    });
  });
});

