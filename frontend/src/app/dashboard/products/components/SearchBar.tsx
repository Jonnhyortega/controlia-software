"use client";
import { XCircle } from "lucide-react";
interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}   

export function SearchBar({ searchTerm, setSearchTerm }: SearchBarProps) {
  return (
    <div className="flex items-center gap-3 bg-white dark:bg-background p-4 rounded-md shadow-md border dark:border-border">
      <input
        type="text"
        placeholder="Buscar por nombre, categoría o proveedor..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border rounded-md px-4 py-2 bg-transparent dark:text-white dark:border-gray-700 placeholder:text-gray-400"
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm("")}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <XCircle className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
