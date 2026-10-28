import React from 'react';
import { ShoppingBag, Heart, Sparkles, UtensilsCrossed } from 'lucide-react';
import { useRecipes } from '../context/RecipeContext';
import { Category } from '../types/recipe';

interface HeaderProps {
  activeCategory: Category;
  onSelectCategory: (category: Category) => void;
  onlyFavorites: boolean;
  onToggleFavorites: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  onlyFavorites,
  onToggleFavorites,
}) => {
  const { shoppingList, setIsShoppingListOpen, favorites } = useRecipes();

  const uncompletedShoppingItems = shoppingList.filter((item) => !item.completed).length;

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              onSelectCategory('All');
              onToggleFavorites(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            aria-label="Tasty Recipes Home"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-sm group-hover:bg-amber-700 transition-colors">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 group-hover:text-amber-700 transition-colors block leading-none">
                Tasty Recipes
              </span>
              <span className="text-[11px] font-medium uppercase tracking-wider text-stone-500 block mt-1">
                Artisanal Home Cooking
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-600">
          {(['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Vegetarian'] as Category[]).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                onToggleFavorites(false);
                onSelectCategory(cat);
              }}
              className={`transition-colors whitespace-nowrap cursor-pointer hover:text-stone-950 ${
                activeCategory === cat && !onlyFavorites
                  ? 'text-amber-700 font-semibold border-b-2 border-amber-600 pb-0.5'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {cat === 'All' ? 'All Recipes' : cat}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1 Primary Action (Shopping List & Favorites) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Favorites quick toggle */}
          <button
            onClick={() => onToggleFavorites(!onlyFavorites)}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              onlyFavorites
                ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-xs'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50 hover:border-stone-300'
            }`}
            title="View saved favorite recipes"
            aria-label="View favorites"
          >
            <Heart className={`w-4 h-4 ${onlyFavorites ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`} />
            <span className="hidden sm:inline">Favorites</span>
            {favorites.length > 0 && (
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full tabular-nums font-bold ${
                  onlyFavorites ? 'bg-rose-200 text-rose-800' : 'bg-stone-100 text-stone-600'
                }`}
              >
                {favorites.length}
              </span>
            )}
          </button>

          {/* Primary Action: Shopping List Drawer Trigger */}
          <button
            onClick={() => setIsShoppingListOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 active:bg-stone-950 rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap shrink-0"
            aria-label="Open Grocery Shopping List"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>Shopping List</span>
            {uncompletedShoppingItems > 0 && (
              <span className="bg-amber-500 text-stone-950 text-[11px] font-bold px-1.5 py-0.2 rounded-full tabular-nums ml-0.5">
                {uncompletedShoppingItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
