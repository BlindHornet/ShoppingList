import React, { useState, useEffect } from "react";
import { db } from "../../services/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Recipe } from "../../services/types";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const RecipesPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState<"name" | "ingredient">("name");
  const [proteinMax, setProteinMax] = useState<number | null>(null);
  const [carbsMax, setCarbsMax] = useState<number | null>(null);
  const [fatMax, setFatMax] = useState<number | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "recipes"));
        const recipeData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Recipe[];
        setRecipes(recipeData);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };
    fetchRecipes();
  }, []);

  const filteredRecipes = recipes
    .filter((recipe) => {
      if (searchType === "name") {
        return recipe.name.toLowerCase().includes(searchText.toLowerCase());
      } else {
        return recipe.ingredients.some((ingredient) =>
          ingredient.toLowerCase().includes(searchText.toLowerCase())
        );
      }
    })
    .filter((recipe) => {
      return (
        (proteinMax === null || recipe.protein <= proteinMax) &&
        (carbsMax === null || recipe.carbs <= carbsMax) &&
        (fatMax === null || recipe.fat <= fatMax)
      );
    });

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-end mb-8">
          <Link
            to="/recipes/add"
            className="px-4 py-2 bg-blue-600 text-gray-100 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>Add Recipe</span>
          </Link>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search recipes..."
            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-100 placeholder-gray-400 w-full"
          />
          <select
            value={searchType}
            onChange={(e) =>
              setSearchType(e.target.value as "name" | "ingredient")
            }
            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-100"
          >
            <option value="name">Search by Name</option>
            <option value="ingredient">Search by Ingredient</option>
          </select>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <label htmlFor="protein-max" className="text-gray-400">
              Protein ≤
            </label>
            <input
              id="protein-max"
              type="number"
              value={proteinMax || ""}
              onChange={(e) =>
                setProteinMax(e.target.value ? parseInt(e.target.value) : null)
              }
              className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-100 w-20"
            />
            <span className="text-gray-400">g</span>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="carbs-max" className="text-gray-400">
              Carbs ≤
            </label>
            <input
              id="carbs-max"
              type="number"
              value={carbsMax || ""}
              onChange={(e) =>
                setCarbsMax(e.target.value ? parseInt(e.target.value) : null)
              }
              className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-100 w-20"
            />
            <span className="text-gray-400">g</span>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="fat-max" className="text-gray-400">
              Fat ≤
            </label>
            <input
              id="fat-max"
              type="number"
              value={fatMax || ""}
              onChange={(e) =>
                setFatMax(e.target.value ? parseInt(e.target.value) : null)
              }
              className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-100 w-20"
            />
            <span className="text-gray-400">g</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-center">Recipes</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <h2 className="text-xl font-bold mb-4">{recipe.name}</h2>
              <p className="mb-4">{recipe.description}</p>
              {/* Add more recipe details as needed */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipesPage;
