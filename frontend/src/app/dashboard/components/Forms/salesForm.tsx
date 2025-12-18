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
      className="fixed inset-0 z-50 flex justify-center items-start overflow-y-auto bg-black/60 backdrop-blur-sm p-4 md:p-6 transition-all"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.35 }}
        className="relative w-full max-w-5xl bg-white dark:bg-[#18181b] rounded-md shadow-2xl my-4 md:my-8 border border-gray-200 dark:border-zinc-800 overflow-hidden"
      >
        <div className="relative flex items-center gap-5 p-6 sm:p-8 border-b border-gray-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
          <div className="p-3.5 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-md shadow-lg shadow-blue-500/20 transform hover:scale-105 transition-transform duration-300">
             <ShoppingCart className="w-7 h-7 text-white" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
             <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
               Registrar Nueva Venta
             </h3>
             <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
               Carga productos, selecciona cliente y método de pago
             </p>
          </div>

          <button
            onClick={onBack}
            className="group p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all"
          >
             <X size={24} />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
        <div className="bg-white dark:bg-[#18181b] rounded-md border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm">
          {/* Table Header (Desktop) */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50/80 dark:bg-zinc-900/80 border-b border-gray-200 dark:border-zinc-800 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
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
                <div key={i} className="p-4 md:px-6 md:py-3 grid grid-cols-1 md:grid-cols-12 gap-4 items-center hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 transition-colors group">
                  
                  {/* Product Select */}
                  <div className="md:col-span-5 flex flex-col gap-2">
                     <span className="md:hidden text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Producto</span>
                     <div className="relative">
                       <select
                          value={p.productId}
                          onChange={(e) => handleProductChange(i, "productId", e.target.value)}
                          className="w-full appearance-none rounded-md border border-gray-200 dark:border-zinc-700/50 bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-white px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                        >
                          <option value="">Seleccionar producto...</option>
                          {productsDB.map((prod) => (
                            <option key={prod._id} value={prod._id}>
                              {prod.name} — Stock: {prod.stock}
                            </option>
                          ))}
                          <option value="otro">Otro (manual)</option>
                        </select>
                     </div>
                      
                      {isOther && (
                        <input
                          type="text"
                          placeholder="Nombre del producto..."
                          value={p.name}
                          onChange={(e) => handleProductChange(i, "name", e.target.value)}
                          className="w-full rounded-md border border-gray-200 dark:border-zinc-700/50 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
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
                        className="w-full rounded-md border border-gray-200 dark:border-zinc-700/50 bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-white px-2 py-2.5 text-sm text-center font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                  </div>

                  {/* Price */}
                  <div className="md:col-span-3">
                     <span className="md:hidden text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 block">Precio</span>
                     <div className="w-full">
                        <FormattedPriceInput
                            name="price"
                            value={p.price}
                            disabled={!isOther && !!selectedProduct}
                            onChange={(e) => handleProductChange(i, "price", e.target.value)}
                        />
                     </div>
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-2 flex justify-end md:justify-center items-center">
                    <button
                      onClick={() => removeProductField(i)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all"
                      title="Quitar producto"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          <div className="p-3 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/30">
             <button
                onClick={addProductField}
                className="w-full py-2.5 flex items-center justify-center gap-2 text-primary font-semibold text-sm hover:bg-white dark:hover:bg-zinc-800 rounded-md transition-all border border-dashed border-primary/30 hover:border-primary/50"
             >
                <PlusCircle size={18} /> Agregar otro producto
             </button>
          </div>
        </div>

          <div className="bg-gray-50 dark:bg-zinc-900/30 p-6 rounded-md border border-gray-200 dark:border-zinc-800 shadow-sm">
            <label className="text-gray-700 dark:text-gray-300 flex items-center gap-2 font-semibold mb-3">
              <CreditCard className="w-5 h-5 text-gray-400" />
              Método de pago
            </label>

            <div className="relative">
                <select
                value={newSale.paymentMethod}
                onChange={(e) =>
                    setNewSale({ ...newSale, paymentMethod: e.target.value })
                }
                    className="w-full appearance-none rounded-md border border-gray-200 dark:border-zinc-700/50 px-4 py-3 bg-white dark:bg-zinc-800/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium cursor-pointer"
                >
                <option value="efectivo" className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white">Efectivo</option>
                <option value="tarjeta" className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white">Tarjeta</option>
                <option value="transferencia" className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white">Transferencia</option>
                <option value="mercado pago" className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white">Mercado Pago</option>
                <option value="cuenta corriente" className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white">Cuenta Corriente</option>
                <option value="otro" className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white">Otro</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
          </div>


          <div className="bg-gray-50 dark:bg-zinc-900/30 p-6 rounded-md border border-gray-200 dark:border-zinc-800 shadow-sm">
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

          <div className="flex flex-col md:flex-row justify-end items-end md:items-center gap-6 mt-8 p-6 bg-gray-50 dark:bg-zinc-900/30 rounded-md border border-dotted border-gray-300 dark:border-zinc-700">
            <span className="text-lg font-medium text-gray-500 dark:text-gray-400 block">
                {newSale.amountPaid !== undefined && newSale.amountPaid < newSale.products.reduce((acc, p) => acc + (Number(p.quantity) || 0) * (Number(p.price) || 0), 0) 
                    ? "Monto a abonar hoy:" 
                    : "Total de la venta:"}
            </span>
            <div className="flex flex-col items-end md:items-end gap-1">
              <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                {formatCurrency(
                  newSale.amountPaid !== undefined 
                  ? newSale.amountPaid 
                  : newSale.products.reduce((acc, p) => acc + (Number(p.quantity) || 0) * (Number(p.price) || 0), 0)
                )}
              </span>
              
              {newSale.amountPaid !== undefined && newSale.amountPaid < newSale.products.reduce((acc, p) => acc + (Number(p.quantity) || 0) * (Number(p.price) || 0), 0) && (
                <span className="text-sm text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-md">
                    Total real: {formatCurrency(newSale.products.reduce((acc, p) => acc + (Number(p.quantity) || 0) * (Number(p.price) || 0), 0))}
                </span>
              )}
            </div>           
          </div>

          <div className="pb-8 px-2">
            <motion.button
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                onClick={handleSubmit}
                className="w-full py-4 bg-primary hover:bg-primary-700 text-white font-bold text-lg rounded-md shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
                <ShoppingCart className="w-6 h-6" />
                {loading ? "Procesando venta..." : "Registrar venta"}
            </motion.button>
          </div>
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
