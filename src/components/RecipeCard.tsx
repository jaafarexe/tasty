import React, { useState } from 'react';
import { Recipe } from '../types/recipe';
import { Heart, Clock, Users, Flame, Star, Utensils } from 'lucide-react';
import { useRecipes } from '../context/RecipeContext';
import { formatDuration } from '../utils/formatters';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelect }) => {
  const { isFavorite, toggleFavorite } = useRecipes();
  const [imageError, setImageError] = useState(false);
  const favorited = isFavorite(recipe.id);

  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <article
      onClick={() => onSelect(recipe)}
      className="group flex flex-col bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
    >
      {/* Visual Anchor: Recipe Image with Resilient Fallback */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        {!imageError ? (
          <img
            src={recipe.image}
            alt={recipe.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className={`w-full h-full flex flex-col items-center justify-center p-6 text-white bg-gradient-to-br ${recipe.fallbackBg}`}>
            <Utensils className="w-10 h-10 mb-2 opacity-80" />
            <span className="font-serif font-bold text-center text-lg">{recipe.title}</span>
            <span className="text-xs opacity-75 mt-1">{recipe.cuisine} Cuisine</span>
          </div>
        )}

        {/* Subtle scrim overlay on bottom of image for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(recipe.id);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
            favorited
              ? 'bg-white text-rose-500 shadow-md scale-105'
              : 'bg-black/35 text-white hover:bg-white hover:text-stone-900'
          }`}
          aria-label={favorited ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart className={`w-4.5 h-4.5 ${favorited ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Category tag on image (subtle unboxed text) */}
        <div className="absolute bottom-3 left-3 text-white text-xs font-semibold drop-shadow-sm flex items-center gap-1.5">
          <span className="bg-stone-900/70 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider">
            {recipe.category}
          </span>
          <span className="text-white/80 text-[11px] font-medium">· {recipe.cuisine}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Discipline: Clean unboxed text with typographic separators */}
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium mb-2 tabular-nums">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>{formatDuration(totalTime)}</span>
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{recipe.difficulty}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-stone-400" />
              <span>{recipe.servings} servings</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-amber-800 transition-colors leading-snug line-clamp-1">
            {recipe.title}
          </h3>

          {/* Short description */}
          <p className="mt-1.5 text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>
        </div>

        {/* Card Footer: Rating, Calories, and Ingredients count */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-stone-800 font-semibold tabular-nums">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>{recipe.rating.toFixed(1)}</span>
            <span className="text-stone-400 font-normal">({recipe.reviewCount})</span>
          </div>

          <div className="flex items-center gap-3 text-stone-500 text-[11px] tabular-nums">
            <span className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-600" />
              <span>{recipe.nutrition.calories} kcal</span>
            </span>
            <span className="text-amber-700 font-semibold group-hover:underline">View Recipe →</span>
          </div>
        </div>
      </div>
    </article>
  );
};
