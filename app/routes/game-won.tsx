import { useOutletContext } from "react-router";
import type { GameContext } from "./game-layout";

export default function GameWon() {
  const { player, resetGame } = useOutletContext<GameContext>();

  return (
    <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[80vh]">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12 border-4 border-green-100 dark:border-green-900/30 text-center max-w-2xl w-full">
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-5xl font-black text-gray-900 dark:text-gray-100 mb-2 tracking-tighter">
              YOU WON!
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">
              Congratulations! You completed all rounds.
            </p>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl mb-10">
            <div className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Total Money Earned</div>
            <div className="text-3xl font-black text-yellow-600 dark:text-yellow-400">${player?.money ?? 0}</div>
          </div>

          <button
            onClick={resetGame}
            className="w-full py-5 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black text-2xl shadow-xl transform transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            PLAY AGAIN
          </button>
        </div>
      </div>
    </main>
  );
}

