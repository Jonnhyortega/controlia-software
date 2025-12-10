"use client";
import { ProductGroup } from "./ProductGroup";
interface ProductListProps {
  products: any[];
  onEdit: (product: any) => void;
  onDelete: (productId: string) => void;
  onHistory: (product: any) => void;
}

import { PackageOpen } from "lucide-react";

export function ProductList({ products, onEdit, onDelete, onHistory }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="bg-white p-10 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center justify-center text-center space-y-4">
        <div className="bg-gray-100 p-6 rounded-full">
          <PackageOpen size={48} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800">
          No se encontraron productos
        </h3>
        <p className="text-gray-500 max-w-sm">
          Intenta ajustar los filtros de búsqueda o agrega un nuevo producto a tu inventario.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-lg font-semibold text-primary mb-6">
        Lista de productos
      </h2>

      <ProductGroup
        products={products}
        onEdit={onEdit}
        onDelete={onDelete}
        onHistory={onHistory}
      />
    </div>
  );
}
