"use client";
import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSuppliers,
  getCustomization,
} from "../../../../utils/api";
import { useAuth } from "../../../../context/authContext";
import { useToast } from "../../../../context/ToastContext";

export function useProducts() {
  const toast = useToast();
  const { user } = useAuth();

  const [products, setProducts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [scannerOpen, setScannerOpen] = useState(false);
  const [foundProductForAdd, setFoundProductForAdd] = useState<any | null>(null);
  const [addStockQty, setAddStockQty] = useState(1);
  const [categories, setCategories] = useState<string[]>([]);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: 0,
    cost: 0,
    stock: 0,
    barcode: "",
    description: "",
    supplier: "",
  });

  // cargar productos y proveedores
    useEffect(() => {
      if (!user) return;

      async function load() {
        try {
          const [p, s, c] = await Promise.all([
            getProducts(),
            getSuppliers(),
            getCustomization(),
          ]);

          // 🔒 FILTER PRODUCTS BY USER ID (Frontend Patch)
          // The backend seems to return all products globally. We filter here to ensure isolation.
          const myProducts = p.filter((prod: any) => {
             const prodUserId = typeof prod.user === 'object' ? prod.user?._id : prod.user;
             return prodUserId === user?._id;
          });

          setProducts(myProducts);
          setSuppliers(s);
          setCategories(c.categories || []);
        } catch (err) {
          toast.error("Error cargando productos o proveedores");
        } finally {
          setLoading(false);
        }
      }
      load();
    }, [user]);


  const filtered = products.filter((p) => {
    const t = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(t) ||
      p.category.toLowerCase().includes(t) ||
      (p.supplier?.name || "").toLowerCase().includes(t)
    );
  });

    const reloadCategories = async () => {
    try {
      const c = await getCustomization();
      setCategories(c.categories || []);
    } catch {
      toast.error("No se pudieron cargar las categorías");
    }
  };


  const resetForm = () =>
    setForm({
      name: "",
      category: "",
      price: 0,
      cost: 0,
      stock: 0,
      barcode: "",
      description: "",
      supplier: "",
    });

  const handleSubmit = async () => {
    try {
      if (editingId) {
        const updated = await updateProduct(editingId, form);
        setProducts((prev) =>
          prev.map((p) => (p._id === editingId ? updated : p))
        );
        toast.success("Producto actualizado");
      } else {
        const created = await createProduct(form);
        setProducts((prev) => [...prev, created]);
        toast.success("Producto agregado");
      }
      resetForm();
      setEditingId(null);
      setShowForm(false);

    } catch(error: any) {
      console.error("Error guardando producto:", error);
      const msg = error.response?.data?.message || error.message || "";
      
      if (msg.includes("E11000") || msg.includes("duplicate key")) {
        toast.error("El código de barras ya existe en otro producto.");
      } else {
        toast.error(msg || "Error al guardar el producto");
      }
    }
  };

  const handleEdit = (p: any) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      category: p.category,
      price: p.price,
      cost: p.cost,
      stock: p.stock,
      barcode: p.barcode || "",
      description: p.description || "",
      supplier: p.supplier?._id || "",
    });
    setShowForm(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteTarget(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteProduct(deleteTarget!);
      setProducts((p) => p.filter((x) => x._id !== deleteTarget));
      toast.success("Producto eliminado");
    } catch {
      toast.error("Error al borrar");
    }
    setShowDeleteDialog(false);
  };

  const onBarcodeDetected = (code: string) => {
    const exists = products.find((p) => p.barcode === code);

    if (exists) {
      setFoundProductForAdd(exists);
      setScannerOpen(false);
      return;
    }

    setForm((f) => ({ ...f, barcode: code }));
    toast.success(`Código escaneado: ${code}`);
    setScannerOpen(false);
  };

  const confirmAddStock = async () => {
    const p = foundProductForAdd;
    if (!p) return;

    const updated = await updateProduct(p._id, {
      stock: p.stock + addStockQty,
    });
    setProducts((prev) =>
      prev.map((x) => (x._id === updated._id ? updated : x))
    );
    toast.success(`Stock actualizado`);
    setFoundProductForAdd(null);
    setAddStockQty(1);
  };

  return {
    products,
    suppliers,
    loading,
    filtered,
    form,
    setForm,
    showForm,
    setShowForm,
    handleSubmit,
    handleEdit,

    searchTerm,
    setSearchTerm,

    deleteTarget,
    showDeleteDialog,
    confirmDelete,
    setShowDeleteDialog,
    handleDeleteClick,

    scannerOpen,
    setScannerOpen,
    onBarcodeDetected,

    foundProductForAdd,
    setFoundProductForAdd,
    addStockQty,
    setAddStockQty,
    confirmAddStock,

    categories,
    setCategories,
    reloadCategories,

  };
}
