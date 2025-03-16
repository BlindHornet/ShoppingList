//Library Imports
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";

//Services and Types
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { GroceryItem, Category, Store } from "../services/types";

//Component Imports
import GroceryList from "../features/ShoppingList/GroceryList";
import { DeleteModal } from "../features/ShoppingList/DeleteModal";

//Style Imports
import "../styles/global.css";

function Dashboard() {
  const shoppingList = "shoppingList";
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [activeTab, setActiveTab] = useState<Store>("Costco");
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<Category>("Produce");
  const [newItemStore, setNewItemStore] = useState<Store>("Costco");
  const [deleteItem, setDeleteItem] = useState<GroceryItem | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const q = query(collection(db, shoppingList), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newItems = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as GroceryItem[];
      setItems(newItems);
    });

    return () => unsubscribe();
  }, []);

  // Fetch suggestions based on input
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!newItemName.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        const q = query(
          collection(db, "shoppingPrices"),
          where("itemName", ">=", newItemName.trim().toLowerCase()),
          where("itemName", "<", newItemName.trim().toLowerCase() + "\uf8ff")
        );

        const querySnapshot = await getDocs(q);

        const matchingSuggestions = querySnapshot.docs
          .map((doc) => doc.data().itemName)
          .filter((name) =>
            name.toLowerCase().startsWith(newItemName.trim().toLowerCase())
          );

        setSuggestions([...new Set(matchingSuggestions)]);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    fetchSuggestions();
  }, [newItemName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    try {
      await addDoc(collection(db, shoppingList), {
        name: newItemName.trim(),
        category: newItemCategory,
        store: newItemStore,
        createdAt: new Date(),
      });
      setNewItemName("");
      setSuggestions([]);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setNewItemName(suggestion);
    setSuggestions([]);
  };

  const handleDelete = async () => {
    if (!deleteItem) return;

    try {
      await deleteDoc(doc(db, shoppingList, deleteItem.id));
      setDeleteItem(null);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-2 py-6">
        <h1 className="text-3xl font-bold text-gray-100 mb-8 text-center">
          Shopping List
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 rounded-lg shadow-lg p-4 mb-8 relative"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="col-span-2 relative">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Add item..."
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-100 placeholder-gray-400"
              />
              {suggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-gray-700 border border-gray-600 rounded-b-lg shadow-lg">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-gray-100"
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value as Category)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-100"
            >
              <option value="Fruits">Fruits</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Meat">Meat</option>
              <option value="Dry Goods">Dry Goods</option>
              <option value="Condiments & Spices">Condiments & Spices</option>
              <option value="Snacks">Snacks</option>
              <option value="Dairy">Dairy</option>
              <option value="Frozen Foods">Frozen Foods</option>
              <option value="Beverages">Beverages</option>
              <option value="Health Care">Health Care</option>
              <option value="Household Supplies">Household Supplies</option>
              <option value="Dogs">Dogs</option>
              <option value="Gifts">Gifts</option>
              <option value="Other">Other</option>
            </select>
            <select
              value={newItemStore}
              onChange={(e) => setNewItemStore(e.target.value as Store)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-100 "
            >
              <option value="Costco">Costco</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button
            type="submit"
            className="mt-4 w-full md:w-auto px-6 py-2 bg-blue-600 text-gray-100 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors text-shadow"
          >
            <Plus size={18} className="text-shadow" />
            Add Item
          </button>
        </form>

        <div className="mb-6">
          <div className="flex space-x-4 border-b border-gray-700">
            {["Costco", "Other"].map((store) => (
              <button
                key={store}
                onClick={() => setActiveTab(store as Store)}
                className={`px-6 py-3 font-medium ${
                  activeTab === store
                    ? "border-b-2 border-blue-500 text-blue-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                {store}
              </button>
            ))}
          </div>
        </div>

        <GroceryList
          items={items.filter((item) => item.store === activeTab)}
          onDeleteClick={setDeleteItem}
        />

        <DeleteModal
          isOpen={!!deleteItem}
          onClose={() => setDeleteItem(null)}
          onConfirm={handleDelete}
          itemName={deleteItem?.name || ""}
        />
      </div>
    </div>
  );
}

export default Dashboard;
