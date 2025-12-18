"use client";

import { Plus, XCircle, Package, Settings } from "lucide-react";
import { Button } from "../../components/button";

interface HeaderActionsProps {
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  resetForm: () => void;
  setShowCategories: React.Dispatch<React.SetStateAction<boolean>>; // 👈 NUEVO
}

export function HeaderActions({ showForm, setShowForm, resetForm, setShowCategories }: HeaderActionsProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center justify-between w-full md:w-auto">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
          <Package className="text-primary w-7 h-7" />
          Productos
        </h1>
        
        {/* Mobile only: Categories button next to title */}
        <Button
          onClick={() => setShowCategories(true)}
          variant="secondary"
          className="md:hidden rounded-md px-3 py-1.5 flex items-center gap-2 text-sm"
        >
          <Settings className="w-4 h-4" />
          Categorías
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
        {/* Desktop only: Categories button */}
        <Button
          onClick={() => setShowCategories(true)}
          variant="secondary"
          className="hidden md:flex rounded-md px-4 py-2 items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          Categorías
        </Button>

        <Button
          onClick={() => {
            resetForm();
            setShowForm((prev) => !prev);
          }}
          variant={showForm ? "secondary" : "default"}
          className="rounded-md px-4 py-2 flex items-center justify-center gap-2 z-index-10000 w-full md:w-auto"
        >          
            <>
              <Plus className="w-4 h-4" /> Nuevo producto
            </>         
        </Button>
      </div>
    </div>
  );
}
