import React, { useState } from "react";
import { Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { GroceryItem } from "../types";
import clsx from "clsx";
import "../styles/global.css";

interface GroceryListProps {
  items: GroceryItem[];
  onDeleteClick: (item: GroceryItem) => void;
}

export const GroceryList: React.FC<GroceryListProps> = ({
  items,
  onDeleteClick,
}) => {
  const categories = [
    "Produce",
    "Meat",
    "Dairy",
    "Dry Goods",
    "Frozen",
    "Snacks",
    "Health Care",
    "Other",
  ];
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories)
  );

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <div className="space-y-6">
      {categories.map((category) => {
        const categoryItems = items.filter(
          (item) => item.category === category
        );
        if (categoryItems.length === 0) return null;
        const isExpanded = expandedCategories.has(category);

        return (
          <div
            key={category}
            className="bg-gray-800 rounded-lg shadow-lg border border-gray-700"
          >
            <button
              onClick={() => toggleCategory(category)}
              className="w-full px-4 py-3 bg-gray-750 rounded-t-lg border-b border-gray-700 flex items-center justify-between cursor-pointer hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-2">
                {isExpanded ? (
                  <ChevronDown size={20} className="text-gray-400" />
                ) : (
                  <ChevronRight size={20} className="text-gray-400" />
                )}
                <h3 className="font-semibold text-gray-100">
                  {category}{" "}
                  <span className="ml-2 bg-blue-600 text-gray-100 px-2 py-0.5 rounded-full text-sm">
                    {categoryItems.length}
                  </span>
                </h3>
              </div>
            </button>
            {isExpanded && (
              <div className="divide-y divide-gray-700">
                {categoryItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={clsx(
                      "px-4 py-3 flex justify-between items-center",
                      index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"
                    )}
                  >
                    <span className="text-gray-200">{item.name}</span>
                    <button
                      onClick={() => onDeleteClick(item)}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
