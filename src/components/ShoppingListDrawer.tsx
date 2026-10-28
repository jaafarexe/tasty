import React, { useState } from 'react';
import { useRecipes } from '../context/RecipeContext';
import {
  X,
  Check,
  Trash2,
  Copy,
  Plus,
  ShoppingBag,
  CheckSquare,
  Sparkles,
} from 'lucide-react';
import { IngredientCategory, ShoppingListItem } from '../types/recipe';
import { formatQuantity } from '../utils/formatters';

const CATEGORIES: IngredientCategory[] = [
  'Produce',
  'Dairy & Refrigerated',
  'Meat & Seafood',
  'Pantry & Grains',
  'Spices, Oils & Condiments',
  'Baking & Sweets',
];

export const ShoppingListDrawer: React.FC = () => {
  const {
    shoppingList,
    isShoppingListOpen,
    setIsShoppingListOpen,
    toggleShoppingItem,
    removeShoppingItem,
    addCustomShoppingItem,
    clearCompletedShoppingItems,
    clearAllShoppingItems,
    showToast,
  } = useRecipes();

  const [customItemName, setCustomItemName] = useState('');
  const [customItemCategory, setCustomItemCategory] = useState<IngredientCategory>('Produce');

  if (!isShoppingListOpen) return null;

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customItemName.trim()) return;
    addCustomShoppingItem(customItemName, customItemCategory);
    setCustomItemName('');
  };

  const handleCopyList = async () => {
    if (shoppingList.length === 0) return;

    let text = '🛒 TASTY RECIPES - GROCERY LIST\n\n';

    // Group items by category
    CATEGORIES.forEach((cat) => {
      const catItems = shoppingList.filter((item) => item.category === cat);
      if (catItems.length > 0) {
        text += `[ ${cat.toUpperCase()} ]\n`;
        catItems.forEach((item) => {
          const checkmark = item.completed ? '[x]' : '[ ]';
          const qtyStr = item.quantity ? `${formatQuantity(item.quantity)} ${item.unit} ` : '';
          text += `${checkmark} ${qtyStr}${item.name}${item.recipeTitle ? ` (for ${item.recipeTitle})` : ''}\n`;
        });
        text += '\n';
      }
    });

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        showToast('Grocery list copied to clipboard! 📋');
      }
    } catch {
      showToast('Could not copy to clipboard');
    }
  };

  const completedCount = shoppingList.filter((i) => i.completed).length;
  const totalCount = shoppingList.length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="bg-[#FAF8F5] w-full max-w-md h-full shadow-2xl flex flex-col border-l border-stone-200 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-stone-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl text-stone-900 leading-none">
                Grocery Shopping List
              </h2>
              <span className="text-xs text-stone-500 block mt-1 tabular-nums">
                {totalCount} items · {completedCount} checked off
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsShoppingListOpen(false)}
            className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
            aria-label="Close shopping list"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Actions Bar */}
        {totalCount > 0 && (
          <div className="px-4 py-2.5 bg-stone-100/80 border-b border-stone-200 flex items-center justify-between text-xs">
            <button
              onClick={handleCopyList}
              className="flex items-center gap-1.5 font-semibold text-stone-700 hover:text-stone-950 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-stone-500" />
              <span>Copy List</span>
            </button>

            <div className="flex items-center gap-3">
              {completedCount > 0 && (
                <button
                  onClick={clearCompletedShoppingItems}
                  className="font-medium text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                >
                  Clear checked ({completedCount})
                </button>
              )}
              <button
                onClick={clearAllShoppingItems}
                className="font-medium text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
              >
                Clear all
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {totalCount === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
                <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-800">Your basket is empty</h3>
              <p className="text-xs text-stone-500 max-w-xs mt-1.5 leading-relaxed">
                Click into any recipe and tap <strong className="text-stone-700">"Add to List"</strong> to automatically generate your organized grocery checklist.
              </p>
            </div>
          ) : (
            CATEGORIES.map((category) => {
              const categoryItems = shoppingList.filter((item) => item.category === category);
              if (categoryItems.length === 0) return null;

              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-stone-400">
                    <span>{category}</span>
                    <span className="tabular-nums">({categoryItems.length})</span>
                  </div>

                  <div className="bg-white rounded-xl border border-stone-200/80 divide-y divide-stone-100 overflow-hidden shadow-xs">
                    {categoryItems.map((item) => {
                      const qtyFormatted = item.quantity ? formatQuantity(item.quantity) : '';

                      return (
                        <div
                          key={item.id}
                          className={`p-3 flex items-start justify-between gap-3 transition-colors ${
                            item.completed ? 'bg-stone-50/70 text-stone-400' : 'hover:bg-amber-50/30 text-stone-800'
                          }`}
                        >
                          <div
                            onClick={() => toggleShoppingItem(item.id)}
                            className="flex items-start gap-2.5 flex-1 cursor-pointer select-none"
                          >
                            <div
                              className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                item.completed
                                  ? 'bg-amber-600 border-amber-600 text-white'
                                  : 'border-stone-300 bg-white'
                              }`}
                            >
                              {item.completed && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>

                            <div className="text-xs sm:text-sm">
                              <span
                                className={`font-semibold tabular-nums mr-1.5 ${
                                  item.completed ? 'line-through text-stone-400' : 'text-stone-900'
                                }`}
                              >
                                {qtyFormatted} {item.unit}
                              </span>
                              <span className={item.completed ? 'line-through text-stone-400' : ''}>
                                {item.name}
                              </span>
                              {item.recipeTitle && (
                                <span className="block text-[11px] text-stone-400 font-normal mt-0.5">
                                  for {item.recipeTitle}
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => removeShoppingItem(item.id)}
                            className="text-stone-300 hover:text-stone-600 p-1 rounded-md transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Add Custom Item Form at Bottom */}
        <div className="p-4 bg-white border-t border-stone-200 shrink-0">
          <form onSubmit={handleAddCustom} className="space-y-2">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Add Extra Grocery Item
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={customItemName}
                onChange={(e) => setCustomItemName(e.target.value)}
                placeholder="e.g. Sourdough bread, Oat milk..."
                className="flex-1 text-xs sm:text-sm px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600 focus:bg-white"
              />
              <button
                type="submit"
                disabled={!customItemName.trim()}
                className="px-3 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
            <select
              value={customItemCategory}
              onChange={(e) => setCustomItemCategory(e.target.value as IngredientCategory)}
              className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-600 focus:outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  Aisle: {c}
                </option>
              ))}
            </select>
          </form>
        </div>
      </div>
    </div>
  );
};
