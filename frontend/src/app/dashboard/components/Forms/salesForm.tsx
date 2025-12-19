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
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-[#09090b] overflow-hidden"
    >
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] shrink-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-lg shadow-blue-500/20">
            <ShoppingCart className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight leading-none">
              Registrar Nueva Venta
            </h3>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
              {newSale.products.length} {newSale.products.length === 1 ? 'producto cargado' : 'productos cargados'}
            </p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-zinc-700"
        >
          <X size={20} />
        </button>
      </div>

      {/* --- MAIN CONTENT (Split View) --- */}
      <div className="flex flex-1 overflow-hidden relative flex-col md:flex-row">
        
        {/* --- LEFT PANEL: Product List (Flexible) --- */}
        <div className="flex-1 flex flex-col bg-white dark:bg-[#09090b] relative overflow-hidden order-2 md:order-1">
          
          {/* Table Header (Sticky) */}
          <div className="hidden md:grid grid-cols-12 gap-3 px-6 py-2 bg-gray-50/90 dark:bg-zinc-900/90 border-b border-gray-200 dark:border-zinc-800 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest backdrop-blur-sm z-10 sticky top-0">
            <div className="col-span-5 pl-2">Producto</div>
            <div className="col-span-2 text-center">Cant.</div>
            <div className="col-span-3 text-right pr-2">Precio Unit.</div>
            <div className="col-span-2 text-center"></div>
          </div>

          {/* Scrollable List */}
          <div className="flex-1 overflow-y-auto px-2 md:px-4 py-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-zinc-800">
            {newSale.products.map((p, i) => {
              const isOther = p.productId === "otro";
              const selectedProduct = productsDB.find((item) => item._id === p.productId);

              return (
                <div 
                  key={i} 
                  className="group grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 items-center p-2 rounded-md hover:bg-blue-50/50 dark:hover:bg-blue-900/10 border border-transparent hover:border-blue-100 dark:hover:border-blue-800/30 transition-all"
                >
                  
                  {/* Product Select */}
                  <div className="md:col-span-5 flex flex-col gap-1.5">
                      <span className="md:hidden text-[10px] font-bold text-gray-500 uppercase">Producto</span>
                      <div className="relative">
                        <select
                          value={p.productId}
                          onChange={(e) => handleProductChange(i, "productId", e.target.value)}
                          className={`w-full appearance-none rounded-md border ${isOther ? 'border-blue-300 dark:border-blue-700' : 'border-gray-200 dark:border-zinc-700'} bg-white dark:bg-zinc-900/50 text-gray-900 dark:text-white px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer`}
                        >
                          <option value="">Seleccionar...</option>
                          {productsDB.map((prod) => (
                            <option 
                              key={prod._id} 
                              value={prod._id}
                              className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                            >
                              {prod.name}
                            </option>
                          ))}
                          <option value="otro">➕ Otro (Manual)</option>
                        </select>
                      </div>
                      
                      {isOther && (
                        <input
                          type="text"
                          autoFocus
                          placeholder="Nombre del producto..."
                          value={p.name}
                          onChange={(e) => handleProductChange(i, "name", e.target.value)}
                          className="w-full rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 shadow-sm"
                        />
                      )}
                  </div>

                  {/* Quantity */}
                  <div className="md:col-span-2">
                      <span className="md:hidden text-[10px] font-bold text-gray-500 uppercase mb-1 block">Cant.</span>
                      <input
                        type="number"
                        min={1}
                        value={p.quantity}
                        onChange={(e) => handleProductChange(i, "quantity", e.target.value)}
                        className="w-full rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white px-2 py-1.5 text-sm text-center font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      />
                  </div>

                  {/* Price */}
                  <div className="md:col-span-3">
                      <span className="md:hidden text-[10px] font-bold text-gray-500 uppercase mb-1 block">Precio</span>
                      <div className="w-full">
                        <FormattedPriceInput
                            name="price"
                            value={p.price}
                            disabled={!isOther && !!selectedProduct}
                            onChange={(e) => handleProductChange(i, "price", e.target.value)}
                            className="py-1.5 text-sm"
                        />
                      </div>
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-2 flex justify-end md:justify-center items-center">
                    <button
                      onClick={() => removeProductField(i)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                      title="Quitar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                </div>
              );
            })}
            
            <div className="pt-2 pb-6 px-1">
              <button
                  onClick={addProductField}
                  className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-zinc-800 hover:border-blue-400 dark:hover:border-blue-600 rounded-lg flex items-center justify-center gap-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all group"
              >
                  <PlusCircle size={18} className="group-hover:scale-110 transition-transform" /> 
                  <span className="font-semibold text-sm">Agregar línea vacía</span>
              </button>
            </div>
          </div>
        </div>

        {/* --- RIGHT PANEL: Controls (Sidebar) --- */}
        <div className="w-full md:w-[400px] xl:w-[450px] bg-gray-50 dark:bg-[#121212] border-t md:border-t-0 md:border-l border-gray-200 dark:border-zinc-800 flex flex-col shrink-0 z-20 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.05)] order-1 md:order-2 h-[40vh] md:h-auto">
           
           <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6">
              
              {/* Payment Method */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <CreditCard size={14} /> Método de pago
                </label>
                <div className="relative">
                    <select
                      value={newSale.paymentMethod}
                      onChange={(e) => setNewSale({ ...newSale, paymentMethod: e.target.value })}
                      className="w-full appearance-none rounded-lg border border-gray-300 dark:border-zinc-700 px-4 py-2.5 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium cursor-pointer shadow-sm text-sm"
                    >
                      <option value="efectivo">Efectivo</option>
                      <option value="tarjeta">Tarjeta</option>
                      <option value="transferencia">Transferencia</option>
                      <option value="mercado pago">Mercado Pago</option>
                      <option value="cuenta corriente">Cuenta Corriente</option>
                      <option value="otro">Otro</option>
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
              </div>

              {/* Client Search */}
              <div className="space-y-3">
                 <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Hash size={14} /> Cliente
                 </label>
                 <div className="bg-white dark:bg-zinc-800 rounded-lg border border-gray-300 dark:border-zinc-700 shadow-sm p-1">
                    <ClientSearch 
                        clients={clientsDB}
                        selectedClientId={newSale.clientId}
                        onSelect={(client) => setNewSale({ 
                          ...newSale, 
                          clientId: client ? client._id : "",
                          amountPaid: client ? newSale.amountPaid : undefined 
                        })}
                    />
                 </div>
              </div>

               {/* Partial Payment Logic */}
               {newSale.clientId && (
                <div className="p-4 bg-white dark:bg-[#18181b] rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">
                          Monto a abonar hoy
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 w-4 h-4" />
                          <input 
                            type="number" 
                            min={0}
                            placeholder="Monto..."
                            value={(newSale.amountPaid !== undefined ? newSale.amountPaid : newSale.products.reduce((acc, p) => acc + (Number(p.quantity) || 0) * (Number(p.price) || 0), 0))}
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                const total = newSale.products.reduce((acc, p) => acc + (Number(p.quantity) || 0) * (Number(p.price) || 0), 0);
                                if (val > total) return;
                                setNewSale({ ...newSale, amountPaid: val });
                            }}
                            className="w-full pl-9 pr-4 py-2 rounded-md text-right bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none font-mono font-medium text-sm"
                          />
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/20">
                         <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase">
                           Genera Deuda
                         </span>
                         <span className="text-sm font-bold text-red-700 dark:text-red-300 font-mono">
                            {formatCurrency(
                              Math.max(0, newSale.products.reduce((acc, p) => acc + (Number(p.quantity) || 0) * (Number(p.price) || 0), 0) - (newSale.amountPaid !== undefined ? newSale.amountPaid : newSale.products.reduce((acc, p) => acc + (Number(p.quantity) || 0) * (Number(p.price) || 0), 0)))
                            )}
                         </span>
                    </div>
                </div>
               )}

           </div>

           {/* TOTAL & SUBMIT (Bottom Fixed) */}
           <div className="p-5 md:p-6 bg-white dark:bg-[#18181b] border-t border-gray-200 dark:border-zinc-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-30">
              <div className="flex flex-col gap-1 mb-4">
                  <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
                      <span className="text-sm font-medium">
                        {newSale.amountPaid !== undefined && newSale.amountPaid < newSale.products.reduce((acc, p) => acc + (Number(p.quantity) || 0) * (Number(p.price) || 0), 0) 
                         ? "Total a pagar hoy:" 
                         : "Total Venta:"}
                      </span>
                      {newSale.amountPaid !== undefined && newSale.amountPaid < newSale.products.reduce((acc, p) => acc + (Number(p.quantity) || 0) * (Number(p.price) || 0), 0) && (
                         <span className="text-xs text-gray-400 line-through">
                            {formatCurrency(newSale.products.reduce((acc, p) => acc + (Number(p.quantity) || 0) * (Number(p.price) || 0), 0))}
                         </span>
                      )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {formatCurrency(
                        newSale.amountPaid !== undefined 
                        ? newSale.amountPaid 
                        : newSale.products.reduce((acc, p) => acc + (Number(p.quantity) || 0) * (Number(p.price) || 0), 0)
                        )}
                    </span>
                  </div>
              </div>

              <motion.button
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  onClick={handleSubmit}
                  className="w-full py-3.5 bg-primary hover:bg-primary-700 text-white font-bold text-base rounded-lg shadow-lg shadow-primary/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                  {loading ? (
                    <>Procesando...</>
                  ) : (
                    <>
                       <ShoppingCart className="w-5 h-5" /> Confirmar Venta
                    </>
                  )}
              </motion.button>
           </div>
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-2xl w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-zinc-800">
            <BarcodeScanner onDetected={handleSaleBarcodeDetected} onClose={() => setScannerOpen(false)} />
          </div>
        </div>
      )}
    </motion.div>
  );
}
