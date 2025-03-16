//Local Imports
import React, { useState, useEffect } from "react";

//Firebase Imports
import { db } from "../../services/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  setDoc,
  doc,
} from "firebase/firestore";

//Style Imports
import "../../styles/global.css";

interface SavePriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: { name: string } | null;
  onDataUpdated: () => void;
}

export const SavePriceModal: React.FC<SavePriceModalProps> = ({
  isOpen,
  onClose,
  item,
  onDataUpdated,
}) => {
  const [brandName, setBrandName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("");
  const [stores, setStores] = useState<string[]>([
    "Aldi",
    "Costco",
    "Kroger",
    "Publix",
    "Walmart",
    "Other",
  ]);
  const [existingData, setExistingData] = useState<any>(null);
  const [existingDocId, setExistingDocId] = useState<string | null>(null);

  const units = [
    "gal",
    "g",
    "item",
    "lb",
    "L",
    "ml",
    "oz",
    "pack",
    "qt",
    "rolls",
    "sq ft",
  ].sort();

  if (!isOpen || !item) return null;

  useEffect(() => {
    const fetchExistingData = async () => {
      const q = query(
        collection(db, "shoppingPrices"),
        where("itemName", "==", item.name),
        where("storeName", "==", storeName)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        setBrandName(data.brandName);
        setPrice(data.price);
        setWeight(data.weight);
        setUnit(data.unit);
        setExistingData(data);
        setExistingDocId(querySnapshot.docs[0].id);
      } else {
        setExistingData(null);
        setExistingDocId(null);
      }
    };

    if (storeName) {
      fetchExistingData();
    }
  }, [storeName, item.name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (storeName !== "Other" && !stores.includes(storeName)) {
      await addDoc(collection(db, "shoppingStores"), { name: storeName });
      setStores((prevStores) => [...prevStores, storeName].sort());
    }

    const itemData = {
      itemName: item.name,
      brandName,
      storeName: storeName === "Other" ? storeName : storeName,
      price,
      weight,
      unit,
    };

    if (existingDocId) {
      await setDoc(doc(db, "shoppingPrices", existingDocId), itemData);
    } else {
      await addDoc(collection(db, "shoppingPrices"), itemData);
    }

    onClose();
    onDataUpdated(); // Trigger the callback after data is saved
  };

  const displayItemName = () => {
    if (price && weight) {
      const pricePerWeight = (parseFloat(price) / parseFloat(weight)).toFixed(
        2
      );
      return `${item.name} - $${pricePerWeight}`;
    }
    return `${item.name} - $0.00`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 border border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-gray-100 text-center">
          {displayItemName()}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Brand Name</label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Store Name</label>
            <select
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg"
              required
            >
              <option value="">Select Store</option>
              {stores.map((store) => (
                <option key={store} value={store}>
                  {store}
                </option>
              ))}
            </select>
            {storeName === "Other" && (
              <input
                type="text"
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Enter Store Name"
                className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg mt-2"
                required
              />
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg"
              required
            />
          </div>
          <div className="mb-4 flex gap-2">
            <div className="flex-1">
              <label className="block text-gray-300 mb-1">Weight</label>
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-300 mb-1">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg"
                required
              >
                <option value="">Select Unit</option>
                {units.map((unitOption) => (
                  <option key={unitOption} value={unitOption}>
                    {unitOption}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-center gap-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-gray-100 rounded-lg text-shadow hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-gray-100 rounded-lg text-shadow hover:bg-blue-400 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
