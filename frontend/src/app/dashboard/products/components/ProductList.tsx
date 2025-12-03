"use client";
import { ProductGroup } from "./ProductGroup";
interface ProductListProps {
  products: any[];
  onEdit: (product: any) => void;
  onDelete: (productId: string) => void;
}

export function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-lg font-semibold text-primary mb-6">
        Lista de productos
      </h2>

      <ProductGroup
        products={products}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}
