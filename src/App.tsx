/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { RECIPES } from './data/recipes';
import { Category, Difficulty, Recipe } from './types/recipe';
import { RecipeProvider, useRecipes } from './context/RecipeContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CategoryFilterBar } from './components/CategoryFilterBar';
import { RecipeCard } from './components/RecipeCard';
import { RecipeModal } from './components/RecipeModal';
import { ShoppingListDrawer } from './components/ShoppingListDrawer';
import { CookingTimerWidget } from './components/CookingTimerWidget';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';
import { SearchX, Heart, Sparkles, Utensils } from 'lucide-react';

function RecipeApp() {
  const { isFavorite } = useRecipes();

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | Difficulty>('All');
  const [quickOnly, setQuickOnly] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'quickest' | 'alphabetical'>('featured');

  // Modal active recipe
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);

  // Check if any non-default filter is applied
  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    selectedCategory !== 'All' ||
    selectedDifficulty !== 'All' ||
    quickOnly ||
    onlyFavorites;

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setQuickOnly(false);
    setOnlyFavorites(false);
    setSortBy('featured');
  };

  // Filter and sort recipes
  const filteredRecipes = useMemo(() => {
    let list = [...RECIPES];

    // Filter by favorites
    if (onlyFavorites) {
      list = list.filter((r) => isFavorite(r.id));
    }

    // Filter by Category
    if (selectedCategory !== 'All') {
      if (selectedCategory === 'Vegetarian') {
        list = list.filter(
          (r) => r.category === 'Vegetarian' || r.tags.some((t) => t.toLowerCase() === 'vegetarian')
        );
      } else {
        list = list.filter((r) => r.category === selectedCategory);
      }
    }

    // Filter by Difficulty
    if (selectedDifficulty !== 'All') {
      list = list.filter((r) => r.difficulty === selectedDifficulty);
    }

    // Filter by Quick (< 30 min)
    if (quickOnly) {
      list = list.filter((r) => r.prepTime + r.cookTime <= 30);
    }

    // Search query matches title, description, cuisine, tags, or any ingredient!
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((r) => {
        const matchesTitle = r.title.toLowerCase().includes(q);
        const matchesSubtitle = r.subtitle.toLowerCase().includes(q);
        const matchesDescription = r.description.toLowerCase().includes(q);
        const matchesCuisine = r.cuisine.toLowerCase().includes(q);
        const matchesTags = r.tags.some((t) => t.toLowerCase().includes(q));
        const matchesIngredient = r.ingredients.some((ing) => ing.name.toLowerCase().includes(q));

        return (
          matchesTitle ||
          matchesSubtitle ||
          matchesDescription ||
          matchesCuisine ||
          matchesTags ||
          matchesIngredient
        );
      });
    }

    // Sorting
    if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    } else if (sortBy === 'quickest') {
      list.sort((a, b) => a.prepTime + a.cookTime - (b.prepTime + b.cookTime));
    } else if (sortBy === 'alphabetical') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [
    searchQuery,
    selectedCategory,
    selectedDifficulty,
    quickOnly,
    onlyFavorites,
    sortBy,
    isFavorite,
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-amber-100 selection:text-amber-900">
      {/* Top Navigation */}
      <Header
        activeCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setOnlyFavorites(false);
        }}
        onlyFavorites={onlyFavorites}
        onToggleFavorites={(val) => setOnlyFavorites(val)}
      />

      {/* Hero with live Search & Ingredient tags */}
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectQuickIngredient={(ing) => {
          setSearchQuery(ing);
          setOnlyFavorites(false);
        }}
        totalRecipes={RECIPES.length}
      />

      {/* Main Recipe Gallery & Filters */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Category & Filter Strip */}
        <CategoryFilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setOnlyFavorites(false);
          }}
          selectedDifficulty={selectedDifficulty}
          onSelectDifficulty={setSelectedDifficulty}
          quickOnly={quickOnly}
          onToggleQuickOnly={() => setQuickOnly(!quickOnly)}
          sortBy={sortBy}
          onSortChange={setSortBy}
          resultCount={filteredRecipes.length}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={handleResetFilters}
        />

        {/* Recipes Grid */}
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7 pt-2">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onSelect={(selected) => setActiveRecipe(selected)}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="my-16 py-16 px-6 max-w-md mx-auto text-center bg-white rounded-3xl border border-stone-200/80 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
              {onlyFavorites ? (
                <Heart className="w-8 h-8 stroke-[1.5]" />
              ) : (
                <SearchX className="w-8 h-8 stroke-[1.5]" />
              )}
            </div>

            <h3 className="font-serif font-bold text-xl text-stone-900">
              {onlyFavorites ? 'No saved favorites yet' : 'No recipes matched your search'}
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-stone-500 leading-relaxed">
              {onlyFavorites
                ? 'Click the heart icon on any recipe to save it here for quick access while cooking.'
                : `We couldn't find any recipes matching "${searchQuery}". Try searching for another ingredient like garlic, salmon, or avocado.`}
            </p>

            <button
              onClick={handleResetFilters}
              className="mt-6 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Browse All Recipes
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer onSelectCategory={(cat) => setSelectedCategory(cat)} />

      {/* Modals & Overlays */}
      <RecipeModal recipe={activeRecipe} onClose={() => setActiveRecipe(null)} />
      <ShoppingListDrawer />
      <CookingTimerWidget />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <RecipeProvider>
      <RecipeApp />
    </RecipeProvider>
  );
}
