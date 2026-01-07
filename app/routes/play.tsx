import { useState, useMemo, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router";
import type { GameContext } from "./game-layout";
import { FigureFactory } from "../models/FigureFactory";
import { MAX_DISCARDS, MAX_FIGURES } from "../models/Round";

export default function Play() {
  const {
    round,
    player,
    roundNumber,
    handUpdateTrigger,
    setHandUpdateTrigger,
    goToShop,
    startNextRound,
    resetGame,
    hasNextRound
  } = useOutletContext<GameContext>();

  const navigate = useNavigate();
  const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [figureName, setFigureName] = useState<string | null>(null);
  const [rewardClaimed, setRewardClaimed] = useState(false);

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

  useEffect(() => {
    if (isWon && !rewardClaimed && player && round) {
      player.addMoney(round.reward);
      setRewardClaimed(true);
      setHandUpdateTrigger(prev => prev + 1);
    }
  }, [isWon, rewardClaimed, player, round, setHandUpdateTrigger]);

  useEffect(() => {
    if (isLost) {
      navigate("/game-over");
    }
  }, [isLost, navigate]);

  const currentFigureName = useMemo(() => {
    if (selectedCards.size === 0 || submitted) return null;
    const selectedCardArray = Array.from(selectedCards)
      .map((index) => cards[index])
      .filter((card) => card !== undefined);

    if (selectedCardArray.length === 0) return null;

    try {
      return FigureFactory.figureForCards(selectedCardArray).name();
    } catch (e) {
      return null;
    }
  }, [selectedCards, cards, submitted]);

  const handleCardClick = (index: number) => {
    if (submitted || isWon || isLost) return;

    setSelectedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
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
    if (selectedCards.size > deckRemaining) return;
    if (!round.canDiscard()) return;

    const indicesToDiscard = Array.from(selectedCards);
    round.hand.discardAndReplace(indicesToDiscard, round.deck);
    round.incrementDiscardCount();

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

      setScore(figure.score());
      setFigureName(figure.name());
      setSubmitted(true);

      setHandUpdateTrigger(prev => prev + 1);

      if (round.canPlayFigure()) {
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
      case "Heart": return "♥";
      case "Diamond": return "♦";
      case "Club": return "♣";
      case "Spade": return "♠";
      default: return "";
    }
  };

  const getColourClass = (colour: string) => {
    switch (colour) {
      case "Heart":
        return "text-red-700 dark:text-red-100";
      case "Diamond":
        return "text-orange-600 dark:text-orange-100";
      case "Club":
        return "text-blue-900 dark:text-blue-100";
      case "Spade":
        return "text-gray-600 dark:text-gray-100";
      default:
        return "";
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Mini Balatro
          </h1>
          <div className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/40 rounded-full border-2 border-yellow-200 dark:border-yellow-800 flex items-center gap-2">
            <span className="text-yellow-700 dark:text-yellow-400 font-bold text-xl">$</span>
            <span className="text-yellow-900 dark:text-yellow-100 font-bold text-xl">
              {player?.money ?? 0}
            </span>
          </div>
        </div>

        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border-2 border-blue-200 dark:border-blue-800">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">Current Score</div>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{currentScore}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">Target Score</div>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{targetScore}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">Figures Played</div>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{figuresPlayed} / {MAX_FIGURES}</div>
            </div>
          </div>
          {isWon && (
            <div className="mt-6 text-center">
              <div className="text-lg font-bold text-green-700 dark:text-green-300 mb-2">
                🎉 You Won Round {roundNumber}! 🎉
              </div>
              <div className="text-md font-medium text-green-600 dark:text-green-400 mb-4">
                Reward: +${round?.reward ?? 0}
              </div>
              {hasNextRound ? (
                <button
                  onClick={goToShop}
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-lg transform transition-all hover:scale-105"
                >
                  Go to Shop
                </button>
              ) : (
                <button
                  onClick={startNextRound}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg transform transition-all hover:scale-105"
                >
                  Claim Victory!
                </button>
              )}
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
          {!submitted && !isWon && !isLost && (
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
            const isDisabled = !submitted && !isWon && !isLost && !isSelected && selectedCards.size >= 5;
            return (
              <div
                key={index}
                onClick={() => handleCardClick(index)}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-2 transition-all ${
                  submitted || isWon || isLost
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
          {!submitted && currentFigureName && !isWon && !isLost && (
            <div className="mb-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/40 rounded-full text-blue-800 dark:text-blue-200 font-bold text-lg shadow-sm border border-blue-200 dark:border-blue-700">
              {currentFigureName}
            </div>
          )}
          {!submitted && !isWon && !isLost && (
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

