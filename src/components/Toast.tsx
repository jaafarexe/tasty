import React from 'react';
import { useRecipes } from '../context/RecipeContext';
import { Sparkles } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useRecipes();

  if (!toastMessage) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-55 pointer-events-none no-print animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <div className="bg-stone-900/95 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg border border-stone-800 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};
