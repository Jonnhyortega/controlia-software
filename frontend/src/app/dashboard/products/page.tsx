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
import { X } from "lucide-react";
import Overlay from "../components/overlay";

export default function ProductsPage() {
  const p = useProducts();

  // NUEVO → mostrar modal de categorías
  const [showCategories, setShowCategories] = useState(false);

  if (p.loading) return <Loading />;

  return (
    <section className="overflow-y-auto h-screen flex flex-col gap-5" data-scrollable>
      {/* HEADER */}
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

      {/* MODAL → FORMULARIO DE PRODUCTO */}
      {p.showForm && (
        <Overlay fullScreen={true}>
          <div className="relative w-full max-w-4xl mx-auto my-10">
            {/*Boton para cerrar overlay  */}          
            <button
              onClick={() => p.setShowForm(false)}
              className="absolute -top-4 -right-4 md:-right-10 text-gray-500 hover:text-red-500 transition p-2 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              <X size={24} />
            </button>

            <ProductForm
              form={p.form}
              setForm={p.setForm}
              suppliers={p.suppliers}
              categories={p.categories}
              setShowCategories={setShowCategories}
              onSubmit={p.handleSubmit}
              setScannerOpen={p.setScannerOpen}
              isSubmitting={p.isSubmitting}
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
