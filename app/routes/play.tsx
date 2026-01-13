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
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<"idle" | "playing" | "exiting">("idle");
  const [score, setScore] = useState<number | null>(null);
  const [figureName, setFigureName] = useState<string | null>(null);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [domCards, setDomCards] = useState<import("../models/Card").Card[]>([]);
  const [enteringCards, setEnteringCards] = useState<Set<string>>(new Set());

  const cards = useMemo(() => round ? [...round.hand.cards] : [], [round, handUpdateTrigger]);

  useEffect(() => {
    if (round) {
      const currentHand = round.hand.cards;
      setDomCards(prev => {
        const stillInHand = prev.filter(pc => currentHand.some(cc => cc.id === pc.id));
        const newCards = currentHand.filter(cc => !prev.some(pc => pc.id === cc.id));

        if (newCards.length > 0) {
          setEnteringCards(new Set(newCards.map(c => c.id)));
          setTimeout(() => {
            setEnteringCards(new Set());
          }, 50);
        }

        return [...stillInHand, ...newCards];
      });
    }
  }, [round, handUpdateTrigger]);

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
      .map((id) => cards.find((card) => card.id === id))
      .filter((card): card is NonNullable<typeof card> => card !== undefined);

    if (selectedCardArray.length === 0) return null;

    try {
      return FigureFactory.figureForCards(selectedCardArray).name();
    } catch (e) {
      return null;
    }
  }, [selectedCards, cards, submitted]);

  const handleCardClick = (id: string) => {
    if (submitted || isWon || isLost) return;

    setSelectedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        if (newSet.size < 5) {
          newSet.add(id);
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

    setSubmitted(true);
    setAnimationPhase("exiting");

    setTimeout(() => {
      const indicesToDiscard = Array.from(selectedCards)
        .map(id => cards.findIndex(c => c.id === id))
        .filter(index => index !== -1);

      round.hand.discardAndReplace(indicesToDiscard, round.deck);
      round.incrementDiscardCount();

      setSubmitted(false);
      setAnimationPhase("idle");
      setSelectedCards(new Set());
      setHandUpdateTrigger(prev => prev + 1);
    }, 500);
  };

  const handleSubmit = () => {
    if (!round) return;
    if (selectedCards.size === 0) return;
    if (!round.canPlayFigure()) return;

    const selectedCardArray = Array.from(selectedCards)
      .map((id) => cards.find(c => c.id === id))
      .filter((card): card is NonNullable<typeof card> => card !== undefined);

    if (selectedCardArray.length > 0) {
      const figure = FigureFactory.figureForCards(selectedCardArray);
      const jokers = player?.jokers ?? [];

      setScore(figure.score(jokers));
      setFigureName(figure.name());
      setSubmitted(true);
      setAnimationPhase("playing");

      // Stay in place for 2 seconds
      setTimeout(() => {
        setAnimationPhase("exiting");

        // After exit animation, update game state
        setTimeout(() => {
          round.playFigure(figure, selectedCardArray, jokers);
          setHandUpdateTrigger((prev) => prev + 1);

          setSubmitted(false);
          setAnimationPhase("idle");
          setSelectedCards(new Set());
          setScore(null);
          setFigureName(null);
        }, 500);
      }, 2000);
    }
  };

  const handleSortToggle = () => {
    if (!round) return;
    const currentMethod = round.hand.sortMethod;
    const newMethod = currentMethod === "rank" ? "colour" : "rank";
    round.hand.setSortMethod(newMethod);
    setHandUpdateTrigger((prev) => prev + 1);
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
        return "text-red-700";
      case "Diamond":
        return "text-orange-600";
      case "Club":
        return "text-blue-900";
      case "Spade":
        return "text-gray-600";
      default:
        return "";
    }
  };

  const getShortNumber = (number: string) => {
    switch (number) {
      case "Jack": return "J";
      case "Queen": return "Q";
      case "King": return "K";
      case "Ace": return "A";
      default: return number;
    }
  };

  const getCardTransform = (index: number, total: number, isSelected: boolean, cardId: string) => {
    const centerIndex = (total - 1) / 2;
    const diff = index - centerIndex;
    const rotation = diff * 4; // 4 degrees per card
    const yOffset = Math.pow(Math.abs(diff), 2) * 2; // subtle curve

    // Each card is w-32 (128px). We want them to overlap.
    // 80px between centers gives a nice overlap.
    const xBase = diff * 80;

    let selectOffset = isSelected ? -40 : 0;
    let xOffset = xBase;
    let opacity = 1;
    let currentRotation = rotation;

    // Stable random values based on card ID for more natural movement
    const hash = cardId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const randomDelay = (hash % 10) * 0.015; // 0 to 0.135s delay
    const randomDuration = 0.15 + (hash % 15) * 0.01; // 0.15 to 0.29s duration

    // Slight variation in timing function
    const easeVariation = (hash % 5) * 0.02;
    const timingFunction = `cubic-bezier(${0.4 + easeVariation}, 0, ${0.2 + easeVariation}, 1)`;

    if (enteringCards.has(cardId)) {
      xOffset = -1500; // Come from the left
      opacity = 0;
    } else if (isSelected && (animationPhase === "playing" || animationPhase === "exiting")) {
      selectOffset = -250; // Move above the hand
      currentRotation = 0; // Straighten up

      // Keep played cards side by side
      const selectedIds = Array.from(selectedCards);
      const selectedIndex = selectedIds.indexOf(cardId);
      const selectedCenterIndex = (selectedIds.length - 1) / 2;
      const selectedDiff = selectedIndex - selectedCenterIndex;
      xOffset = selectedDiff * 80;

      if (animationPhase === "exiting") {
        xOffset += 1500; // Move to the right
        opacity = 0;
      }
    }

    return {
      transform: `translateX(calc(-50% + ${xOffset}px)) translateY(${yOffset + selectOffset}px) rotate(${currentRotation}deg)`,
      zIndex: 10 + index,
      opacity,
      willChange: "transform",
      transitionDelay: `${randomDelay}s`,
      transitionDuration: `${randomDuration}s`,
      transitionTimingFunction: timingFunction,
    };
  };

  return (
    <main className="min-h-screen p-8 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100">
            Mini Balatro
          </h1>
          <div className="px-4 py-2 bg-yellow-900/40 rounded-full border-2 border-yellow-800 flex items-center gap-2">
            <span className="text-yellow-400 font-bold text-xl">$</span>
            <span className="text-yellow-100 font-bold text-xl">
              {player?.money ?? 0}
            </span>
          </div>
        </div>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {[...Array(5)].map((_, i) => {
            const joker = player?.jokers[i];
            return (
              <div
                key={i}
                className={`flex-shrink-0 w-24 h-36 rounded-xl border-2 flex flex-col items-center justify-center p-2 text-center transition-all ${
                  joker
                    ? "bg-white border-purple-400 shadow-md rotate-2"
                    : "bg-gray-800/50 border-dashed border-gray-700"
                }`}
              >
                {joker ? (
                  <>
                    <div className="text-2xl mb-1">🃏</div>
                    <div className="text-xs font-bold text-purple-700 leading-tight">
                      {joker.name()}
                    </div>
                  </>
                ) : (
                  <div className="text-gray-600 text-xs font-medium">
                    Empty Slot
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mb-6 p-4 bg-blue-900/30 rounded-lg border-2 border-blue-800">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-blue-300 font-medium">Current Score</div>
              <div className="text-3xl font-bold text-blue-100">{currentScore}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-blue-300 font-medium">Target Score</div>
              <div className="text-3xl font-bold text-blue-100">{targetScore}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-300 font-medium">Figures Played</div>
              <div className="text-3xl font-bold text-blue-100">{figuresPlayed} / {MAX_FIGURES}</div>
            </div>
          </div>
          {isWon && (
            <div className="mt-6 text-center">
              <div className="text-lg font-bold text-green-300 mb-2">
                🎉 You Won Round {roundNumber}! 🎉
              </div>
              <div className="text-md font-medium text-green-400 mb-4">
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
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-200">
                Your Hand ({cards.length} cards)
              </h2>
            </div>
            <p className="text-sm text-gray-400">
              Deck: {deckRemaining} cards remaining
            </p>
          </div>
          {!isWon && !isLost && (
            <div className="space-y-1">
              <p className="text-sm text-gray-400">
                Select up to 5 cards ({selectedCards.size} / 5 selected)
              </p>
              <p className="text-sm text-gray-400">
                Discards remaining: {MAX_DISCARDS - discardCount} / {MAX_DISCARDS}
              </p>
            </div>
          )}
        </div>

        <div className="relative flex justify-center items-end min-h-[250px] py-12 px-4 overflow-visible">
          {domCards.map((card) => {
            const sortedIndex = cards.findIndex((c) => c.id === card.id);
            if (sortedIndex === -1) return null;

            const isSelected = selectedCards.has(card.id);
            const isDisabled = !submitted && !isWon && !isLost && !isSelected && selectedCards.size >= 5;
            const transform = getCardTransform(sortedIndex, cards.length, isSelected, card.id);

            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                style={transform}
                className={`absolute left-1/2 flex-shrink-0 w-32 h-48 bg-white rounded-xl shadow-xl border-2 transition-all ${
                  submitted || isWon || isLost
                    ? "cursor-default"
                    : isDisabled
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                } ${
                  isDisabled
                    ? "border-gray-200"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-2xl"
                }`}
              >
                <div className="h-full flex flex-col justify-between p-2 pointer-events-none relative overflow-hidden">
                  {/* Top-left corner */}
                  <div className={`flex flex-col leading-none ${getColourClass(card.colour)}`}>
                    <span className="text-lg font-bold">{getShortNumber(card.number)}</span>
                    <span className="text-sm">{getColourSymbol(card.colour)}</span>
                  </div>

                  {/* Center large symbol */}
                  <div className={`text-5xl self-center opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${getColourClass(card.colour)}`}>
                    {getColourSymbol(card.colour)}
                  </div>
                  <div className={`text-4xl self-center z-10 ${getColourClass(card.colour)}`}>
                    {getColourSymbol(card.colour)}
                  </div>

                  {/* Bottom-right corner (rotated) */}
                  <div className={`flex flex-col leading-none rotate-180 ${getColourClass(card.colour)}`}>
                    <span className="text-lg font-bold">{getShortNumber(card.number)}</span>
                    <span className="text-sm">{getColourSymbol(card.colour)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          {!submitted && currentFigureName && !isWon && !isLost && (
            <div className="mb-2 px-4 py-2 bg-blue-900/40 rounded-full text-blue-200 font-bold text-lg shadow-sm border border-blue-700">
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
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-orange-600 hover:bg-orange-700 text-white shadow-md hover:shadow-lg transform hover:scale-105"
                }`}
              >
                Discard {selectedCards.size > 0 ? `(${selectedCards.size})` : ""}
              </button>

              <button
                onClick={handleSortToggle}
                className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-gray-800 text-gray-300 rounded-md border border-gray-700 hover:bg-gray-700 transition-colors flex items-center gap-1"
              >
                <span>Sort by:</span>
                <span className="text-blue-400">
                  {round?.hand.sortMethod === "rank" ? "Rank" : "Colour"}
                </span>
              </button>

              <button
                onClick={handleSubmit}
                disabled={selectedCards.size === 0 || !canPlayFigure}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedCards.size === 0 || !canPlayFigure
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105"
                }`}
              >
                Play Hand
              </button>
            </div>
          )}

          {submitted && figureName !== null && score !== null && (
            <div className="mt-4 p-4 bg-green-900/30 rounded-lg border-2 border-green-800">
              <div className="text-lg font-semibold text-green-200">
                Figure: {figureName}
              </div>
              <div className="text-2xl font-bold text-green-300 mt-2">
                Score: +{score} (Total: {currentScore})
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

