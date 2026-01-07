import { useOutletContext } from "react-router";
import type { GameContext } from "./game-layout";
import { Jimbo } from "../models/jokers/Jimbo";

export default function Shop() {
  const { player, roundNumber, startNextRound, nextTargetScore, setHandUpdateTrigger } = useOutletContext<GameContext>();

  const buyJimbo = () => {
    if (!player) return;
    const jimbo = new Jimbo();
    if (player.money >= jimbo.price() && player.jokers.length < 5) {
      player.money -= jimbo.price();
      player.addJoker(jimbo);
      setHandUpdateTrigger(prev => prev + 1);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
            THE SHOP
          </h1>
          <div className="px-6 py-3 bg-yellow-100 dark:bg-yellow-900/40 rounded-full border-2 border-yellow-200 dark:border-yellow-800 flex items-center gap-3 shadow-sm">
            <span className="text-yellow-700 dark:text-yellow-400 font-black text-2xl">$</span>
            <span className="text-yellow-900 dark:text-yellow-100 font-black text-2xl">
              {player?.money ?? 0}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 border-2 border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center min-h-[400px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 w-full max-w-2xl">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border-2 border-purple-100 dark:border-purple-900 shadow-lg flex flex-col items-center">
              <div className="text-6xl mb-4">🃏</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Jimbo</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
                +4 Multiplier to every figure played
              </p>
              <button
                onClick={buyJimbo}
                disabled={!player || player.money < 2 || player.jokers.length >= 5}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  !player || player.money < 2 || player.jokers.length >= 5
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transform hover:scale-105"
                }`}
              >
                Buy for $2
              </button>
            </div>
            
            <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
              <span className="text-4xl mb-2">🎁</span>
              <span className="font-medium">More coming soon</span>
            </div>
          </div>
          
          <button
            onClick={startNextRound}
            className="group relative px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xl shadow-2xl transform transition-all hover:scale-105 active:scale-95 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              PLAY NEXT ROUND
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/20 to-blue-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
            <div className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Current Round</div>
            <div className="text-2xl font-black text-gray-700 dark:text-gray-200">{roundNumber}</div>
          </div>
          <div className="p-6 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
            <div className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Next Target</div>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{nextTargetScore ?? "N/A"}</div>
          </div>
          <div className="p-6 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
            <div className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Joker Slots</div>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{player?.jokers.length ?? 0} / 5</div>
          </div>
        </div>
      </div>
    </main>
  );
}

