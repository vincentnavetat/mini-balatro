import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { Deck } from "../models/Deck";
import { Round } from "../models/Round";
import { Player } from "../models/Player";
import roundsData from "../data/rounds.json";

interface RoundData {
  roundNumber: number;
  targetScore: number;
  reward: number;
}

export interface GameContext {
  round: Round | null;
  player: Player | null;
  roundNumber: number;
  handUpdateTrigger: number;
  setHandUpdateTrigger: React.Dispatch<React.SetStateAction<number>>;
  goToShop: () => void;
  startNextRound: () => void;
  resetGame: () => void;
  hasNextRound: boolean;
  nextTargetScore: number | null;
  boughtJokerNames: string[];
  setBoughtJokerNames: React.Dispatch<React.SetStateAction<string[]>>;
  shopJokers: (string | null)[];
  setShopJokers: React.Dispatch<React.SetStateAction<(string | null)[]>>;
}

export default function GameLayout() {
  const [mounted, setMounted] = useState(false);
  const [round, setRound] = useState<Round | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [roundNumber, setRoundNumber] = useState(1);
  const [handUpdateTrigger, setHandUpdateTrigger] = useState(0);
  const [boughtJokerNames, setBoughtJokerNames] = useState<string[]>([]);
  const [shopJokers, setShopJokers] = useState<(string | null)[]>([]);

  const navigate = useNavigate();

  const getRoundData = (num: number): RoundData | undefined => {
    return (roundsData as RoundData[]).find(r => r.roundNumber === num);
  };

  useEffect(() => {
    setMounted(true);
    const initialRoundData = getRoundData(1);
    if (!initialRoundData) return;
    const deck = new Deck();
    setRound(new Round(deck, initialRoundData.targetScore, initialRoundData.reward));
    setPlayer(new Player());
  }, []);

  const goToShop = () => {
    navigate("/shop");
  };

  const startNextRound = () => {
    const nextRoundNumber = roundNumber + 1;
    const roundData = getRoundData(nextRoundNumber);

    if (!roundData) {
      navigate("/game-won");
      return;
    }

    setRoundNumber(nextRoundNumber);
    const deck = new Deck();
    setRound(new Round(deck, roundData.targetScore, roundData.reward));
    setHandUpdateTrigger(prev => prev + 1);
    setShopJokers([]);
    navigate("/");
  };

  const resetGame = () => {
    setRoundNumber(1);
    const initialRoundData = getRoundData(1);
    if (!initialRoundData) return;
    const deck = new Deck();
    setRound(new Round(deck, initialRoundData.targetScore, initialRoundData.reward));
    setPlayer(new Player());
    setHandUpdateTrigger(prev => prev + 1);
    setBoughtJokerNames([]);
    setShopJokers([]);
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
    hasNextRound: !!getRoundData(roundNumber + 1),
    nextTargetScore: getRoundData(roundNumber + 1)?.targetScore ?? null,
    boughtJokerNames,
    setBoughtJokerNames,
    shopJokers,
    setShopJokers,
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

