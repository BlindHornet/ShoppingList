//Local Imports
import React from "react";

//Style Imports
import "../../styles/global.css";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-100">
          Delete Item
        </h3>
        <p className="mb-6 text-gray-300">
          Are you sure you want to delete "{itemName}"?
        </p>
        <div className="flex justify-center gap-8">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-gray-100 rounded-lg text-shadow hover:text-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-gray-100 rounded-lg text-shadow hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
