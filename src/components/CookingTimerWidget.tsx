import React from 'react';
import { useRecipes } from '../context/RecipeContext';
import { Timer, Play, Pause, RotateCcw, X, Bell } from 'lucide-react';

export const CookingTimerWidget: React.FC = () => {
  const { activeTimer, toggleTimer, resetTimer, stopTimer } = useRecipes();

  if (!activeTimer) return null;

  const minutes = Math.floor(activeTimer.remainingSeconds / 60);
  const seconds = activeTimer.remainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isFinished = activeTimer.remainingSeconds === 0;

  return (
    <aside
      aria-label="Active Cooking Timer"
      className="fixed bottom-5 right-5 z-45 no-print"
    >
      <div
        className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md transition-all ${
          isFinished
            ? 'bg-amber-600 text-white border-amber-500 animate-bounce'
            : 'bg-stone-900/95 text-white border-stone-800'
        }`}
      >
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            isFinished ? 'bg-white text-amber-600' : 'bg-amber-500/20 text-amber-400'
          }`}
        >
          {isFinished ? <Bell className="w-5 h-5 animate-pulse" /> : <Timer className="w-5 h-5" />}
        </div>

        <div className="max-w-44 truncate">
          <span className="text-[10px] font-medium uppercase tracking-wider block opacity-75">
            {isFinished ? 'Time is up!' : 'Cooking Timer'}
          </span>
          <span className="text-xs font-semibold block truncate" title={activeTimer.name}>
            {activeTimer.name}
          </span>
        </div>

        <div className="text-xl font-mono font-bold tabular-nums tracking-wider px-2">
          {formattedTime}
        </div>

        <div className="flex items-center gap-1">
          {!isFinished && (
            <button
              onClick={toggleTimer}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
              title={activeTimer.isRunning ? 'Pause' : 'Resume'}
            >
              {activeTimer.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          )}

          <button
            onClick={resetTimer}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
            title="Reset timer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={stopTimer}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors cursor-pointer ml-1"
            title="Dismiss timer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
