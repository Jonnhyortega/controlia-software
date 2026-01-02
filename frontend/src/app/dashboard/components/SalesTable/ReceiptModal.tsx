"use client";

import { motion } from "framer-motion";
import { X, Printer, Store, MapPin, Phone } from "lucide-react";
import { useAuth } from "../../../../context/authContext";
import { useEffect, useState } from "react";
import { useCustomization } from "../../../../context/CustomizationContext";

interface ReceiptModalProps {
  sale: any;
  onClose: () => void;
}

export default function ReceiptModal({ sale, onClose }: ReceiptModalProps) {
  const { user } = useAuth();
  const { formatCurrency, settings } = useCustomization();
  const [imgPerfil, setImgPerfil] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("");

  useEffect(() => {
    // 1. Cargar imagen de perfil del usuario si existe
    if(user?.logoUrl){
      setImgPerfil(user.logoUrl);
    }
    
    // 2. Fetch de perfil para asegurar el nombre de negocio actualizado (igual que Navbar)
    (async () => {
      try {
        const { getProfile } = await import("../../../../utils/api");
        const data = await getProfile();
        setBusinessName(data.businessName || data.name || "");
      } catch (err) {
        console.error("Error fetching profile for receipt", err);
      }
    })();
  },[user])
  
  if (!sale) return null;

  const formatDate = (dateString: string) => 
    new Date(dateString).toLocaleString("es-AR", { 
       day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" 
    });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:bg-white print:p-0">
      
      {/* Contenedor del Ticket */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-background w-full max-w-sm rounded-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh] print:shadow-none print:max-w-none print:w-full print:h-auto print:rounded-none"
      >
        {/* Header Modal (No imprimir) */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-200 dark:bg-[#1a1a1a] print:hidden">
            <h3 className="font-bold text-gray-700 dark:text-gray-300">Vista Previa de Ticket</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition text-gray-500 dark:text-gray-400">
                <X size={20} />
            </button>
        </div>

        {/* 🧾 EL TICKET */}
        <div className="p-6 flex-1 overflow-y-auto bg-white dark:bg-background text-black font-mono text-sm print:p-0 print:overflow-visible" id="printable-ticket">
            
            {/* Header Ticket */}
            <div className="text-center mb-6 border-b border-dashed border-gray-300 pb-4">
                <div className="flex justify-center mb-2">
                    {imgPerfil ? (
                        <img
                            src={imgPerfil}
                            alt="Perfil"
                            width={68}
                            height={68}
                            className="rounded-full cursor-pointer transition"
                        />
                        ) : (
                        <div className="w-12 h-12 bg-black text-gray-700 dark:text-gray-300 rounded-full flex items-center justify-center">
                            <Store size={24} />
                        </div>
                        )}
                </div>
                <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1 line-clamp-1">
                  {businessName || settings?.businessName || user?.businessName || "CONTROLIA STORE"}
                </h2>
                <div className="text-gray-800 dark:text-gray-500 text-xs flex flex-col gap-1 items-center">
                    <span className="flex items-center gap-1 text-center">
                       <MapPin size={10} className="flex-shrink-0" /> 
                       {user?.address || "Dirección no configurada"}
                    </span>
                    {/* <span className="flex items-center gap-1"><Phone size={10} /> +54 9 11 1234-5678</span> */}
                </div>
            </div>

            {/* Info Venta */}
            <div className="mb-4 text-xs space-y-1">
                <div className="flex justify-between">
                    <span className="text-gray-800 dark:text-gray-500">FECHA:</span>
                    <span className="text-gray-700 dark:text-gray-300 font-semibold">{formatDate(sale.date || sale.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-800 dark:text-gray-500">TICKET N°:</span>
                    <span className="text-gray-700 dark:text-gray-300 font-semibold">#{sale._id.slice(-6).toUpperCase()}</span>
                </div>
            </div>

            {/* Tabla Productos */}
            <div className="mb-4 border-b border-dashed border-gray-300 pb-4">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="pb-1 font-normal text-gray-800 dark:text-gray-500">CANT</th>
                            <th className="pb-1 font-normal text-gray-800 dark:text-gray-500">PROD</th>
                            <th className="pb-1 text-right font-normal text-gray-800 dark:text-gray-500">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs">
                        {sale.products.map((p: any, i: number) => {
                             const name = p.product?.name || p.description || "Producto Manual";
                             const price = p.price || p.product?.price || 0;
                             const subtotal = price * p.quantity;
                             return (
                                <tr key={i} className="align-top">
                                    <td className="py-1 font-bold text-gray-800 dark:text-gray-500">{p.quantity}</td>
                                    <td className="py-1 pr-2">
                                        <div className="font-semibold line-clamp-2 text-gray-800 dark:text-gray-500">{name}</div>
                                    </td>
                                    <td className="py-1 text-right font-bold text-gray-800 dark:text-gray-500">{formatCurrency(subtotal)}</td>
                                </tr>
                             );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Totales */}
            <div className="space-y-2 mb-6">
                <div className="flex justify-between text-base font-bold">
                    <span className="text-gray-800 dark:text-gray-500">TOTAL</span>
                    <span className="text-green-400 font-bold">{formatCurrency(sale.total)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                    <span className="text-gray-800 dark:text-gray-500">MÉTODO DE PAGO</span>
                    <span className="uppercase font-semibold text-gray-800 dark:text-gray-500">
                      {sale.amountPaid === 0 ? "—" : sale.paymentMethod}
                    </span>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center text-[10px] text-gray-400 mt-6">
                <p>¡Gracias por su compra!</p>
                <p className="mt-1">Conservar este ticket para cambios. Recuerde que el mismo no contiene valides fiscal.</p>
                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col items-center gap-1 opacity-60 print:opacity-100">
                    <div className="flex items-center gap-2 justify-center">
                        {/* Logo Controlia */}
                        <img src="/logosinfondo.png" alt="Controlia" className="h-5 w-auto object-contain grayscale" />
                        <span className="font-bold tracking-wide text-gray-600">CONTROLIA</span>
                    </div>
                    <p className="text-[8px] font-medium">www.gestioncontrolia.com</p>
                </div>
            </div>
            
        </div>

        {/* Footer Modal (Botón Imprimir) */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-200 dark:bg-[#1a1a1a] flex gap-3 print:hidden">
            <button 
                onClick={handlePrint}
                className="flex-1 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black font-bold py-3 rounded-md flex items-center justify-center gap-2 transition"
            >
                <Printer size={18} />
                IMPRIMIR
            </button>
        </div>

      </motion.div>
    </div>
  );
}
