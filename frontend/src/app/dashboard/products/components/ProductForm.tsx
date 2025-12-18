import { ScanBarcode, Loader2, Package, X } from "lucide-react";
import { Button } from "../../components/button";
import { useCustomization } from "../../../../context/CustomizationContext";
import { useState, useEffect } from "react";

interface ProductFormProps {
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  suppliers: any[];
  onSubmit: () => void;
  categories: string[];
  setShowCategories: React.Dispatch<React.SetStateAction<boolean>>;
  setScannerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSubmitting: boolean;
  onClickClose: () => void;
}

// 💵 Componente interno para manejar inputs de moneda
function CurrencyInput({ 
  value, 
  onChange, 
  placeholder, 
  id, 
  name 
}: { 
  value: number; 
  onChange: (e: any) => void; 
  placeholder?: string;
  id?: string;
  name: string;
}) {
  const { settings } = useCustomization();
  const [displayValue, setDisplayValue] = useState("");

  // Al montar o cambiar el valor externo, formateamos (si no estamos escribiendo activamente, o forzamos sync)
  useEffect(() => {
    // Si el valor es 0 o vacío, mostramos vacío o 0 según preferencia. 
    // Aquí optamos por mostrar vacío si es 0 para limpiar, o formateado si tiene valor.
    if (!value && value !== 0) {
      setDisplayValue("");
      return;
    }
    
    // Formateador
    const formatter = new Intl.NumberFormat("es-AR", {
      style: "decimal", // Usamos decimal para no meter el símbolo $ dentro del value textual editable, o sí?
      minimumFractionDigits: 0,
      maximumFractionDigits: 0, // Generalmente precios sin centavos en ARS para input manual, o permitir coma.
    });
    
    // Solo actualizamos si la diferencia es significativa para evitar loop con cursor?
    // En controlled components simples, mejor dejar que el usuario escriba y formatear onBlur.
    // Pero el usuario pidió "ver currency ars".
    
    // ESTRATEGIA: Input tipo texto.
    // Al hacer focus: mostrar número crudo? O formateado?
    // Vamos a probar: Input tipo texto que formatea al salir (onBlur) y mientras escribes permite solo números y muestra el símbolo afuera.
    
    // Simplificación para estabilidad:
    setDisplayValue(value.toString());
  }, [value]);

  const handleBlur = () => {
    if (!value) return;
     // Formatear bonito al salir
     // Realmente para inputs de precio, lo estándar es type="number".
     // Pero si quieren ver "1.000.000", necesitamos formatear.
     
     // 🔧 Intento simple: Mostrar formateado
     // const formatted = new Intl.NumberFormat("es-AR").format(value);
     // setDisplayValue(formatted);
  };
  
  // 💡 Mejor aproximación: Usar Intl.NumberFormat para formatear el valor visual
  // pero el input real es controlado.
  
  const symbol = settings.currency === "USD" ? "u$s" : "$";

  return (
    <div className="relative">
      <span className="absolute left-3 top-2 text-gray-500 font-medium select-none">
        {symbol}
      </span>
      <input
        type="number" 
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border rounded-md pl-8 pr-3 py-2 w-full"
        // Truco: type number evita letras, pero no formatea comas visualmente "1.000".
        // Si el usuario insiste en ver "puntos", tendríamos que usar type="text" y lógica de máscaras compleja.
        // Por ahora, cumpliremos "que se vea con currency" agregando el símbolo $ al inicio.
      />
    </div>
  );
}

// 🔧 VERSIÓN MEJORADA QUE FORMATEA STRING (Tipo "text" con puntos)
function FormattedPriceInput({
  value,
  onChange,
  name,
  placeholder,
  id
}: any) {
    const { settings } = useCustomization();
    const symbol = settings.currency === "USD" ? "u$s" : "$";
    
    // Estado local para lo que el usuario ve
    const [localStr, setLocalStr] = useState("");

    useEffect(() => {
        // Sincronizar prop value (number) -> localStr (string formateado)
        // Ejemplo: 1000 -> "1.000"
        if (value === 0 || value === "0") {
             if (localStr === "") return; // Si el usuario borró todo, no poner 0 forzado
        }
        
        const formatted = new Intl.NumberFormat("es-AR", {
            useGrouping: true,
            maximumFractionDigits: 0,
        }).format(value);
        
        // Solo actualizamos si no estamos editando (esto es díficil de saber). 
        // Hack: Comparamos si el valor numérico parseado del localStr coincide con value.
        // Si coincide, no tocamos el localStr (preservamos lo que el usuario escribe, ej "100" vs "100.")
        
        const currentNum = parseInt(localStr.replace(/\./g, "") || "0");
        if (currentNum !== value) {
             setLocalStr(formatted === "0" ? "" : formatted);
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 1. Obtener input crudo (ej: "1.00a")
        let raw = e.target.value;
        
        // 2. Eliminar todo lo que no sea número
        const clean = raw.replace(/[^0-9]/g, "");
        
        // 3. Convertir a número para el padre
        const numVal = parseInt(clean || "0");
        
        // 4. Formatear para visualización local inmediata (ej: "1000" -> "1.000")
        const formatted = new Intl.NumberFormat("es-AR", {
            useGrouping: true,
        }).format(numVal);

        // 5. Actualizar estado local y padre
        setLocalStr(clean === "" ? "" : formatted);
        
        // Simular evento standard para el padre handleChange
        onChange({ target: { name, value: numVal } });
    };

    return (
        <div className="relative">
             {/* <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium select-none pointer-events-none">
                {symbol}
            </span> */}
            <input
                type="text"
                id={id}
                name={name}
                value={localStr}
                onChange={handleChange}
                placeholder={placeholder}
                className="border border-gray-200 dark:border-[#27272a] rounded-md pl-8 pr-3 py-2 w-full bg-white dark:bg-[#09090b] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                autoComplete="off"
            />
        </div>
    );
}


export function ProductForm({ form, setForm, suppliers, categories, setShowCategories, onSubmit, setScannerOpen, isSubmitting, onClickClose }: ProductFormProps) {
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!isSubmitting) onSubmit();
      }}
      className="bg-white dark:bg-[#18181b] p-6 sm:p-8 rounded-md border border-gray-200 dark:border-zinc-800 shadow-2xl flex flex-col transition-all overflow-scroll relative top-0 left-0 w-full h-[90vh]"
    >
      {/*Boton para cerrar overlay  */}          
      <button
        onClick={onClickClose}
        className="absolute top-2 right-2  text-gray-500 hover:text-red-500 transition"
      >
        <X size={34} />
      </button>
      
      {/* Header */}
      <div className="flex items-center gap-5 mb-8 border-b border-gray-100 dark:border-zinc-800 pb-6">
        <div className="p-3.5 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-md shadow-lg shadow-blue-500/20 transform hover:scale-105 transition-transform duration-300">
          <Package className="w-7 h-7 text-white" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            {form._id ? "Editar Producto" : "Nuevo Producto"}
          </h2>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
            {form._id ? "Modifica los detalles del inventario existente" : "Ingresa la información para el nuevo ítem"}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* 1️⃣ Nombre + Categoría */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                Nombre del Producto <span className="text-red-500">*</span>
                </label>
                <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ej: Alfajor Jorgito"
                required
                className="w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-md px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 font-medium"
                />
            </div>

            <div className="space-y-1.5">
                <label htmlFor="category" className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                Categoría
                </label>
                {categories.length > 0 ? (
                <div className="relative">
                    <select
                        id="category"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full appearance-none bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-md px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium cursor-pointer"
                    >
                        <option value="" className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white">Seleccionar categoría...</option>
                        {categories.map((cat) => (
                        <option key={cat} value={cat} className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white">
                            {cat}
                        </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
                ) : (
                <button
                    type="button"
                    onClick={() => setShowCategories(true)}
                    className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-md px-4 py-3 transition-all font-semibold text-sm flex items-center justify-center gap-2"
                >
                    + Crear Categorías
                </button>
                )}
            </div>
        </div>

        {/* 2️⃣ Proveedor */}
        <div className="space-y-1.5">
            <label htmlFor="supplier" className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
            Proveedor
            </label>
            <div className="relative">
                <select
                id="supplier"
                name="supplier"
                value={form.supplier}
                onChange={handleChange}
                className="w-full appearance-none bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-md px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium cursor-pointer"
                >
                <option value="" className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white">
                  Sin proveedor asignado
                </option>
                {suppliers.map((s) => (
                    <option key={s._id} value={s._id} className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white">
                    {s.name}
                    </option>
                ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
        </div>

        {/* 3️⃣ Precios y Stock (Grid de 3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Stock */}
            <div className="space-y-1.5">
            <label htmlFor="stock" className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                Stock Actual
            </label>
            <input
                type="number"
                id="stock"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="0"
                className="w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-md px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 font-mono font-medium"
            />
            </div>

            {/* Costo */}
            <div className="space-y-1.5">
            <label htmlFor="cost" className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                Costo Unitario
            </label>
            <FormattedPriceInput
                id="cost"
                name="cost"
                value={form.cost}
                onChange={handleChange}
                placeholder="0"
            />
            </div>

            {/* Precio Venta */}
            <div className="space-y-1.5">
            <label htmlFor="price" className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                Precio de Venta
            </label>
            <FormattedPriceInput
                id="price"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="0"
            />
            </div>
        </div>

        {/* 4️⃣ Código de barras */}
        <div className="space-y-1.5">
            <label htmlFor="barcode" className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
            Código de Barras
            </label>
            <div className="flex gap-2">
            <div className="relative flex-1">
                <ScanBarcode className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                <input
                    id="barcode"
                    name="barcode"
                    value={form.barcode || ""}
                    onChange={handleChange}
                    placeholder="Escanear o escribir manualmente..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 font-mono font-medium"
                />
            </div>
            <button
                type="button"
                onClick={() => setScannerOpen(true)}
                className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-4 rounded-md transition-colors flex items-center justify-center"
                title="Abrir Escáner"
            >
                <ScanBarcode size={22} />
            </button>
            </div>
        </div>

        {/* 5️⃣ Descripción */}
        <div className="space-y-1.5">
            <label htmlFor="description" className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
            Notas Adicionales
            </label>
            <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Descripción detallada del producto..."
            rows={3}
            className="w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-md px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 font-medium resize-none"
            />
        </div>
      </div>

      {/* Footer / Botón */}
      <div className="mt-8 pt-4 border-t border-gray-100 dark:border-zinc-800/50">
        <Button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3.5 rounded-md text-base font-bold shadow-lg shadow-primary/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                isSubmitting 
                ? "bg-gray-300 dark:bg-zinc-700 cursor-not-allowed text-gray-500 dark:text-gray-400" 
                : "bg-primary hover:bg-primary-700 text-white"
            }`}
        >
            {isSubmitting && <Loader2 className="animate-spin" size={20} />}
            {isSubmitting 
                ? "Procesando..." 
                : (form._id ? "Guardar Cambios" : "Crear Producto")
            }
        </Button>
      </div>
    </form>
  );
}
