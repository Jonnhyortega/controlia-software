import { useState, useEffect, useRef } from "react";
import { Search, User, Check } from "lucide-react";

interface Client {
  _id: string;
  name: string;
  email?: string;
  dni?: string;
}

interface ClientSearchProps {
  clients: Client[];
  selectedClientId?: string | null;
  onSelect: (client: Client | null) => void;
}

export default function ClientSearch({ clients, selectedClientId, onSelect }: ClientSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Find selected client name for display
  const selectedClient = clients.find(c => c._id === selectedClientId);

  // Filter clients
  const filteredClients = clients.filter((client) => {
    if (!query) return true; // Show all (or first 5) if no query
    const lowerQuery = query.toLowerCase();
    return (
      client.name.toLowerCase().includes(lowerQuery) ||
      (client.email && client.email.toLowerCase().includes(lowerQuery)) ||
      (client.dni && client.dni.includes(lowerQuery))
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

  const handleSelect = (client: Client | null) => {
    onSelect(client);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full z-50">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Cliente (Opcional)
      </label>
      
      {selectedClient ? (
        <div className="flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded-md text-primary font-medium">
            <div className="flex items-center gap-2">
                <User size={18} />
                <span>{selectedClient.name}</span>
            </div>
            <button 
                onClick={() => handleSelect(null)}
                className="p-1 hover:bg-primary/10 rounded-md transition"
                title="Quitar cliente"
            >
                <span className="text-xs font-bold px-2">Cambiar</span>
            </button>
        </div>
      ) : (
        <div className="relative">
            <input
                type="text"
                placeholder="Buscar cliente por nombre, DNI..."
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-200 dark:border-zinc-700/50 bg-white dark:bg-zinc-800/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 dark:text-white transition-all font-medium placeholder-gray-400"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
      )}

      {/* DROPDOWN RESULTADOS */}
      {isOpen && !selectedClient && (
        <div className="group absolute top-full left-0 right-0 mt-2 bg-white dark:bg-green-700 rounded-md shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden max-h-60 overflow-y-auto z-50">
          {filteredClients.length > 0 ? (
            <ul>
              {filteredClients.map((client) => (
                <li
                  key={client._id}
                  onClick={() => handleSelect(client)}
                  className="
                    px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer
                    flex items-center justify-between
                    border-b border-gray-50 dark:border-zinc-800 last:border-none
                  "
                >
                  <div className="flex items-center gap-3">
                    <div className="group-hover:bg-gray-500 group-hover:text-white dark:bg-zinc-800 p-2 rounded-md text-gray-500">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">{client.name}</p>
                      {client.dni && <p className="text-xs text-gray-500">DNI: {client.dni}</p>}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
             <div className="p-4 text-center text-gray-500 text-sm">
               No se encontraron clientes.
             </div>
          )}
        </div>
      )}
    </div>
  );
}
