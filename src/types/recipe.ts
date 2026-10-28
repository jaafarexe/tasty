export type Category = 'All' | 'Breakfast' | 'Lunch' | 'Dinner' | 'Dessert' | 'Vegetarian';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type IngredientCategory =
  | 'Produce'
  | 'Dairy & Refrigerated'
  | 'Meat & Seafood'
  | 'Pantry & Grains'
  | 'Spices, Oils & Condiments'
  | 'Baking & Sweets';

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: IngredientCategory;
  notes?: string;
}

export interface Instruction {
  step: number;
  title: string;
  instruction: string;
  durationMinutes?: number;
}

export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface Recipe {
  id: string;
  title: string;
  subtitle: string;
  category: Category;
  cuisine: string;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  difficulty: Difficulty;
  image: string;
  fallbackBg: string;
  description: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  ingredients: Ingredient[];
  instructions: Instruction[];
  nutrition: Nutrition;
  chefTips: string[];
}

export interface ShoppingListItem {
  id: string;
  recipeId?: string;
  recipeTitle?: string;
  name: string;
  quantity: number | null;
  unit: string;
  category: IngredientCategory;
  completed: boolean;
  notes?: string;
}

export interface FilterOptions {
  searchQuery: string;
  category: Category;
  difficulty: 'All' | Difficulty;
  maxTime: number | null; // e.g. 30 minutes
  onlyFavorites: boolean;
  sortBy: 'featured' | 'rating' | 'quickest' | 'alphabetical';
}
