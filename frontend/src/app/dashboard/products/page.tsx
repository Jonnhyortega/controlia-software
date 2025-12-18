"use client";

import { useState } from "react";
import { useProducts } from "./hooks/useProducts";

import { HeaderActions } from "./components/HeaderActions";
import { SearchBar } from "./components/SearchBar";
import { ProductForm } from "./components/ProductForm";
import { ProductList } from "./components/ProductList";

import { ScannerModal } from "./components/ScannerModal";
import { AddStockModal } from "./components/AddStockModal";
import { ConfirmDialog } from "../components/confirmDialog";

import ConfigCategories from "./components/ConfigCategories";
import { ProductHistoryModal } from "./components/ProductHistoryModal";

import Loading from "../../../components/loading";
import { X, Package, Settings2, List } from "lucide-react";
import Overlay from "../components/overlay";
import { CollapsibleSection } from "../../../components/ui/CollapsibleSection";

export default function ProductsPage() {
  const p = useProducts();

  // NUEVO → mostrar modal de categorías
  const [showCategories, setShowCategories] = useState(false);

  if (p.loading) return <Loading />;

  return (
    <section className="overflow-y-auto h-screen flex flex-col gap-5 p-4 sm:p-6" data-scrollable>
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-2xl shadow-lg shadow-blue-500/20 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
           <Package className="w-8 h-8 text-white" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Productos
          </h1>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Gestión de inventario y stock
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
          <HeaderActions
            showForm={p.showForm}
            setShowForm={p.setShowForm}
            resetForm={() =>
              p.setForm({
                name: "",
                category: "",
                price: 0,
                cost: 0,
                stock: 0,
                barcode: "",
                description: "",
                supplier: "",
              })
            }
            setShowCategories={setShowCategories} // ← NUEVO
          />

          {/* BUSCADOR */}
          <SearchBar searchTerm={p.searchTerm} setSearchTerm={p.setSearchTerm} />
      </div>

      {/* MODAL → FORMULARIO DE PRODUCTO */}
      {p.showForm && (
        <Overlay fullScreen={true}>
          <div className="relative w-full max-w-4xl mx-auto my-10">
            

            <ProductForm
              form={p.form}
              setForm={p.setForm}
              suppliers={p.suppliers}
              categories={p.categories}
              setShowCategories={setShowCategories}
              onSubmit={p.handleSubmit}
              setScannerOpen={p.setScannerOpen}
              isSubmitting={p.isSubmitting}
              onClickClose={() => p.setShowForm(false)}
            />
          </div>
        </Overlay>
      )}

      {/* LISTA DE PRODUCTOS */}
      <ProductList
        products={p.filtered}
        onEdit={p.handleEdit}
        onDelete={p.handleDeleteClick}
        onHistory={p.handleHistory}
      />

      {/* CONFIRMAR ELIMINAR PRODUCTO */}
      <ConfirmDialog
        open={p.showDeleteDialog}
        title="Eliminar producto"
        message="¿Seguro que querés eliminar este producto?"
        onConfirm={p.confirmDelete}
        onCancel={() => p.setShowDeleteDialog(false)}
      />

      {/* MODAL SCANNER */}
      {p.scannerOpen && (
        <ScannerModal
          onDetected={p.onBarcodeDetected}
          onClose={() => p.setScannerOpen(false)}
        />
      )}

      {/* MODAL SUMAR STOCK AUTOMÁTICO */}
      {p.foundProductForAdd && (
        <AddStockModal
          product={p.foundProductForAdd}
          qty={p.addStockQty}
          setQty={p.setAddStockQty}
          onCancel={() => p.setFoundProductForAdd(null)}
          onConfirm={p.confirmAddStock}
        />
      )}

      {/* MODAL CONFIGURACIÓN DE CATEGORÍAS */}
      {showCategories && (
        <ConfigCategories 
        onClose={() => setShowCategories(false)}
        reloadCategories={p.reloadCategories} 
        />
      )}

      {/* MODAL HISTORIAL DE PRODUCTO */}
      {p.historyProduct && (
        <ProductHistoryModal
          productId={p.historyProduct.id}
          productName={p.historyProduct.name}
          onClose={() => p.setHistoryProduct(null)}
        />
      )}
    </section>
  );
}
