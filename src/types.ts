export type Category = 'Produce' | 'Meat' | 'Dairy' | 'Dry Goods' | 'Frozen' | 'Snacks' | 'Health Care';
export type Store = 'Costco' | 'Other';

export interface GroceryItem {
  id: string;
  name: string;
  category: Category;
  store: Store;
  createdAt: Date;
}