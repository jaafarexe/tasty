import React from 'react';
import { Search, X, Sparkles, ChefHat } from 'lucide-react';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectQuickIngredient: (ingredient: string) => void;
  totalRecipes: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  onSelectQuickIngredient,
  totalRecipes,
}) => {
  const quickIngredients = ['Salmon', 'Avocado', 'Garlic', 'Chocolate', 'Berries', 'Sweet Potato', 'Spinach', 'Mushrooms'];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F5EFEB] to-[#FAF8F5] pt-10 pb-12 border-b border-stone-200/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Subtle kicker */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-800 mb-3">
          <ChefHat className="w-4 h-4 text-amber-700" />
          <span>Curated Culinary Collection · {totalRecipes} Handcrafted Recipes</span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-[1.15] text-balance">
          Cook with confidence, savor every bite.
        </h1>

        <p className="mt-4 text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
          Explore wholesome chef-tested recipes with step-by-step guidance, dynamic ingredient scaling, and interactive shopping lists.
        </p>

        {/* Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="relative flex items-center shadow-md rounded-2xl bg-white border border-stone-300 focus-within:border-amber-600 focus-within:ring-3 focus-within:ring-amber-500/20 transition-all">
            <div className="pl-4 pr-2 text-stone-400">
              <Search className="w-5 h-5 text-stone-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by recipe name or ingredient (e.g., salmon, garlic, avocado)..."
              className="w-full py-4 pr-10 text-stone-900 placeholder-stone-400 text-sm sm:text-base bg-transparent border-none focus:outline-none"
              aria-label="Search recipes or ingredients"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="pr-4 text-stone-400 hover:text-stone-600 cursor-pointer p-1"
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Quick Ingredient Tags */}
          <div className="mt-3 flex items-center justify-center flex-wrap gap-1.5 text-xs text-stone-500">
            <span className="font-medium text-stone-400 mr-1">Popular ingredients:</span>
            {quickIngredients.map((ing) => (
              <button
                key={ing}
                onClick={() => onSelectQuickIngredient(ing)}
                className={`px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                  searchQuery.toLowerCase() === ing.toLowerCase()
                    ? 'bg-amber-100 text-amber-900 font-medium border border-amber-300'
                    : 'bg-white/80 hover:bg-stone-200/70 text-stone-600 border border-stone-200/80'
                }`}
              >
                +{ing}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
