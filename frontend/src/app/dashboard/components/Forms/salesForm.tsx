"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Undo2,
  Package,
  Hash,
  DollarSign,
  PlusCircle,
  Trash2,
  CreditCard,
  ShoppingCart,
} from "lucide-react";

import { ConfirmDialog } from "../../../dashboard/components/confirmDialog";
import dynamic from "next/dynamic";
import Loading from "../../../../components/loading";
import {
  validateStockBeforeSale,
  buildSalePayload,
  submitSale,
} from "../../../../utils/salesForm";
import { api, getDashboardData } from "../../../../utils/api";
import { useToast } from "../../../../context/ToastContext";
import ProductSearch from "./ProductSearch";

export default function SalesForm({
  onBack,
  onCreated,
  scannedCode,
  onScannedConsumed
}: {
  onBack: () => void;
  onCreated: (data: any) => void;
  scannedCode?: string | null;
  onScannedConsumed?: () => void;

}) {
  const toast = useToast();

  const [productsDB, setProductsDB] = useState<any[]>([]);
  const [newSale, setNewSale] = useState({
    paymentMethod: "efectivo",
    products: [{ productId: "", name: "", quantity: 1, price: 0 }],
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [scannerOpen, setScannerOpen] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: () => {},
    onCancel: () => {},
  });

  // Cargar productos del stock
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProductsDB(res.data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
        toast.error("Error al cargar productos.");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchProducts();
  }, []);


  useEffect(() => {
    if (!scannedCode) return;
    if (!productsDB.length) return; // Esperar a que los productos estén cargados
    
    handleSaleBarcodeDetected(scannedCode);
    onScannedConsumed?.();
  }, [scannedCode, productsDB]);




  // dynamic import - ensure we return the component (not the module) so types match
  const BarcodeScanner = useMemo(
    () =>
      dynamic(() => import("../BarcodeScanner"), {
        ssr: false,
        loading: () => <Loading />,
      }),
    []
  );




  // Función reutilizable para agregar producto
  const addProductToSale = (product: any) => {
    const products = [...newSale.products];

    // 1) ¿Ya existe este producto en la venta?
    const existingIndex = products.findIndex((p) => p.productId === product._id);

    if (existingIndex >= 0) {
      // Ya existe → aumentar cantidad
      products[existingIndex].quantity =
        Number(products[existingIndex].quantity) + 1;

      setNewSale({ ...newSale, products });
      toast.success(`Cantidad aumentada: ${product.name}`);
      return;
    }

    // 2) ¿Hay un slot vacío para completarlo?
    const emptyIndex = products.findIndex((p) => !p.productId);

    if (emptyIndex >= 0) {
      products[emptyIndex] = {
        productId: product._id,
        name: product.name,
        quantity: 1,
        price: product.price,
      };

      setNewSale({ ...newSale, products });
      toast.success(`Producto agregado: ${product.name}`);
      return;
    }

    // 3) No hay slots vacíos → agregar uno nuevo
    products.push({
      productId: product._id,
      name: product.name,
      quantity: 1,
      price: product.price,
    });

    setNewSale({ ...newSale, products });
    toast.success(`Producto agregado: ${product.name}`);
  };

  const handleSaleBarcodeDetected = (code: string) => {
    const found = productsDB.find(
      (p) => String(p.barcode || "") === String(code)
    );

    if (found) {
      addProductToSale(found);
      return;
    }

    // ========================
    // Producto NO encontrado
    // ========================
    const products = [...newSale.products];
    const emptyIndex = products.findIndex((p) => !p.productId);

    if (emptyIndex >= 0) {
      products[emptyIndex] = {
        productId: "otro",
        name: code,
        quantity: 1,
        price: 0,
      };
    } else {
      products.push({
        productId: "otro",
        name: code,
        quantity: 1,
        price: 0,
      });
    }

    setNewSale({ ...newSale, products });
    toast.info("Código no encontrado — agregado como producto manual");
  };



  const handleProductChange = (
    index: number,
    field: string,
    value: any
  ) => {
    const updated = [...newSale.products];
    (updated[index] as any)[field] = value;

    if (field === "productId") {
      const selected = productsDB.find((p) => p._id === value);
      if (selected) {
        updated[index].name = selected.name;
        updated[index].price = selected.price;
      } else {
        updated[index].name = "";
        updated[index].price = 0;
      }
    }

    setNewSale({ ...newSale, products: updated });
  };

  const addProductField = () => {
    setNewSale({
      ...newSale,
      products: [
        ...newSale.products,
        { productId: "", name: "", quantity: 1, price: 0 },
      ],
    });
  };

  const removeProductField = (index: number) => {
    const updated = newSale.products.filter((_, i) => i !== index);
    setNewSale({ ...newSale, products: updated });
  };

  // Validaciones frontend antes de confirmar
  const validateSaleForm = () => {
    if (!newSale.paymentMethod || newSale.paymentMethod.trim() === "") {
      return "Seleccioná un método de pago.";
    }

    if (!newSale.products.length) {
      return "La venta debe incluir al menos un producto.";
    }

    const seenProducts = new Set();

    for (const p of newSale.products) {
      // Producto elegido
      if (!p.productId || p.productId.trim() === "") {
        return "Hay un producto sin seleccionar.";
      }

      // Nombre obligatorio si es otro
      if (p.productId === "otro" && (!p.name || p.name.trim() === "")) {
        return "Ingresá un nombre para el producto manual.";
      }

      // Cantidad válida
      if (!p.quantity || Number(p.quantity) <= 0) {
        return "La cantidad debe ser mayor a 0.";
      }

      // Precio válido
      if (!p.price || Number(p.price) <= 0) {
        return "El precio debe ser mayor a 0.";
      }

      // Evitar duplicados (excepto “otro”)
      if (p.productId !== "otro") {
        if (seenProducts.has(p.productId)) {
          return "Hay productos duplicados en la venta.";
        }
        seenProducts.add(p.productId);
      }

      // Validación de stock si no es producto manual
      if (p.productId !== "otro") {
          const dbProd = productsDB.find((item) => item._id === p.productId);
          if (!dbProd) return "Error interno: producto inexistente.";

          if (Number(p.quantity) > dbProd.stock) {
            return `No hay stock suficiente de ${dbProd.name}.`;
          }
      }
    }

    return null; // Todo ok
  };

  // Registrar venta
  const handleSubmit = async () => {
    if (loading) return;

    // Validación antes de abrir confirmación
    const validationError = validateSaleForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setConfirmDialog({
      open: true,
      title: "Confirmar registro de venta",
      message: "¿Deseás registrar esta venta?",
      onConfirm: async () => {
        try {
          setLoading(true);

          // Validación de stock del backend helper
          const stockError = validateStockBeforeSale(
            productsDB,
            newSale.products
          );
          if (stockError) {
            toast.error(stockError);
            setLoading(false);
            setConfirmDialog((prev) => ({ ...prev, open: false }));
            return;
          }

          const payload = buildSalePayload(newSale);
          await submitSale(payload, async () => {
            onCreated({ ok: true });

            // refrescar productos localmente
            try {
              const prodRes = await api.get("/products");
              setProductsDB(prodRes.data || []);
            } catch (err) {
              console.warn("No se pudo refrescar products después de la venta:", err);
            }
          });


          toast.success("✅ Venta registrada correctamente.");
          onBack();
        } catch (error: any) {
          console.error("❌ Error al registrar venta:", error);
          const msg =
            error?.response?.data?.message ||
            error?.message ||
            "Error desconocido al registrar la venta.";
          toast.error(`❌ ${msg}`);
        } finally {
          setLoading(false);
          setConfirmDialog((prev) => ({ ...prev, open: false }));
        }
      },
      onCancel: () => setConfirmDialog((prev) => ({ ...prev, open: false })),
    });
  };

  if (initialLoading)
    return (
      <Loading
        fullscreen
        message="Cargando productos del inventario..."
      />
    );

  if (loading)
    return <Loading fullscreen message="Registrando venta..." />;

  return (
    // Overlay completo con backdrop blur
    <motion.div
      key="add-sale"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="
        fixed inset-0 z-[9999]
        overflow-y-auto
        w-full h-full
        bg-gray-200
      "
    >
      {/* Contenedor del formulario */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.35 }}
        className="
          w-full min-h-full
          p-8 relative
        "
      >
        {/* Encabezado */}
        <div className="relative flex justify-between items-center mb-6 pb-3 border-b border-gray-200 ">
          <div className="flex items-center gap-3">
            <ShoppingCart className="text-primary w-7 h-7" />
            <h3 className="font-display text-2xl font-semibold text-gray-800">
              Registrar nueva venta
            </h3>
          </div>

          <div className="flex items-center gap-2 fixed right-5 top-5 z-[10000]">
            <button
              onClick={onBack}
              className="
              group
              p-2 rounded-xl border border-gray-200
              text-gray-600 hover:text-gray-800
              hover:bg-red-600 transition
            "
            >
              <Undo2 className="w-8 h-8" color="black"/>
            </button>
          </div>
        </div>

        {/* Buscador de productos */}
        <ProductSearch products={productsDB} onSelect={addProductToSale} />

        {/* Formulario */}
        <div className="space-y-8">
        {newSale.products.map((p, i) => {
         const isOther = p.productId === "otro";
          const selectedProduct = productsDB.find(item => item._id === p.productId);

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="
                bg-white border border-gray-200 rounded-2xl shadow-sm 
                p-6 space-y-6 transition-all z-50
              "
            >

              {/* HEADER DEL PRODUCTO */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-gray-500" />
                  <h4 className="font-display text-lg text-gray-800">
                    Producto {i + 1}
                  </h4>
                </div>

                {i > 0 && (
                  <button
                    onClick={() => removeProductField(i)}
                    className="
                      text-red-600 hover:text-red-500
                      flex items-center gap-1 font-medium
                    "
                  >
                    <Trash2 className="w-4 h-4" /> Quitar
                  </button>
                )}
              </div>

              {/* GRID DE CAMPOS */}
              <div className="grid grid-cols-12 gap-5">

                {/* SELECT PRODUCTO */}
                <div className="col-span-12 md:col-span-6">
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">
                    Producto
                  </label>
                  <select
                    value={p.productId}
                    onChange={(e) =>
                      handleProductChange(i, "productId", e.target.value)
                    }
                    className="
                      w-full rounded-lg border border-gray-300 bg-white
                      px-3 py-2 text-gray-900
                      focus:outline-none focus:ring-2 focus:ring-primary-400
                    "
                  >
                    <option value="">Seleccionar producto</option>
                    {productsDB.map((prod) => (
                      <option key={prod._id} value={prod._id}>
                        {prod.name} — Stock: {prod.stock}
                      </option>
                    ))}
                    <option value="otro">Otro (manual)</option>
                  </select>
                </div>

                {/* NOMBRE MANUAL */}
                {isOther && (
                  <div className="col-span-12 md:col-span-6">
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">
                      Nombre del producto
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Cable HDMI 2m"
                      value={p.name}
                      onChange={(e) =>
                        handleProductChange(i, "name", e.target.value)
                      }
                      className="
                        w-full rounded-lg border border-gray-300 px-3 py-2
                        focus:outline-none focus:ring-2 focus:ring-primary-400
                      "
                    />
                  </div>
                )}

                {/* CANTIDAD */}
                <div className="col-span-12 md:col-span-3">
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={p.quantity}
                    onChange={(e) =>
                      handleProductChange(i, "quantity", e.target.value)
                    }
                    className="
                      w-full rounded-lg border border-gray-300 px-3 py-2
                        focus:outline-none focus:ring-2 focus:ring-primary-400
                    "
                  />
                </div>

                {/* PRECIO */}
                <div className="col-span-12 md:col-span-3">
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">
                    Precio
                  </label>
                  <input
                    type="number"
                    value={p.price}
                    disabled={!isOther && !!selectedProduct}
                    onChange={(e) =>
                      handleProductChange(i, "price", e.target.value)
                    }
                    className={`
                      w-full rounded-lg border border-gray-300 px-3 py-2
                        focus:outline-none focus:ring-2 focus:ring-primary-400
                      ${!isOther && !!selectedProduct ? "bg-gray-100 cursor-not-allowed" : ""}
                    `}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}


          {/* Botón agregar */}
          <button
            onClick={addProductField}
            className="
              flex items-center gap-2 text-blue-600 font-bold text-sm
              hover:underline
            "
          >
            <PlusCircle className="w-4 h-4" /> Agregar producto
          </button>

          {/* Método de pago */}
          <div
            className="
              bg-gray-50 p-5 rounded-xl space-y-4 
              border border-gray-200 shadow-sm
            "
          >
            <label className="text-gray-700 flex items-center gap-2 font-medium">
              <CreditCard className="w-5 h-5 text-gray-500" />
              Método de pago
            </label>

            <select
              value={newSale.paymentMethod}
              onChange={(e) =>
                setNewSale({ ...newSale, paymentMethod: e.target.value })
              }
                className="
                w-full rounded-lg border border-gray-300 px-3 py-2 bg-white
                focus:outline-none focus:ring-2 focus:ring-primary-200
              "
            >
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
              <option value="mercado pago">Mercado Pago</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          {/* Total Calculation */}
          <div className="flex justify-end items-center gap-4 mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <span className="text-lg font-medium text-gray-600">Total a pagar:</span>
            <span className="text-3xl font-bold text-primary">
              ${newSale.products.reduce((acc, p) => acc + (Number(p.quantity) || 0) * (Number(p.price) || 0), 0).toLocaleString("es-AR")}
            </span>
          </div>

          {/* Botón submit */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            onClick={handleSubmit}
            className="
              w-full mt-6 py-3
              bg-primary hover:bg-primary-700
              text-white font-semibold
              rounded-xl shadow-md
              flex items-center justify-center gap-2
              transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            <ShoppingCart className="w-5 h-5" />
            {loading ? "Guardando..." : "Registrar venta"}
          </motion.button>
        </div>

        {/* Confirm Dialog */}
        <ConfirmDialog
          open={confirmDialog.open}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText="Confirmar"
          cancelText="Cancelar"
          onConfirm={confirmDialog.onConfirm}
          onCancel={confirmDialog.onCancel}
        />
        {/* Scanner modal */}
        {scannerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="max-w-3xl w-full rounded-2xl p-4">
              <BarcodeScanner onDetected={handleSaleBarcodeDetected} onClose={() => setScannerOpen(false)} />
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
