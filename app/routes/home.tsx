import { useMemo, useState } from "react";
import type { Route } from "./+types/home";
import { Deck } from "../models/Deck";
import { Round } from "../models/Round";
import { FigureFactory } from "../models/FigureFactory";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Mini Balatro" },
    { name: "description", content: "A mini Balatro card game" },
  ];
}

export default function Home() {
  const round = useMemo(() => {
    const deck = new Deck();
    return new Round(deck);
  }, []);

  const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [figureName, setFigureName] = useState<string | null>(null);

  const cards = round.hand.cards;

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

  const handleSubmit = () => {
    if (selectedCards.size === 0) return;

    const selectedCardArray = Array.from(selectedCards)
      .map((index) => cards[index])
      .filter((card) => card !== undefined);

    if (selectedCardArray.length > 0) {
      const figure = FigureFactory.figureForCards(selectedCardArray);
      round.figure = figure;
      setScore(figure.score());
      setFigureName(figure.name());
      setSubmitted(true);
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

  return (
    <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
          Mini Balatro
        </h1>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Your Hand ({cards.length} cards)
          </h2>
          {!submitted && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Select up to 5 cards ({selectedCards.size} / 5 selected)
            </p>
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
          <button
            onClick={handleSubmit}
            disabled={selectedCards.size === 0 || submitted}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              selectedCards.size === 0 || submitted
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105"
            }`}
          >
            Submit
          </button>

          {submitted && figureName !== null && score !== null && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border-2 border-green-200 dark:border-green-800">
              <div className="text-lg font-semibold text-green-800 dark:text-green-200">
                Figure: {figureName}
              </div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300 mt-2">
                Score: {score}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
