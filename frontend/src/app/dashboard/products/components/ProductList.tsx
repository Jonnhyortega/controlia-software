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
      <div className="bg-white dark:bg-[#18181b] p-10 rounded-md shadow-md border border-gray-100 dark:border-[#27272a] flex flex-col items-center justify-center text-center space-y-4 transition-colors">
        <div className="bg-gray-100 dark:bg-[#27272a] p-6 rounded-full transition-colors">
          <PackageOpen size={48} className="text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          No se encontraron productos
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
          Intenta ajustar los filtros de búsqueda o agrega un nuevo producto a tu inventario.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-background p-6 rounded-md shadow-md border border-gray-100 dark:border-border transition-colors">
      <h2 className="text-lg font-semibold text-primary dark:text-blue-400 mb-6">
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
