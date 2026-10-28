import React, { useState, useEffect } from 'react';
import { Recipe, Ingredient, ShoppingListItem } from '../types/recipe';
import {
  X,
  Heart,
  Clock,
  Users,
  Flame,
  Star,
  Printer,
  Share2,
  Check,
  Plus,
  Minus,
  ShoppingBag,
  Timer,
  Lightbulb,
  CheckCircle2,
  Utensils,
  ChevronRight,
} from 'lucide-react';
import { useRecipes } from '../context/RecipeContext';
import { formatDuration, formatQuantity, scaleQuantity } from '../utils/formatters';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose }) => {
  const { isFavorite, toggleFavorite, addIngredientsToShoppingList, startTimer, showToast } = useRecipes();

  // Servings scaler state
  const [currentServings, setCurrentServings] = useState<number>(recipe?.servings || 4);

  // Checked ingredients (kitchen prep checklist)
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  // Completed instruction steps
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  // Image load error fallback
  const [imageError, setImageError] = useState(false);

  // Active view tab on mobile ('ingredients' | 'instructions')
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');

  // Reset states when recipe changes
  useEffect(() => {
    if (recipe) {
      setCurrentServings(recipe.servings);
      setCheckedIngredients({});
      setCompletedSteps({});
      setImageError(false);
      setActiveTab('ingredients');
    }
  }, [recipe]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!recipe) return null;

  const favorited = isFavorite(recipe.id);
  const totalTime = recipe.prepTime + recipe.cookTime;

  // Servings adjustment handler
  const handleServingsChange = (delta: number) => {
    setCurrentServings((prev) => Math.max(1, Math.min(24, prev + delta)));
  };

  // Toggle ingredient checkbox
  const toggleIngredientCheck = (id: string) => {
    setCheckedIngredients((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Toggle instruction step checkbox
  const toggleStepComplete = (step: number) => {
    setCompletedSteps((prev) => ({ ...prev, [step]: !prev[step] }));
  };

  // Add all ingredients to shopping list with currently scaled quantities
  const handleAddAllToShoppingList = () => {
    const itemsToAdd: ShoppingListItem[] = recipe.ingredients.map((ing) => {
      const scaledAmount = scaleQuantity(ing.quantity, recipe.servings, currentServings);
      return {
        id: `shop-${recipe.id}-${ing.id}-${Date.now()}-${Math.random()}`,
        recipeId: recipe.id,
        recipeTitle: recipe.title,
        name: ing.name,
        quantity: scaledAmount,
        unit: ing.unit,
        category: ing.category,
        completed: false,
        notes: ing.notes,
      };
    });

    addIngredientsToShoppingList(itemsToAdd);
  };

  // Share recipe link
  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Recipe link copied to clipboard! 📋');
      }
    } catch {
      showToast('Recipe link ready to share!');
    }
  };

  // Print recipe
  const handlePrint = () => {
    window.print();
  };

  // Group ingredients by category
  const ingredientsByCategory = recipe.ingredients.reduce<Record<string, Ingredient[]>>((acc, ing) => {
    if (!acc[ing.category]) acc[ing.category] = [];
    acc[ing.category].push(ing);
    return acc;
  }, {});

  const totalSteps = recipe.instructions.length;
  const completedStepCount = Object.values(completedSteps).filter(Boolean).length;
  const cookingProgress = Math.round((completedStepCount / totalSteps) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      {/* Modal Dialog Card */}
      <div
        className="recipe-modal-container bg-[#FAF8F5] w-full max-w-4xl rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border border-stone-200/80 my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-modal-title"
      >
        {/* Top Sticky Action Bar & Header */}
        <div className="no-print bg-white/90 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-stone-200 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium truncate">
            <span className="font-semibold text-amber-700">{recipe.category}</span>
            <span aria-hidden="true">·</span>
            <span>{recipe.cuisine}</span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">{recipe.difficulty}</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Favorite button */}
            <button
              onClick={() => toggleFavorite(recipe.id)}
              className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                favorited
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
              title={favorited ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500 text-rose-500' : 'text-stone-500'}`} />
              <span className="hidden sm:inline">{favorited ? 'Saved' : 'Favorite'}</span>
            </button>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="p-2 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer text-xs flex items-center gap-1.5"
              title="Copy recipe link"
            >
              <Share2 className="w-4 h-4 text-stone-600" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* Print button */}
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer text-xs flex items-center gap-1.5"
              title="Print clean recipe card"
            >
              <Printer className="w-4 h-4 text-stone-600" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
              aria-label="Close recipe details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1">
          {/* Hero Banner Section */}
          <div className="relative h-64 sm:h-80 md:h-96 w-full bg-stone-900 overflow-hidden">
            {!imageError ? (
              <img
                src={recipe.image}
                alt={recipe.title}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`w-full h-full flex flex-col items-center justify-center p-8 text-white bg-gradient-to-br ${recipe.fallbackBg}`}>
                <Utensils className="w-14 h-14 mb-3 opacity-70" />
                <span className="font-serif text-2xl font-bold">{recipe.title}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent" />

            {/* Hero Title Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-5 sm:p-8 text-white">
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-amber-300">
                <span>{recipe.cuisine}</span>
                <span>·</span>
                <span>{recipe.category}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {recipe.rating.toFixed(1)} ({recipe.reviewCount} reviews)
                </span>
              </div>

              <h2
                id="recipe-modal-title"
                className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight"
              >
                {recipe.title}
              </h2>

              <p className="mt-2 text-sm sm:text-base text-stone-200/90 max-w-2xl font-normal leading-relaxed line-clamp-2">
                {recipe.subtitle}
              </p>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="bg-white border-b border-stone-200 px-4 sm:px-8 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center justify-between text-stone-700">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[11px] font-medium text-stone-400 block uppercase tracking-wider">Total Time</span>
                  <span className="text-sm font-bold text-stone-900 tabular-nums">
                    {formatDuration(totalTime)}
                  </span>
                  <span className="text-[11px] text-stone-400 block tabular-nums">
                    ({recipe.prepTime}m prep · {recipe.cookTime}m cook)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-700 flex items-center justify-center shrink-0">
                  <Flame className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[11px] font-medium text-stone-400 block uppercase tracking-wider">Nutrition</span>
                  <span className="text-sm font-bold text-stone-900 tabular-nums">
                    {recipe.nutrition.calories} kcal
                  </span>
                  <span className="text-[11px] text-stone-400 block tabular-nums">
                    {recipe.nutrition.protein}g protein · {recipe.nutrition.carbs}g carbs
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Utensils className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[11px] font-medium text-stone-400 block uppercase tracking-wider">Difficulty</span>
                  <span className="text-sm font-bold text-stone-900">{recipe.difficulty}</span>
                  <span className="text-[11px] text-stone-400 block">Chef Verified</span>
                </div>
              </div>

              {/* Interactive Servings Scaler */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-stone-100 text-stone-800 flex items-center justify-center shrink-0">
                  <Users className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[11px] font-medium text-stone-400 block uppercase tracking-wider">Servings Scaler</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <button
                      onClick={() => handleServingsChange(-1)}
                      disabled={currentServings <= 1}
                      className="w-6 h-6 rounded-md bg-stone-100 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-stone-800 transition-colors cursor-pointer"
                      title="Decrease servings"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-stone-900 tabular-nums text-sm min-w-5 text-center">
                      {currentServings}
                    </span>
                    <button
                      onClick={() => handleServingsChange(1)}
                      disabled={currentServings >= 24}
                      className="w-6 h-6 rounded-md bg-stone-100 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-stone-800 transition-colors cursor-pointer"
                      title="Increase servings"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Tab Switcher */}
          <div className="md:hidden no-print px-4 pt-4">
            <div className="flex items-center p-1 bg-stone-200/70 rounded-xl">
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'ingredients'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Ingredients ({recipe.ingredients.length})
              </button>
              <button
                onClick={() => setActiveTab('instructions')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'instructions'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Instructions ({recipe.instructions.length} Steps)
              </button>
            </div>
          </div>

          {/* Main 2-Column Content Layout (Desktop) / Tabbed (Mobile) */}
          <div className="p-4 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Column 1: Ingredients & Shopping List (5 cols) */}
            <div
              className={`md:col-span-5 space-y-6 ${
                activeTab === 'ingredients' ? 'block' : 'hidden md:block'
              }`}
            >
              <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-stone-900">
                      Ingredients
                    </h3>
                    <span className="text-xs text-stone-500">
                      Adjusted for <strong className="text-stone-900">{currentServings} servings</strong>
                    </span>
                  </div>

                  {/* Add All to Shopping List Button */}
                  <button
                    onClick={handleAddAllToShoppingList}
                    className="no-print flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to List</span>
                  </button>
                </div>

                {/* Categorized Ingredients Checklist */}
                <div className="mt-4 space-y-5">
                  {Object.entries(ingredientsByCategory).map(([categoryName, items]) => (
                    <div key={categoryName}>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
                        {categoryName}
                      </span>
                      <ul className="space-y-2">
                        {items.map((ing) => {
                          const isChecked = checkedIngredients[ing.id];
                          const scaledAmount = scaleQuantity(ing.quantity, recipe.servings, currentServings);
                          const formattedQty = formatQuantity(scaledAmount);

                          return (
                            <li
                              key={ing.id}
                              onClick={() => toggleIngredientCheck(ing.id)}
                              className={`flex items-start gap-3 p-2 rounded-lg transition-colors cursor-pointer select-none ${
                                isChecked
                                  ? 'bg-stone-50 text-stone-400 line-through'
                                  : 'hover:bg-amber-50/50 text-stone-800'
                              }`}
                            >
                              <div
                                className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                  isChecked
                                    ? 'bg-amber-600 border-amber-600 text-white'
                                    : 'border-stone-300 bg-white'
                                }`}
                              >
                                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>

                              <div className="text-xs sm:text-sm leading-snug flex-1">
                                <span className="font-semibold tabular-nums text-stone-900 mr-1.5">
                                  {formattedQty} {ing.unit}
                                </span>
                                <span>{ing.name}</span>
                                {ing.notes && (
                                  <span className="text-stone-400 italic text-xs ml-1 font-normal">
                                    ({ing.notes})
                                  </span>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nutrition Card */}
              <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
                <h4 className="font-serif font-bold text-base text-stone-900 mb-3">
                  Nutrition per Serving
                </h4>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2.5 bg-stone-50 rounded-xl">
                    <span className="block text-xs text-stone-400 font-medium">Calories</span>
                    <span className="font-bold text-stone-900 tabular-nums text-sm">
                      {recipe.nutrition.calories}
                    </span>
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-xl">
                    <span className="block text-xs text-stone-400 font-medium">Protein</span>
                    <span className="font-bold text-stone-900 tabular-nums text-sm">
                      {recipe.nutrition.protein}g
                    </span>
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-xl">
                    <span className="block text-xs text-stone-400 font-medium">Carbs</span>
                    <span className="font-bold text-stone-900 tabular-nums text-sm">
                      {recipe.nutrition.carbs}g
                    </span>
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-xl">
                    <span className="block text-xs text-stone-400 font-medium">Fat</span>
                    <span className="font-bold text-stone-900 tabular-nums text-sm">
                      {recipe.nutrition.fat}g
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Step-by-Step Instructions & Chef Tips (7 cols) */}
            <div
              className={`md:col-span-7 space-y-6 ${
                activeTab === 'instructions' ? 'block' : 'hidden md:block'
              }`}
            >
              {/* Cooking Progress Bar */}
              <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif font-bold text-lg text-stone-900">
                    Step-by-Step Instructions
                  </h3>
                  <span className="text-xs font-semibold text-stone-500 tabular-nums">
                    {completedStepCount} of {totalSteps} steps completed ({cookingProgress}%)
                  </span>
                </div>

                <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${cookingProgress}%` }}
                  />
                </div>

                {/* Instructions List */}
                <div className="mt-6 space-y-6">
                  {recipe.instructions.map((inst) => {
                    const isDone = completedSteps[inst.step];

                    return (
                      <div
                        key={inst.step}
                        className={`p-4 rounded-xl border transition-all ${
                          isDone
                            ? 'bg-stone-50 border-stone-200/80 opacity-70'
                            : 'bg-white border-stone-200/90 shadow-2xs hover:border-amber-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                                isDone
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-stone-900 text-white'
                              }`}
                            >
                              {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : inst.step}
                            </span>
                            <h4
                              className={`font-serif font-bold text-base ${
                                isDone ? 'line-through text-stone-400' : 'text-stone-900'
                              }`}
                            >
                              {inst.title}
                            </h4>
                          </div>

                          {/* Complete Step Toggle */}
                          <button
                            onClick={() => toggleStepComplete(inst.step)}
                            className={`no-print text-xs font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer shrink-0 ${
                              isDone
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                            }`}
                          >
                            {isDone ? 'Done ✓' : 'Mark Done'}
                          </button>
                        </div>

                        <p
                          className={`mt-3 text-sm leading-relaxed ${
                            isDone ? 'text-stone-400' : 'text-stone-700'
                          }`}
                        >
                          {inst.instruction}
                        </p>

                        {/* Interactive Step Timer Button */}
                        {inst.durationMinutes && (
                          <div className="mt-3 pt-3 border-t border-stone-100 no-print flex items-center gap-3">
                            <button
                              onClick={() =>
                                startTimer(`${recipe.title} - Step ${inst.step}`, inst.durationMinutes!)
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 text-xs font-semibold transition-colors cursor-pointer"
                            >
                              <Timer className="w-3.5 h-3.5 text-amber-700" />
                              <span>Start {inst.durationMinutes}m Step Timer</span>
                            </button>
                            <span className="text-xs text-stone-400">
                              Estimated duration: {inst.durationMinutes} minutes
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chef Tips Card */}
              {recipe.chefTips && recipe.chefTips.length > 0 && (
                <div className="bg-amber-50/70 rounded-2xl p-5 border border-amber-200/80">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-2">
                    <Lightbulb className="w-4.5 h-4.5 text-amber-700" />
                    <span>Chef's Pro Tips</span>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-stone-700 leading-relaxed">
                    {recipe.chefTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-700 font-bold shrink-0">✦</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="no-print bg-stone-100/90 border-t border-stone-200 px-4 sm:px-8 py-3 flex items-center justify-between text-xs text-stone-500 shrink-0">
          <span>
            Recipe #{recipe.id} · Press <kbd className="px-1.5 py-0.5 bg-white rounded border border-stone-300 font-mono text-[10px]">Esc</kbd> to close
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-900 text-white font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Done Cooking
          </button>
        </div>
      </div>
    </div>
  );
};
