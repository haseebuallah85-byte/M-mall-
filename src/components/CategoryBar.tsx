import React from 'react';
import { useShop } from '../context/ShopContext';
import { CategoryType } from '../types';

const CATEGORIES: CategoryType[] = [
  'All',
  'Electronics',
  'Men\'s Fashion',
  'Women\'s Fashion',
  'Shoes & Bags',
  'Bioscience & Lab Supplies',
  'Health & Beauty',
  'Home & Lifestyle'
];

export const CategoryBar: React.FC = () => {
  const { selectedCategory, setSelectedCategory, activeTab, setActiveTab } = useShop();

  const handleCategoryClick = (cat: CategoryType) => {
    setSelectedCategory(cat);
    if (activeTab !== 'shop') {
      setActiveTab('shop');
    }
  };

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar scroll-smooth">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat && activeTab === 'shop';
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#f85606] text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
