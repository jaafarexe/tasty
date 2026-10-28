import React from 'react';
import { Category, Difficulty } from '../types/recipe';
import { Clock, SlidersHorizontal, RotateCcw, Flame } from 'lucide-react';

interface CategoryFilterBarProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
  selectedDifficulty: 'All' | Difficulty;
  onSelectDifficulty: (difficulty: 'All' | Difficulty) => void;
  quickOnly: boolean;
  onToggleQuickOnly: () => void;
  sortBy: 'featured' | 'rating' | 'quickest' | 'alphabetical';
  onSortChange: (sort: 'featured' | 'rating' | 'quickest' | 'alphabetical') => void;
  resultCount: number;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

const CATEGORIES: Category[] = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Vegetarian'];

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedDifficulty,
  onSelectDifficulty,
  quickOnly,
  onToggleQuickOnly,
  sortBy,
  onSortChange,
  resultCount,
  hasActiveFilters,
  onResetFilters,
}) => {
  return (
    <div className="py-6 space-y-4">
      {/* Primary Category Selector */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-200/60 rounded-xl overflow-x-auto max-w-full scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/40'
                }`}
              >
                {cat === 'All' ? 'All Recipes' : cat}
              </button>
            );
          })}
        </div>

        {/* Secondary controls strip */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Quick < 30m toggle */}
          <button
            onClick={onToggleQuickOnly}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              quickOnly
                ? 'bg-amber-100/80 border-amber-300 text-amber-900 font-semibold'
                : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50'
            }`}
          >
            <Clock className={`w-3.5 h-3.5 ${quickOnly ? 'text-amber-700' : 'text-stone-400'}`} />
            <span>Under 30 Mins</span>
          </button>

          {/* Difficulty Dropdown */}
          <div className="relative inline-flex items-center">
            <select
              value={selectedDifficulty}
              onChange={(e) => onSelectDifficulty(e.target.value as 'All' | Difficulty)}
              className="text-xs font-medium bg-white border border-stone-200 text-stone-700 py-1.5 pl-3 pr-7 rounded-lg cursor-pointer focus:outline-none focus:border-amber-600"
              aria-label="Filter by difficulty"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Advanced / Hard</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative inline-flex items-center">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as 'featured' | 'rating' | 'quickest' | 'alphabetical')}
              className="text-xs font-medium bg-white border border-stone-200 text-stone-700 py-1.5 pl-3 pr-7 rounded-lg cursor-pointer focus:outline-none focus:border-amber-600"
              aria-label="Sort recipes"
            >
              <option value="featured">Sort: Featured</option>
              <option value="rating">Sort: Top Rated ★</option>
              <option value="quickest">Sort: Quickest Time</option>
              <option value="alphabetical">Sort: A to Z</option>
            </select>
          </div>

          {/* Reset button if any filter active */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Count Line */}
      <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
        <span>
          Showing <strong className="text-stone-900 tabular-nums">{resultCount}</strong>{' '}
          {resultCount === 1 ? 'recipe' : 'recipes'}
          {selectedCategory !== 'All' && <span> in {selectedCategory}</span>}
          {quickOnly && <span> · under 30 minutes</span>}
          {selectedDifficulty !== 'All' && <span> · {selectedDifficulty} difficulty</span>}
        </span>
      </div>
    </div>
  );
};
