export type Category =
  | "Produce"
  | "Meat"
  | "Dairy"
  | "Dry Goods"
  | "Frozen"
  | "Snacks"
  | "Health Care";
export type Store = "Costco" | "Other";

export interface GroceryItem {
  id: string;
  name: string;
  category: Category;
  store: Store;
  createdAt: Date;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  servingSize: number;
  protein: number;
  carbs: number;
  fat: number;
}
