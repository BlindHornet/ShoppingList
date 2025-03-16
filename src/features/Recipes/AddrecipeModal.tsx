import React, { useState } from "react";
import { db } from "../../services/firebase";
import { addDoc, collection } from "firebase/firestore";
import { Recipe } from "../../services/types";

interface AddRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddRecipeModal: React.FC<AddRecipeModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<Partial<Recipe>>({
    name: "",
    description: "",
    ingredients: [""],
    instructions: [""],
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleIngredientsChange = (index: number, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      ingredients: prevFormData.ingredients?.map((ingredient, i) =>
        i === index ? value : ingredient
      ),
    }));
  };

  const handleInstructionsChange = (index: number, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      instructions: prevFormData.instructions?.map((instruction, i) =>
        i === index ? value : instruction
      ),
    }));
  };

  const handleAddIngredient = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      ingredients: [...(prevFormData.ingredients || []), ""],
    }));
  };

  const handleAddInstruction = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      instructions: [...(prevFormData.instructions || []), ""],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "recipes"), formData as Recipe);
      onClose();
    } catch (error) {
      console.error("Error adding recipe:", error);
    }
  };

  return (
    <div
      className={`fixed z-10 inset-0 overflow-y-auto ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
        <div className="inline-block align-bottom bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <form onSubmit={handleSubmit}>{/* Add recipe form fields */}</form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRecipeModal;
