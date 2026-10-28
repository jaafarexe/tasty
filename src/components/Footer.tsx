import React from 'react';
import { UtensilsCrossed, Heart, BookOpen, Clock, ShieldCheck } from 'lucide-react';
import { Category } from '../types/recipe';

interface FooterProps {
  onSelectCategory: (cat: Category) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  return (
    <footer className="no-print bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800 text-sm">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                Tasty Recipes
              </span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              Everyday culinary inspiration with foolproof recipes, dynamic serving scalers, and seamless grocery planning for passionate home cooks.
            </p>
          </div>

          {/* Categories Column */}
          <div>
            <h4 className="font-serif font-bold text-white text-sm mb-3">Explore Categories</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              {(['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Vegetarian'] as Category[]).map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    {cat} Recipes
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Kitchen Essentials */}
          <div>
            <h4 className="font-serif font-bold text-white text-sm mb-3">Kitchen Features</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Interactive Step Timers</span>
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                <span>Dynamic Serving Scalers</span>
              </li>
              <li className="flex items-center gap-2">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>Saved Favorites Catalog</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Chef-Tested Techniques</span>
              </li>
            </ul>
          </div>

          {/* Culinary Philosophy */}
          <div>
            <h4 className="font-serif font-bold text-white text-sm mb-3">Cook's Creed</h4>
            <p className="text-xs text-stone-400 leading-relaxed italic">
              "Great cooking isn't about perfection; it's about sharing love, aroma, and memories around the table."
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Tasty Recipes. Handcrafted for food lovers.</p>
          <p className="text-stone-500">
            Fresh seasonal ingredients · Easy weeknight meals · Decadent desserts
          </p>
        </div>
      </div>
    </footer>
  );
};
