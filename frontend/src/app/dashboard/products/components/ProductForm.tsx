"use client";
import { ScanBarcode } from "lucide-react";
import { Button } from "../../components/button";

interface ProductFormProps {
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  suppliers: any[];
  onSubmit: () => void;
  categories: string[];
  setShowCategories: React.Dispatch<React.SetStateAction<boolean>>;
  setScannerOpen: React.Dispatch<React.SetStateAction<boolean>>;

}




export function ProductForm({ form, setForm, suppliers, categories, setShowCategories, onSubmit, setScannerOpen }: ProductFormProps) {
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };



  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
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
          Categoría
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

      {/* 4️⃣ Fila de precios */}
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
          <input
            type="number"
            id="cost"
            name="cost"
            value={form.cost}
            onChange={handleChange}
            placeholder="Ej: 300"
            className="border rounded-md px-3 py-2 w-full"
          />
        </div>

        {/* Precio de venta */}
        <div className="space-y-1">
          <label htmlFor="price" className="text-sm font-medium text-gray-700">
            Precio venta
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Ej: 500"
            className="border rounded-md px-3 py-2 w-full"
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
            value={form.barcode}
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
        className="w-full bg-primary hover:bg-primary-700 text-white mt-4 py-3 rounded-md"
      >
        {form._id ? "Guardar cambios" : "Agregar producto"}
      </Button>
    </form>
  );
}
