"use client";

import { Package, Settings } from "lucide-react";
import { Button } from "../../components/button";
import { LimitAwareButton } from "../../components/LimitAwareButton";

interface HeaderActionsProps {
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  resetForm: () => void;
  setShowCategories: React.Dispatch<React.SetStateAction<boolean>>;
  isLimitReached?: boolean;
}

export function HeaderActions({ showForm, setShowForm, resetForm, setShowCategories, isLimitReached }: HeaderActionsProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-start gap-4">
      <div className="flex items-center justify-between w-full md:w-auto">
        
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

        <LimitAwareButton
            isLimitReached={!!isLimitReached}
            onClick={() => {
               resetForm();
               setShowForm((prev) => !prev);
            }}
            label="Nuevo producto"
            className="w-full md:w-auto"
        />
      </div>
    </div>
  );
}
