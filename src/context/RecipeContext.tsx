import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Recipe, ShoppingListItem, IngredientCategory } from '../types/recipe';

interface ActiveTimer {
  name: string;
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
}

interface RecipeContextType {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  shoppingList: ShoppingListItem[];
  addIngredientsToShoppingList: (items: ShoppingListItem[]) => void;
  toggleShoppingItem: (id: string) => void;
  removeShoppingItem: (id: string) => void;
  addCustomShoppingItem: (name: string, category: IngredientCategory) => void;
  clearCompletedShoppingItems: () => void;
  clearAllShoppingItems: () => void;

  selectedRecipe: Recipe | null;
  setSelectedRecipe: (recipe: Recipe | null) => void;

  isShoppingListOpen: boolean;
  setIsShoppingListOpen: (open: boolean) => void;

  activeTimer: ActiveTimer | null;
  startTimer: (name: string, minutes: number) => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  stopTimer: () => void;

  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = 'tasty_recipes_favorites_v1';
const SHOPPING_LIST_STORAGE_KEY = 'tasty_recipes_shopping_list_v1';

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : ['creamy-tuscan-salmon', 'brioche-french-toast'];
    } catch {
      return ['creamy-tuscan-salmon', 'brioche-french-toast'];
    }
  });

  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>(() => {
    try {
      const saved = localStorage.getItem(SHOPPING_LIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync favorites
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e);
    }
  }, [favorites]);

  // Sync shopping list
  useEffect(() => {
    try {
      localStorage.setItem(SHOPPING_LIST_STORAGE_KEY, JSON.stringify(shoppingList));
    } catch (e) {
      console.error('Failed to save shopping list to localStorage', e);
    }
  }, [shoppingList]);

  // Toast notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Timer interval countdown
  useEffect(() => {
    if (!activeTimer || !activeTimer.isRunning) return;

    if (activeTimer.remainingSeconds <= 0) {
      // Audio ding sound using web audio synth
      try {
        const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.2);
      } catch (e) {
        console.error('Audio cue failed', e);
      }

      showToast(`⏰ Timer finished: ${activeTimer.name}!`);
      setActiveTimer((prev) => (prev ? { ...prev, isRunning: false, remainingSeconds: 0 } : null));
      return;
    }

    const timerId = setInterval(() => {
      setActiveTimer((prev) => {
        if (!prev || !prev.isRunning) return prev;
        const nextSec = prev.remainingSeconds - 1;
        return {
          ...prev,
          remainingSeconds: nextSec >= 0 ? nextSec : 0,
        };
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [activeTimer]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Removed from favorites');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Saved to favorites! ❤️');
        return [...prev, id];
      }
    });
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const addIngredientsToShoppingList = (newItems: ShoppingListItem[]) => {
    setShoppingList((prev) => {
      // Merge items by name & unit if matching, otherwise append
      const updated = [...prev];
      let addedCount = 0;

      newItems.forEach((newItem) => {
        const existingIndex = updated.findIndex(
          (item) => item.name.toLowerCase() === newItem.name.toLowerCase() && item.unit === newItem.unit && !item.completed
        );

        if (existingIndex > -1 && updated[existingIndex].quantity !== null && newItem.quantity !== null) {
          updated[existingIndex].quantity = (updated[existingIndex].quantity || 0) + newItem.quantity;
        } else {
          updated.push(newItem);
        }
        addedCount++;
      });

      showToast(`Added ${addedCount} item${addedCount > 1 ? 's' : ''} to your shopping list! 🛒`);
      return updated;
    });
  };

  const toggleShoppingItem = (id: string) => {
    setShoppingList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const removeShoppingItem = (id: string) => {
    setShoppingList((prev) => prev.filter((item) => item.id !== id));
  };

  const addCustomShoppingItem = (name: string, category: IngredientCategory) => {
    if (!name.trim()) return;
    const newItem: ShoppingListItem = {
      id: 'custom-' + Date.now(),
      name: name.trim(),
      quantity: null,
      unit: '',
      category,
      completed: false,
    };
    setShoppingList((prev) => [newItem, ...prev]);
    showToast(`Added "${name.trim()}" to list`);
  };

  const clearCompletedShoppingItems = () => {
    setShoppingList((prev) => prev.filter((item) => !item.completed));
    showToast('Cleared completed items');
  };

  const clearAllShoppingItems = () => {
    setShoppingList([]);
    showToast('Shopping list emptied');
  };

  const startTimer = (name: string, minutes: number) => {
    const totalSecs = Math.max(1, Math.round(minutes * 60));
    setActiveTimer({
      name,
      totalSeconds: totalSecs,
      remainingSeconds: totalSecs,
      isRunning: true,
    });
    showToast(`Started ${minutes} min timer for ${name}`);
  };

  const toggleTimer = () => {
    setActiveTimer((prev) => (prev ? { ...prev, isRunning: !prev.isRunning } : null));
  };

  const resetTimer = () => {
    setActiveTimer((prev) => (prev ? { ...prev, remainingSeconds: prev.totalSeconds, isRunning: false } : null));
  };

  const stopTimer = () => {
    setActiveTimer(null);
  };

  return (
    <RecipeContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        shoppingList,
        addIngredientsToShoppingList,
        toggleShoppingItem,
        removeShoppingItem,
        addCustomShoppingItem,
        clearCompletedShoppingItems,
        clearAllShoppingItems,
        selectedRecipe,
        setSelectedRecipe,
        isShoppingListOpen,
        setIsShoppingListOpen,
        activeTimer,
        startTimer,
        toggleTimer,
        resetTimer,
        stopTimer,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipes() {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
}
