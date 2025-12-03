"use client";

import type { Product } from "../../../../types/product";
import { ProveedorAccordion } from "../../components/ProveedorAccordion";

type Props = {
  products: Product[];
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
};

export function ProductGroup({ products, onEdit, onDelete }: Props) {
  const groups: Record<string, Product[]> = products.reduce((acc, p) => {
    const prov = p.supplier?.name || "Sin proveedor";
    if (!acc[prov]) acc[prov] = [];
    acc[prov].push(p);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <>
      {Object.entries(groups).map(([prov, items]) => (
        <ProveedorAccordion
          key={prov}
          proveedor={prov}
          productos={items}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </>
  );
}
