export type Category = "new" | "mens" | "womens" | "slides" | "accessories";

export interface Size {
  value: string;
  label: string;
  available: boolean;
}

export interface Product {
  id: string;
  code: string;
  slug: string;
  name: string;
  price: number;
  images: string[];
  sizes: Size[];
  category: Category;
  description?: string;
  inStock: boolean;
  featured: boolean;
  dateAdded: string;
}

export interface CartItem {
  productId: string;
  code: string;
  slug: string;
  price: number;
  size: string;
  qty: number;
  image: string;
}
