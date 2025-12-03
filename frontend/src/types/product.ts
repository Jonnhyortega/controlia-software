export interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  barcode?: string;
  description?: string;
  supplier?: {
    _id: string;
    name: string;
  } | null;
}
