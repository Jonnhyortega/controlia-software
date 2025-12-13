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

  useEffect(()=>{
    if(user?.logoUrl){
      setImgPerfil(user.logoUrl);
    }
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
        className="bg-white w-full max-w-sm rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] print:shadow-none print:max-w-none print:w-full print:h-auto print:rounded-none"
      >
        {/* Header Modal (No imprimir) */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50 print:hidden">
            <h3 className="font-bold text-gray-700">Vista Previa de Ticket</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition text-gray-500">
                <X size={20} />
            </button>
        </div>

        {/* 🧾 EL TICKET */}
        <div className="p-6 flex-1 overflow-y-auto bg-white font-mono text-sm print:p-0 print:overflow-visible" id="printable-ticket">
            
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
                        <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                            <Store size={24} />
                        </div>
                        )}
                </div>
                <h2 className="text-xl font-bold uppercase tracking-wider mb-1 line-clamp-1">
                  {(settings?.businessName && settings.businessName !== "Mi Comercio" && settings.businessName.toUpperCase() !== "BUSSINES") ? settings.businessName : (user?.businessName || user?.name || "CONTROLIA STORE")}
                </h2>
                <div className="text-gray-500 text-xs flex flex-col gap-1 items-center">
                    <span className="flex items-center gap-1 text-center">
                       <MapPin size={10} className="flex-shrink-0" /> 
                       {user?.address || "Dirección no configurada"}
                    </span>
                    {/* <span className="flex items-center gap-1"><Phone size={10} /> +54 9 11 1234-5678</span> */}
                </div>
            </div>

            {/* Info Venta */}
            <div className="mb-4 text-xs text-gray-500 space-y-1">
                <div className="flex justify-between">
                    <span>FECHA:</span>
                    <span className="text-black font-semibold">{formatDate(sale.date || sale.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                    <span>TICKET N°:</span>
                    <span className="text-black font-semibold">#{sale._id.slice(-6).toUpperCase()}</span>
                </div>
            </div>

            {/* Tabla Productos */}
            <div className="mb-4 border-b border-dashed border-gray-300 pb-4">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-xs text-gray-400 border-b border-gray-100">
                            <th className="pb-1 font-normal">CANT</th>
                            <th className="pb-1 font-normal">PROD</th>
                            <th className="pb-1 text-right font-normal">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs">
                        {sale.products.map((p: any, i: number) => {
                             const name = p.product?.name || p.description || "Producto Manual";
                             const price = p.price || p.product?.price || 0;
                             const subtotal = price * p.quantity;
                             return (
                                <tr key={i} className="align-top">
                                    <td className="py-1 font-bold">{p.quantity}x</td>
                                    <td className="py-1 pr-2">
                                        <div className="font-semibold line-clamp-2">{name}</div>
                                    </td>
                                    <td className="py-1 text-right font-bold">{formatCurrency(subtotal)}</td>
                                </tr>
                             );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Totales */}
            <div className="space-y-2 mb-6">
                <div className="flex justify-between text-base font-bold">
                    <span>TOTAL</span>
                    <span>{formatCurrency(sale.total)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                    <span>MÉTODO DE PAGO</span>
                    <span className="uppercase font-semibold text-black">{sale.paymentMethod}</span>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center text-[10px] text-gray-400 mt-6">
                <p>¡Gracias por su compra!</p>
                <p className="mt-1">Conservar este ticket para cambios</p>
                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col items-center gap-1 opacity-60 print:opacity-100">
                    <div className="flex items-center gap-2 justify-center">
                        {/* Logo Controlia */}
                        <img src="/logosinfondo.png" alt="Controlia" className="h-5 w-auto object-contain grayscale" />
                        <span className="font-bold tracking-wide text-gray-600">CONTROLIA</span>
                    </div>
                    <p className="text-[8px] font-medium">controlia-software.vercel.app</p>
                </div>
            </div>
            
        </div>

        {/* Footer Modal (Botón Imprimir) */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3 print:hidden">
            <button 
                onClick={handlePrint}
                className="flex-1 bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition"
            >
                <Printer size={18} />
                IMPRIMIR
            </button>
             <button 
                onClick={onClose}
                className="px-4 border border-gray-200 hover:bg-white text-gray-700 font-semibold rounded-xl transition"
            >
                Cerrar
            </button>
        </div>

      </motion.div>
    </div>
  );
}
