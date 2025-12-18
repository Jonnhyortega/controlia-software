import { useState, useEffect, useRef } from "react";
import { Search, Plus, Package } from "lucide-react";
import { useCustomization } from "../../../../context/CustomizationContext";

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  barcode?: string;
}

interface ProductSearchProps {
  products: Product[];
  onSelect: (product: Product) => void;
}

export default function ProductSearch({ products, onSelect }: ProductSearchProps) {
  const { formatCurrency } = useCustomization();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Filtrar productos
  const filteredProducts = products.filter((product) => {
    if (!query) return false;
    const lowerQuery = query.toLowerCase();
    return (
      product.name.toLowerCase().includes(lowerQuery) ||
      (product.barcode && product.barcode.includes(lowerQuery))
    );
  }).slice(0, 5); // Limitar a 5 resultados para no saturar

  // Cerrar al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (product: Product) => {
    onSelect(product);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full mb-6 z-[100]">
      <div className="flex flex-col gap-2">
        <label htmlFor="search-product" className="text-gray-800 dark:text-gray-500 font-bold text-lg px-1">
          Buscar producto por nombre o código...
        </label>
        <div className="relative">
          <input
            type="text"
            name="search-product"
            placeholder="Escribe para buscar..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="
              w-full
              bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-700/50 rounded-xl px-4 py-3.5 pr-10
              focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
              shadow-sm text-gray-900 dark:text-white placeholder-gray-400 font-medium transition-all
            "
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2 ml-1">
        💡 Tip: Puedes escanear el código de barras directamente o escribir para buscar.
      </p>

      {isOpen && query.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#18181b] rounded-xl shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden max-h-60 overflow-y-auto z-[150]">
          {filteredProducts.length > 0 ? (
            <ul>
              {filteredProducts.map((product) => (
                <li
                  key={product._id}
                  onClick={() => handleSelect(product)}
                  className="
                    px-4 py-3 hover:bg-gray-200 cursor-pointer
                    flex items-center justify-between
                    border-b border-gray-50 last:border-none
                    dark:bg-gray-800 dark:hover:bg-gray-700
                  "
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-50 p-2 rounded-md text-primary">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">{product.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Stock: <span className={product.stock > 0 ? "text-green-600" : "text-red-500"}>{product.stock}</span>
                        {product.barcode && ` • Código: ${product.barcode}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-700 dark:text-gray-200">{formatCurrency(product.price)}</span>
                    <button className="p-1 bg-primary text-white dark:text-gray-800 rounded-full hover:bg-primary-700">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              No se encontraron productos.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
