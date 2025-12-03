"use client";
import { XCircle } from "lucide-react";
interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}   

export function SearchBar({ searchTerm, setSearchTerm }: SearchBarProps) {
  return (
    <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-md border">
      <input
        type="text"
        placeholder="Buscar por nombre, categoría o proveedor..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border rounded-xl px-4 py-2"
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm("")}
          className="text-gray-500 hover:text-gray-700"
        >
          <XCircle className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
