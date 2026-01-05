import { useEffect, useMemo, useState } from "react";
import type { Route } from "./+types/home";
import { Deck } from "../models/Deck";
import { Round, MAX_DISCARDS, MAX_FIGURES } from "../models/Round";
import { FigureFactory } from "../models/FigureFactory";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Mini Balatro" },
    { name: "description", content: "A mini Balatro card game" },
  ];
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [round, setRound] = useState<Round | null>(null);

  useEffect(() => {
    // Only create the deck on the client to avoid hydration mismatch
    setMounted(true);
    const deck = new Deck();
    setRound(new Round(deck, 300));
  }, []);

  const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [figureName, setFigureName] = useState<string | null>(null);
  const [handUpdateTrigger, setHandUpdateTrigger] = useState(0); // Trigger re-render when hand changes

  const cards = useMemo(() => round ? [...round.hand.cards] : [], [round, handUpdateTrigger]);
  const deckRemaining = useMemo(() => round ? round.deck.cards.length : 0, [round, handUpdateTrigger]);
  const canDiscard = useMemo(() => round ? round.canDiscard() : false, [round, handUpdateTrigger]);
  const discardCount = useMemo(() => round ? round.discardCount : 0, [round, handUpdateTrigger]);
  const currentScore = useMemo(() => round ? round.currentScore : 0, [round, handUpdateTrigger]);
  const targetScore = useMemo(() => round ? round.targetScore : 300, [round, handUpdateTrigger]);
  const figuresPlayed = useMemo(() => round ? round.figuresPlayed : 0, [round, handUpdateTrigger]);
  const canPlayFigure = useMemo(() => round ? round.canPlayFigure() : false, [round, handUpdateTrigger]);
  const isWon = useMemo(() => round ? round.isWon() : false, [round, handUpdateTrigger]);
  const isLost = useMemo(() => round ? round.isLost() : false, [round, handUpdateTrigger]);

  const handleCardClick = (index: number) => {
    if (submitted) return; // Don't allow selection after submit

    setSelectedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        // Only allow adding if we haven't reached the limit of 5 cards
        if (newSet.size < 5) {
          newSet.add(index);
        }
      }
      return newSet;
    });
  };

  const handleDiscard = () => {
    if (!round) return;
    if (selectedCards.size === 0 || selectedCards.size > 5) return;
    if (selectedCards.size > deckRemaining) {
      // Not enough cards in deck to replace
      return;
    }
    if (!round.canDiscard()) {
      // Already discarded twice
      return;
    }

    const indicesToDiscard = Array.from(selectedCards);
    round.hand.discardAndReplace(indicesToDiscard, round.deck);
    round.incrementDiscardCount();

    // Clear selection and trigger re-render
    setSelectedCards(new Set());
    setHandUpdateTrigger(prev => prev + 1);
  };

  const handleSubmit = () => {
    if (!round) return;
    if (selectedCards.size === 0) return;
    if (!round.canPlayFigure()) return;

    const selectedCardArray = Array.from(selectedCards)
      .map((index) => cards[index])
      .filter((card) => card !== undefined);

    if (selectedCardArray.length > 0) {
      const figure = FigureFactory.figureForCards(selectedCardArray);
      round.playFigure(figure);

      // Show the figure that was played
      setScore(figure.score());
      setFigureName(figure.name());
      setSubmitted(true);

      // Update hand trigger to reflect new cards
      setHandUpdateTrigger(prev => prev + 1);

      // If user can play another figure, reset after a brief moment
      // Otherwise, keep submitted state to show final result
      if (round.canPlayFigure()) {
        // Reset after showing the result briefly
        setTimeout(() => {
          setSubmitted(false);
          setSelectedCards(new Set());
          setScore(null);
          setFigureName(null);
        }, 1500);
      }
    }
  };

  const getColourSymbol = (colour: string) => {
    switch (colour) {
      case "Heart":
        return "♥";
      case "Diamond":
        return "♦";
      case "Club":
        return "♣";
      case "Spade":
        return "♠";
      default:
        return "";
    }
  };

  const getColourClass = (colour: string) => {
    switch (colour) {
      case "Heart":
      case "Diamond":
        return "text-red-600 dark:text-red-400";
      case "Club":
      case "Spade":
        return "text-gray-900 dark:text-gray-100";
      default:
        return "";
    }
  };

  if (!mounted || !round) {
    return (
      <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
            Mini Balatro
          </h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
          Mini Balatro
        </h1>

        {/* Score Indicator */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border-2 border-blue-200 dark:border-blue-800">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                Current Score
              </div>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                {currentScore}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                Target Score
              </div>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                {targetScore}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                Figures Played
              </div>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                {figuresPlayed} / {MAX_FIGURES}
              </div>
            </div>
          </div>
          {isWon && (
            <div className="mt-3 text-center text-lg font-bold text-green-700 dark:text-green-300">
              🎉 You Won! 🎉
            </div>
          )}
          {isLost && (
            <div className="mt-3 text-center text-lg font-bold text-red-700 dark:text-red-300">
              Game Over - You Lost
            </div>
          )}
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Your Hand ({cards.length} cards)
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Deck: {deckRemaining} cards remaining
            </p>
          </div>
          {!submitted && (
            <div className="space-y-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Select up to 5 cards ({selectedCards.size} / 5 selected)
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Discards remaining: {MAX_DISCARDS - discardCount} / {MAX_DISCARDS}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {cards.map((card, index) => {
            const isSelected = selectedCards.has(index);
            const isDisabled = !submitted && !isSelected && selectedCards.size >= 5;
            return (
              <div
                key={index}
                onClick={() => handleCardClick(index)}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-2 transition-all ${
                  submitted
                    ? "cursor-default"
                    : isDisabled
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                } ${
                  isSelected
                    ? "border-blue-500 dark:border-blue-400 ring-4 ring-blue-200 dark:ring-blue-800 shadow-lg scale-105"
                    : isDisabled
                    ? "border-gray-200 dark:border-gray-700"
                    : "border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <div className={`text-4xl font-bold text-center ${getColourClass(card.colour)}`}>
                  {getColourSymbol(card.colour)}
                </div>
                <div className="text-center mt-2">
                  <div className={`text-xl font-semibold ${getColourClass(card.colour)}`}>
                    {card.number}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {card.colour}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          {!submitted && (
            <div className="flex gap-4">
              <button
                onClick={handleDiscard}
                disabled={selectedCards.size === 0 || selectedCards.size > 5 || selectedCards.size > deckRemaining || !canDiscard}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedCards.size === 0 || selectedCards.size > 5 || selectedCards.size > deckRemaining || !canDiscard
                    ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-orange-600 hover:bg-orange-700 text-white shadow-md hover:shadow-lg transform hover:scale-105"
                }`}
              >
                Discard {selectedCards.size > 0 ? `(${selectedCards.size})` : ""}
              </button>
              <button
                onClick={handleSubmit}
                disabled={selectedCards.size === 0 || !canPlayFigure}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedCards.size === 0 || !canPlayFigure
                    ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105"
                }`}
              >
                Submit
              </button>
            </div>
          )}

          {submitted && figureName !== null && score !== null && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border-2 border-green-200 dark:border-green-800">
              <div className="text-lg font-semibold text-green-800 dark:text-green-200">
                Figure: {figureName}
              </div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300 mt-2">
                Score: +{score} (Total: {currentScore})
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
