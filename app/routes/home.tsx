import { useMemo } from "react";
import type { Route } from "./+types/home";
import { Deck } from "../models/Deck";
import { Round } from "../models/Round";

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

  const cards = round.hand.cards;

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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-2 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
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
          ))}
        </div>
      </div>
    </main>
  );
}
