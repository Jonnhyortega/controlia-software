import { ScanBarcode, Loader2 } from "lucide-react";
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
                className="border rounded-md pl-8 pr-3 py-2 w-full bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                autoComplete="off"
            />
        </div>
    );
}


export function ProductForm({ form, setForm, suppliers, categories, setShowCategories, onSubmit, setScannerOpen, isSubmitting }: ProductFormProps) {
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
      className="bg-white p-6 rounded-2xl border-gray-100 space-y-4 flex flex-col"
    >
      <h2 className="text-2xl font-semibold text-primary w-full text-center">
        {form._id ? "Editar producto" : "Agregar producto"}
      </h2>

      {/* 1️⃣ Nombre */}
      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Ej: Alfajor Jorgito"
          required
          className="border rounded-md px-3 py-2 w-full"
        />
      </div>

      {/* 2️⃣ Categoría */}
      <div className="space-y-1">
        <label htmlFor="category" className="text-sm font-medium text-gray-700">
          Categoría (opcional)
        </label>

        {categories.length > 0 ? (
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border rounded-md px-3 py-2 w-full"
          >
            <option value="">Seleccionar categoría</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        ) : (
          <button
            type="button"
            onClick={() => setShowCategories(true)}
            className="border border-primary text-primary px-3 py-2 rounded-md w-full hover:bg-primary/10 transition"
          >
            Configurar categorías
          </button>
        )}

      </div>

      {/* 3️⃣ Proveedor */}
      <div className="space-y-1">
        <label htmlFor="supplier" className="text-sm font-medium text-gray-700">
          Proveedor
        </label>
        <select
          id="supplier"
          name="supplier"
          value={form.supplier}
          onChange={handleChange}
          className="border rounded-md px-3 py-2 w-full"
        >
          <option value="">Sin proveedor</option>
          {suppliers.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* 4️⃣ Fila de precios con nueva validación visual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Stock */}
        <div className="space-y-1">
          <label htmlFor="stock" className="text-sm font-medium text-gray-700">
            Stock inicial
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            placeholder="Ej: 20"
            className="border rounded-md px-3 py-2 w-full"
          />
        </div>

        {/* Costo */}
        <div className="space-y-1">
          <label htmlFor="cost" className="text-sm font-medium text-gray-700">
            Costo
          </label>
          <FormattedPriceInput
            id="cost"
            name="cost"
            value={form.cost}
            onChange={handleChange}
            placeholder="0"
          />
        </div>

        {/* Precio de venta */}
        <div className="space-y-1">
          <label htmlFor="price" className="text-sm font-medium text-gray-700">
            Precio venta
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

      {/* 5️⃣ Código de barras */}
      <div className="space-y-1">
        <label htmlFor="barcode" className="text-sm font-medium text-gray-700">
          Código de barras
        </label>

        <div className="flex gap-2">
          <input
            id="barcode"
            name="barcode"
            value={form.barcode || ""}
            onChange={handleChange}
            placeholder="Escanear o escribir código..."
            className="border rounded-md px-3 py-2 w-full"
          />

          <button
            type="button"
            onClick={() => setScannerOpen(true)}  // 👈 LLAMA AL SCANNER
            className="bg-primary text-white px-3 rounded-md hover:bg-primary-700"
          >
            <ScanBarcode />
          </button>
        </div>
      </div>


      {/* 6️⃣ Descripción */}
      <div className="space-y-1">
        <label htmlFor="description" className="text-sm font-medium text-gray-700">
          Descripción (opcional)
        </label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Notas adicionales del producto..."
          className="border rounded-md px-3 py-2 w-full"
        />
      </div>

      {/* 7️⃣ Botón submit */}
      <Button
        type="submit"
        disabled={isSubmitting} // 🔒 Deshabilitar
        className={`w-full text-white mt-4 py-3 rounded-md transition flex items-center justify-center gap-2 ${
            isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-primary-700"
        }`}
      >
        {isSubmitting && <Loader2 className="animate-spin" size={20} />}
        {isSubmitting 
            ? "Guardando..." 
            : (form._id ? "Guardar cambios" : "Agregar producto")
        }
      </Button>
    </form>
  );
}
