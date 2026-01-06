import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { Deck } from "../models/Deck";
import { Round } from "../models/Round";
import { Player } from "../models/Player";

export interface GameContext {
  round: Round | null;
  player: Player | null;
  roundNumber: number;
  handUpdateTrigger: number;
  setHandUpdateTrigger: React.Dispatch<React.SetStateAction<number>>;
  goToShop: () => void;
  startNextRound: () => void;
  resetGame: () => void;
}

export default function GameLayout() {
  const [mounted, setMounted] = useState(false);
  const [round, setRound] = useState<Round | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [roundNumber, setRoundNumber] = useState(1);
  const [handUpdateTrigger, setHandUpdateTrigger] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    const deck = new Deck();
    setRound(new Round(deck, 300));
    setPlayer(new Player());
  }, []);

  const goToShop = () => {
    navigate("/shop");
  };

  const startNextRound = () => {
    const nextRoundNumber = roundNumber + 1;
    setRoundNumber(nextRoundNumber);
    const targetScore = nextRoundNumber === 2 ? 450 : 300 + (nextRoundNumber - 1) * 150;

    const deck = new Deck();
    setRound(new Round(deck, targetScore));
    setHandUpdateTrigger(prev => prev + 1);
    navigate("/");
  };

  const resetGame = () => {
    setRoundNumber(1);
    const deck = new Deck();
    setRound(new Round(deck, 300));
    setPlayer(new Player());
    setHandUpdateTrigger(prev => prev + 1);
    navigate("/");
  };

  const contextValue: GameContext = {
    round,
    player,
    roundNumber,
    handUpdateTrigger,
    setHandUpdateTrigger,
    goToShop,
    startNextRound,
    resetGame,
  };

  if (!mounted || !round || !player) {
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

  return <Outlet context={contextValue} />;
}

