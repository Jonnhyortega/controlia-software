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
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
        <Package className="text-primary w-7 h-7" />
        Productos
      </h1>

      <div className="flex items-center gap-3">
        <Button
          onClick={() => setShowCategories(true)}
          variant="secondary"
          className="rounded-xl px-4 py-2 flex items-center gap-2"
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
          className="rounded-xl px-4 py-2 flex items-center gap-2 z-index-10000"
        >          
            <>
              <Plus className="w-4 h-4" /> Nuevo producto
            </>         
        </Button>
      </div>
    </div>
  );
}
