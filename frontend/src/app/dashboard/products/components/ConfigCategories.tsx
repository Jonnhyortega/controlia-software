"use client";

import { useEffect, useState } from "react";
import { X, Plus, Trash2, Undo2 } from "lucide-react";
import { getCustomization, updateCustomization } from "../../../../utils/api";
import { ConfirmDialog } from "../../components/confirmDialog";
import { useToast } from "../../../../context/ToastContext";
import Loading from "../../../../components/loading";

interface Props {
  onClose: () => void;
  reloadCategories: () => Promise<void>;
}

export default function ConfigCategories({ onClose, reloadCategories }: Props) {
  const toast = useToast();

  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");

  const [loadingCategories, setLoadingCategories] = useState(true);

  // Estado para confirm dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  // Cargar categorías
  useEffect(() => {
    (async () => {
      try {
        const data = await getCustomization();
        setCategories(data.categories || []);
      } catch {
        toast.error("Error al cargar categorías");
      } finally {
        setLoadingCategories(false);
      }
    })();
  }, []);

  // 👉 Agregar categoría
    const handleAdd = async () => {
      if (!newCategory.trim()) return;

      const updated = [...categories, newCategory.trim()];
      setCategories(updated);
      setNewCategory("");

      await updateCustomization({ categories: updated });

      await reloadCategories(); // ← FALTABA ESTO

      toast.success("Categoría agregada correctamente");
    };


  // 👉 Abrir diálogo de confirmación
  const askDelete = (cat: string) => {
    setCategoryToDelete(cat);
    setConfirmOpen(true);
  };

  // 👉 Confirmar eliminación
    const confirmDelete = async () => {
      if (!categoryToDelete) return;

      const updated = categories.filter((c) => c !== categoryToDelete);
      setCategories(updated);
      setConfirmOpen(false);

      await updateCustomization({ categories: updated });

      await reloadCategories(); // ← FALTABA ESTO TAMBIÉN

      toast.success("Categoría eliminada");
    };

  return (
    <>
      {/* OVERLAY */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center"
        onClick={onClose}
      >
        <div
          className="relative bg-white p-6 rounded-2xl w-full max-w-md shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            <Undo2 size={30} />
          </button>

          <h2 className="text-xl font-extrabold text-primary mb-4 flex flex-col gap-1">
            Configuracion de Categorías
            <small className="text-sm font-[300] text-gray-600">Agrega categorias para identificar tus productos mas facilmente</small>
          </h2>

          {/* LOADER CUANDO ESTÁ CARGANDO */}
          {loadingCategories ? (
            <div className="flex justify-center items-center py-10">
              <Loading />
            </div>
          ) : (
            <>
              {/* Input agregar */}
              <div className="flex gap-2 mb-4">
                <input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Nueva categoría"
                  className="border px-3 py-2 rounded-lg flex-1"
                />
                <button
                  onClick={handleAdd}
                  className="bg-primary text-white px-3 rounded-lg hover:bg-primary-700"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Lista */}
              {categories.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  No hay categorías aún.
                </p>
              ) : (
                <ul className="space-y-2">
                  {categories.map((cat) => (
                    <li
                      key={cat}
                      className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-lg"
                    >
                      <span>{cat}</span>

                      <button
                        onClick={() => askDelete(cat)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>

      {/* CONFIRM DIALOG */}
      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar categoría"
        message="¿Seguro que querés eliminar esta categoría? Los productos no se eliminan, pero perderán esta asignación."
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
