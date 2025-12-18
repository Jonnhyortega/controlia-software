"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Hash,
  DollarSign,
  PlusCircle,
  Trash2,
  CreditCard,
  ShoppingCart,
  X,
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
import { useAuth } from "../../../../context/authContext";
import { useCustomization } from "../../../../context/CustomizationContext";
import ProductSearch from "./ProductSearch";
import ClientSearch from "./ClientSearch"; // Import NEW
import { FormattedPriceInput } from "../../../../components/FormattedPriceInput";

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
  const { user } = useAuth();
  const { formatCurrency } = useCustomization();

  const [productsDB, setProductsDB] = useState<any[]>([]);
  const [clientsDB, setClientsDB] = useState<any[]>([]); // NEW State
  const [newSale, setNewSale] = useState<{
    paymentMethod: string;
    clientId: string;
    products: any[];
    amountPaid?: number;
  }>({
    paymentMethod: "efectivo",
    clientId: "", 
    products: [{ productId: "", name: "", quantity: 1, price: 0 }],
    amountPaid: undefined
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

  // Cargar productos y clientes
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [prodRes, clientRes] = await Promise.all([
             api.get("/products"),
             api.get("/clients")
        ]);
        setProductsDB(prodRes.data || []);
        setClientsDB(clientRes.data || []);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        toast.error("Error al cargar datos necesarios.");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchData();
  }, [user]);


  useEffect(() => {
    if (!scannedCode) return;
    if (!productsDB.length) return; // Esperar a que los productos estén cargados
    
    handleSaleBarcodeDetected(scannedCode);
    onScannedConsumed?.();
  }, [scannedCode, productsDB]);

  const BarcodeScanner = useMemo(
    () =>
      dynamic(() => import("../BarcodeScanner"), {
        ssr: false,
        loading: () => <Loading />,
      }),
    []
  );

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

  const validateSaleForm = () => {
    if (!newSale.paymentMethod || newSale.paymentMethod.trim() === "") {
      return "Seleccioná un método de pago.";
    }

    // Validar deuda sin cliente
    const total = newSale.products.reduce((acc, p) => acc + (Number(p.quantity) || 0) * (Number(p.price) || 0), 0);
    const paid = newSale.amountPaid !== undefined ? newSale.amountPaid : total;
    if (paid < total && !newSale.clientId) {
      return "Para generar deuda (pago parcial) debés seleccionar un cliente.";
    }

    if (!newSale.products.length) {
      return "La venta debe incluir al menos un producto.";
    }

    const seenProducts = new Set();

    for (const p of newSale.products) {
      if (!p.productId || p.productId.trim() === "") {
        return "Hay un producto sin seleccionar.";
      }
      if (p.productId === "otro" && (!p.name || p.name.trim() === "")) {
        return "Ingresá un nombre para el producto manual.";
      }
      if (!p.quantity || Number(p.quantity) <= 0) {
        return "La cantidad debe ser mayor a 0.";
      }
      if (!p.price || Number(p.price) < 0) { // Changed to allow 0 price theoretically, but kept logic mostly same.
        return "El precio debe ser mayor o igual a 0.";
      }

      if (p.productId !== "otro") {
        if (seenProducts.has(p.productId)) {
          return "Hay productos duplicados en la venta.";
        }
        seenProducts.add(p.productId);
      }

      if (p.productId !== "otro") {
          const dbProd = productsDB.find((item) => item._id === p.productId);
          if (!dbProd) return "Error interno: producto inexistente.";

          if (Number(p.quantity) > dbProd.stock) {
            return `No hay stock suficiente de ${dbProd.name}.`;
          }
      }
    }

    return null;
  };

  const handleSubmit = async () => {
    if (loading) return;

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
            try {
              const prodRes = await api.get("/products");
              setProductsDB(prodRes.data || []);
            } catch (err) {
              console.warn("No se pudo refrescar producs:", err);
            }
          });


          toast.success("✅ Venta registrada correctamente.");
          onBack();
        } catch (error: any) {
          console.error("Error al registrar:", error);
          const msg = error?.response?.data?.message || error?.message || "Error desconocido.";
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
    <motion.div
      key="add-sale"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex justify-center items-start overflow-y-auto bg-black/60 backdrop-blur-md p-4 md:p-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.35 }}
        className="relative w-full max-w-5xl bg-gray-100 dark:bg-[#09090b] rounded-md shadow-2xl my-4 md:my-8 p-6 md:p-8 border border-white/20 dark:border-zinc-800"
      >
        <div className="relative flex justify-between items-center mb-6 pb-3 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <ShoppingCart className="text-primary w-7 h-7" />
            <h3 className="font-display text-2xl font-semibold text-gray-800 dark:text-white">
              Registrar nueva venta
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="group p-2 rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 text-gray-600 dark:text-gray-300 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white transition-all shadow-sm"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <ProductSearch products={productsDB} onSelect={addProductToSale} />

        <div className="space-y-8">
        <div className="bg-white dark:bg-zinc-900/50 rounded-md border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm">
          {/* Table Header (Desktop) */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 bg-gray-200 dark:bg-zinc-800/80 border-b border-gray-200 dark:border-zinc-800 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <div className="col-span-5">Producto</div>
            <div className="col-span-2 text-center">Cant.</div>
            <div className="col-span-3 text-right pr-4">Precio Unit.</div>
            <div className="col-span-2 text-center">Acciones</div>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-zinc-800/50">
            {newSale.products.map((p, i) => {
              const isOther = p.productId === "otro";
              const selectedProduct = productsDB.find((item) => item._id === p.productId);

              return (
                <div key={i} className="p-3 md:px-4 md:py-2 grid grid-cols-1 md:grid-cols-12 gap-3 items-start md:items-center hover:bg-gray-200 dark:hover:bg-zinc-800/30 transition-colors group">
                  
                  {/* Product Select */}
                  <div className="md:col-span-5 flex flex-col gap-2">
                     <span className="md:hidden text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Producto</span>
                     <select
                        value={p.productId}
                        onChange={(e) => handleProductChange(i, "productId", e.target.value)}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/50"
                      >
                        <option value="">Seleccionar producto</option>
                        {productsDB.map((prod) => (
                          <option key={prod._id} value={prod._id}>
                            {prod.name} — Stock: {prod.stock}
                          </option>
                        ))}
                        <option value="otro">Otro (manual)</option>
                      </select>
                      
                      {isOther && (
                        <input
                          type="text"
                          placeholder="Nombre del producto..."
                          value={p.name}
                          onChange={(e) => handleProductChange(i, "name", e.target.value)}
                          className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent dark:text-white px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary-400/50"
                        />
                      )}
                  </div>

                  {/* Quantity */}
                  <div className="md:col-span-2">
                     <span className="md:hidden text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 block">Cantidad</span>
                     <input
                        type="number"
                        min={1}
                        value={p.quantity}
                        onChange={(e) => handleProductChange(i, "quantity", e.target.value)}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white px-2 py-1.5 text-sm text-center focus:ring-2 focus:ring-primary-400/50"
                      />
                  </div>

                  {/* Price */}
                  <div className="md:col-span-3">
                     <span className="md:hidden text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 block">Precio</span>
                     <FormattedPriceInput
                        name="price"
                        value={p.price}
                        disabled={!isOther && !!selectedProduct}
                        onChange={(e) => handleProductChange(i, "price", e.target.value)}
                     />
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-2 flex justify-end md:justify-center items-center">
                    <button
                      onClick={() => removeProductField(i)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all"
                      title="Quitar producto"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          <div className="p-2 border-t border-gray-200 dark:border-zinc-800 bg-gray-200 dark:bg-zinc-800/30">
             <button
                onClick={addProductField}
                className="w-full py-2 flex items-center justify-center gap-2 text-primary font-medium text-sm hover:bg-white dark:hover:bg-zinc-800 rounded-md transition-all border border-transparent hover:border-gray-200 dark:hover:border-zinc-700 hover:shadow-sm"
             >
                <PlusCircle size={16} /> Agregar otra línea
             </button>
          </div>
        </div>

          <div className="bg-gray-200 dark:bg-muted/10 p-5 rounded-md space-y-4 border border-gray-200 dark:border-border shadow-sm">
            <label className="text-gray-700 dark:text-gray-300 flex items-center gap-2 font-medium">
              <CreditCard className="w-5 h-5 text-gray-500" />
              Método de pago
            </label>

            <select
              value={newSale.paymentMethod}
              onChange={(e) =>
                setNewSale({ ...newSale, paymentMethod: e.target.value })
              }
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-[#1a1a1a] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-200"
            >
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
              <option value="mercado pago">Mercado Pago</option>
              <option value="cuenta corriente">Cuenta Corriente</option>
              <option value="otro">Otro</option>
            </select>
          </div>


          <div className="bg-gray-200 dark:bg-muted/10 p-5 rounded-md border border-gray-200 dark:border-border shadow-sm">
             <ClientSearch 
                clients={clientsDB}
                selectedClientId={newSale.clientId}
                onSelect={(client) => setNewSale({ 
                  ...newSale, 
                  clientId: client ? client._id : "",
                  // Si deseleccionan cliente, reseteamos el pago al total (undefined = total)
                  amountPaid: client ? newSale.amountPaid : undefined 
                })}
             />

              {/* 💵 PAGO PARCIAL / CUENTA CORRIENTE */}
              {newSale.clientId && (
                <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                        <div className="flex-1 w-full">
                           <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                             Monto que abona hoy:
                           </label>
                           <div className="relative">
                              <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 w-4 h-4" />
                              <input 
                                type="number" 
                                min={0}
                                max={newSale.products.reduce((acc, p) => acc + (Number(p.quantity) || 0) * (Number(p.price) || 0), 0)}
                                value={newSale.amountPaid !== undefined ? newSale.amountPaid : newSale.products.reduce((acc, p) => acc + (Number(p.quantity) || 0) * (Number(p.price) || 0), 0)}
                                onChange={(e) => {
                                   const val = Number(e.target.value);
                                   const total = newSale.products.reduce((acc, p) => acc + (Number(p.quantity) || 0) * (Number(p.price) || 0), 0);
                                   // Prevent paying more than total
                                   if (val > total) return;
                                   setNewSale({ ...newSale, amountPaid: val });
                                }}
                                className="w-full pl-9 pr-4 py-2 rounded-md bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 outline-none transition font-mono font-medium"
                              />
                           </div>
                        </div>

                        <div className="flex-1 w-full p-3 bg-red-50 dark:bg-red-900/10 rounded-md border border-red-100 dark:border-red-900/20">
                             <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest block mb-0.5">
                               Se genera deuda
                             </span>
                             <span className="text-xl font-bold text-red-700 dark:text-red-300">
                                {formatCurrency(
                                  Math.max(0, newSale.products.reduce((acc, p) => acc + (Number(p.quantity) || 0) * (Number(p.price) || 0), 0) - (newSale.amountPaid !== undefined ? newSale.amountPaid : newSale.products.reduce((acc, p) => acc + (Number(p.quantity) || 0) * (Number(p.price) || 0), 0)))
                                )}
                             </span>
                        </div>
                    </div>
                </div>
              )}
          </div>

          <div className="flex flex-col md:flex-row justify-end items-end md:items-center gap-4 mt-6 p-4 bg-gray-200 dark:bg-muted/10 rounded-md border border-gray-200 dark:border-border">
            <span className="text-lg font-medium text-gray-600 dark:text-gray-300 block">
                {newSale.amountPaid !== undefined && newSale.amountPaid < newSale.products.reduce((acc, p) => acc + (Number(p.quantity) || 0) * (Number(p.price) || 0), 0) 
                    ? "Abonando hoy:" 
                    : "Total a pagar:"}
            </span>
            <div className="flex flex-col items-center justify-between">
              <span className=" text-3xl font-bold text-gray-900 dark:text-green-700">
                {formatCurrency(
                  newSale.amountPaid !== undefined 
                  ? newSale.amountPaid 
                  : newSale.products.reduce((acc, p) => acc + (Number(p.quantity) || 0) * (Number(p.price) || 0), 0)
                )}
              </span>
              
              {newSale.amountPaid !== undefined && newSale.amountPaid < newSale.products.reduce((acc, p) => acc + (Number(p.quantity) || 0) * (Number(p.price) || 0), 0) && (
                <span className="text-sm text-red-800 font-[300]">
                    Total venta: {formatCurrency(newSale.products.reduce((acc, p) => acc + (Number(p.quantity) || 0) * (Number(p.price) || 0), 0))}
                </span>
              )}
            </div>           
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            onClick={handleSubmit}
            className="w-full mt-6 py-3 bg-primary hover:bg-primary-700 text-white font-semibold rounded-md shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-5 h-5" />
            {loading ? "Guardando..." : "Registrar venta"}
          </motion.button>
        </div>

        <ConfirmDialog
          open={confirmDialog.open}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText="Confirmar"
          cancelText="Cancelar"
          onConfirm={confirmDialog.onConfirm}
          onCancel={confirmDialog.onCancel}
        />
        {scannerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="max-w-3xl w-full rounded-md p-4">
              <BarcodeScanner onDetected={handleSaleBarcodeDetected} onClose={() => setScannerOpen(false)} />
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
