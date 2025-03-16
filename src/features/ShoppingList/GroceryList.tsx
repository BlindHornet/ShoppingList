//Library Imports
import React, { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import clsx from "clsx";

//Services and Types
import { GroceryItem } from "../../services/types";
import { db } from "../../services/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

//Component Imports
import { SavePriceModal } from "./SavePriceModal";

//Style Imports
import "../../styles/global.css";

interface GroceryListProps {
  items: GroceryItem[];
  onDeleteClick: (item: GroceryItem) => void;
}

const GroceryList: React.FC<GroceryListProps> = ({ items, onDeleteClick }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GroceryItem | null>(null);
  const [itemInfo, setItemInfo] = useState<any>(null); // To hold item info for modal
  const [itemMatches, setItemMatches] = useState<Record<string, any[]>>({}); // Store matches for item names

  const onDataUpdated = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "shoppingPrices"));
      const matches: Record<string, any[]> = {};

      // Iterate through each item and fetch matches from Firestore
      for (const item of items) {
        const itemMatches = querySnapshot.docs
          .filter((doc) => doc.data().itemName === item.name)
          .map((doc) => doc.data());

        if (itemMatches.length > 0) {
          matches[item.name] = itemMatches;
        }
      }

      setItemMatches(matches); // Update the state with new matches
    } catch (error) {
      console.error("Error refreshing items:", error);
    }
  };

  useEffect(() => {
    const fetchAllMatches = async () => {
      const matches: Record<string, any[]> = {};

      // Iterate through each item and fetch matches from Firestore
      for (const item of items) {
        const q = query(
          collection(db, "shoppingPrices"),
          where("itemName", "==", item.name)
        );
        const querySnapshot = await getDocs(q);

        // Only store matches if there are any found in Firestore
        if (!querySnapshot.empty) {
          matches[item.name] = querySnapshot.docs.map((doc) => doc.data());
        }
      }

      setItemMatches(matches); // Update the state with valid matches only
    };

    if (items.length > 0) {
      fetchAllMatches();
    }
  }, [items]);

  const handleInfoClick = (itemName: string) => {
    setItemInfo(itemMatches[itemName] || []); // Show all matches for this item
  };

  const handleSaveClick = (item: GroceryItem) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const categories = [
    "Fruits",
    "Produce",
    "Vegetables",
    "Meat",
    "Dry Goods",
    "Condiments & Spices",
    "Snacks",
    "Dairy",
    "Frozen Foods",
    "Beverages",
    "Household Supplies",
    "Health Care",
    "Dogs",
    "Gifts",
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
                  <Icons.ChevronDown size={20} className="text-gray-400" />
                ) : (
                  <Icons.ChevronRight size={20} className="text-gray-400" />
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
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-200">{item.name}</span>
                      {itemMatches[item.name]?.length > 0 && (
                        <button
                          onClick={() => handleInfoClick(item.name)}
                          className="text-blue-500 hover:text-blue-400 transition-colors"
                        >
                          <Icons.Info size={18} />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleSaveClick(item)}
                        className="text-blue-500 hover:text-blue-400 transition-colors"
                      >
                        <Icons.Save size={18} />
                      </button>
                      <button
                        onClick={() => onDeleteClick(item)}
                        className="text-red-500 hover:text-red-400 transition-colors"
                      >
                        <Icons.Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
      {isModalOpen && (
        <SavePriceModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          item={selectedItem}
          onDataUpdated={onDataUpdated}
        />
      )}
      {itemInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-100">
              Item Details
            </h3>
            <div className="space-y-4">
              {itemInfo.map((info, index) => (
                <div key={index} className="border-b border-gray-700 pb-4">
                  <p className="text-gray-100">
                    <span className="font-semibold">{info.storeName}</span> - $
                    {(parseFloat(info.price) / parseFloat(info.weight)).toFixed(
                      2
                    )}{" "}
                    per {info.unit}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setItemInfo(null)}
              className="mt-4 px-4 py-2 bg-gray-400 text-gray-100 rounded-lg text-shadow hover:text-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroceryList;
