import { useState, useEffect, useRef } from "react";
import { Search, User, Truck, Check } from "lucide-react";
import { useCustomization } from "../../../../context/CustomizationContext";
import { Supplier } from "../../../../types/api";

interface SupplierSearchProps {
  suppliers: Supplier[];
  selectedSupplierId?: string | null;
  onSelect: (supplier: Supplier | null) => void;
}

export default function SupplierSearch({ suppliers, selectedSupplierId, onSelect }: SupplierSearchProps) {
  const { formatCurrency } = useCustomization();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Find selected supplier for display
  const selectedSupplier = suppliers.find(s => s._id === selectedSupplierId);

  // Filter suppliers
  const filteredSuppliers = suppliers.filter((supplier) => {
    if (!query) return true; // Show all (or first 5) if no query
    const lowerQuery = query.toLowerCase();
    return (
      supplier.name.toLowerCase().includes(lowerQuery) ||
      (supplier.email && supplier.email.toLowerCase().includes(lowerQuery))
    );
  }).slice(0, 5);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (supplier: Supplier | null) => {
    onSelect(supplier);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full z-50">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
        Proveedor
      </label>
      
      {selectedSupplier ? (
        <div className="flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded-md text-primary font-medium">
            <div className="flex items-center gap-2">
                <Truck size={18} />
                <span>{selectedSupplier.name}</span>
                {selectedSupplier.balance !== undefined && (
                   <span className={`text-xs ml-2 font-bold ${selectedSupplier.balance > 0 ? "text-red-500" : selectedSupplier.balance < 0 ? "text-green-600" : "text-gray-500"}`}>
                       ({selectedSupplier.balance > 0 ? "Deuda" : selectedSupplier.balance < 0 ? "A favor" : "Al día"}{selectedSupplier.balance !== 0 ? `: ${formatCurrency(Math.abs(selectedSupplier.balance))}` : ""})
                   </span>
                )}
            </div>
            <button 
                onClick={() => handleSelect(null)}
                className="p-1 hover:bg-primary/10 rounded-md transition"
                title="Cambiar proveedor"
            >
                <span className="text-xs font-bold px-2">Cambiar</span>
            </button>
        </div>
      ) : (
        <div className="relative">
            <input
                type="text"
                placeholder="Buscar proveedor..."
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => {
                    if (query.length > 0) setIsOpen(true);
                }}
                className="w-full pl-4 pr-4 py-3 rounded-md border border-gray-200 dark:border-zinc-700/50 bg-gray-50 dark:bg-zinc-800/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 dark:text-white transition-all font-medium placeholder-gray-400"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
      )}

      {/* DROPDOWN RESULTADOS */}
      {isOpen && !selectedSupplier && (
        <div className="group absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 rounded-md shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden max-h-60 overflow-y-auto z-50">
          {filteredSuppliers.length > 0 ? (
            <ul>
              {filteredSuppliers.map((supplier) => (
                <li
                  key={supplier._id}
                  onClick={() => handleSelect(supplier)}
                  className="
                    px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer
                    flex items-center justify-between
                    border-b border-gray-50 dark:border-zinc-800 last:border-none
                  "
                >
                  <div className="flex items-center gap-3">
                    <div className="group-hover:bg-gray-200 group-hover:text-gray-700 dark:bg-zinc-800 p-2 rounded-md text-gray-500 transition-colors">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">{supplier.name}</p>
                      <div className="flex items-center gap-2">
                         {supplier.email && <p className="text-xs text-gray-500 truncate max-w-[150px]">{supplier.email}</p>}
                         {supplier.balance !== undefined && (
                            <p className={`text-xs font-semibold ${supplier.balance > 0 ? "text-red-500" : supplier.balance < 0 ? "text-green-500" : "text-gray-500"}`}>
                                {supplier.balance > 0 ? "Deuda:" : supplier.balance < 0 ? "A favor:" : "Al día"} {supplier.balance !== 0 && formatCurrency(Math.abs(supplier.balance))}
                            </p>
                         )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
             <div className="p-4 text-center text-gray-500 text-sm">
               No se encontraron proveedores.
             </div>
          )}
        </div>
      )}
    </div>
  );
}
