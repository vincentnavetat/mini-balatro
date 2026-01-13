import { useOutletContext } from "react-router";
import type { GameContext } from "./game-layout";

export default function GameOver() {
  const { player, roundNumber, resetGame } = useOutletContext<GameContext>();

  return (
    <main className="min-h-screen p-8 bg-gray-900">
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[80vh]">
        <div className="bg-white rounded-3xl shadow-2xl p-12 border-4 border-red-100 text-center max-w-2xl w-full">
          <div className="mb-8">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-5xl font-black text-gray-900 mb-2 tracking-tighter">
              GAME OVER
            </h1>
            <p className="text-xl text-gray-500 font-medium">
              You didn't reach the target score in time.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="p-6 bg-gray-50 rounded-2xl">
              <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Final Round</div>
              <div className="text-3xl font-black text-gray-700">{roundNumber}</div>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl">
              <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Money</div>
              <div className="text-3xl font-black text-yellow-600">${player?.money ?? 0}</div>
            </div>
          </div>

          <button
            onClick={resetGame}
            className="w-full py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-2xl shadow-xl transform transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            TRY AGAIN
          </button>
        </div>
      </div>
    </main>
  );
}

