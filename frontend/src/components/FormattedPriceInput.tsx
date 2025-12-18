"use client";

import React, { useState, useEffect } from "react";
import { useCustomization } from "../context/CustomizationContext";

interface FormattedPriceInputProps {
  value: number;
  onChange: (e: { target: { name: string; value: number } }) => void;
  name: string;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function FormattedPriceInput({
  value,
  onChange,
  name,
  placeholder,
  id,
  disabled = false,
}: FormattedPriceInputProps) {
  const { settings } = useCustomization();
  const symbol = settings.currency === "USD" ? "u$s" : "$";
  
  // Estado local para lo que el usuario ve
  const [localStr, setLocalStr] = useState("");

  useEffect(() => {
      // Sincronizar prop value (number) -> localStr (string formateado)
      // Ejemplo: 1000 -> "1.000"
      if (value === 0) {
           // Si el usuario borró todo, no poner 0 forzado si ya estaba vacío en local
           if (localStr === "") return; 
      }
      
      const formatted = new Intl.NumberFormat("es-AR", {
          useGrouping: true,
          maximumFractionDigits: 0,
      }).format(Number(value)); // Asegurar que value es number
      
      // Solo actualizamos si lo que hay en localStr no coincide numéricamente
      // Esto evita que si escribo "100" y value es 100, se formatee a "100" perdiendo el cursor o punto si existiera
      const currentNum = parseInt(localStr.replace(/\./g, "") || "0");
      if (currentNum !== Number(value)) {
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
      <div className="relative w-full">
          {/* Prefix with Currency Symbol */}
          <div className={`absolute left-1 top-1/2 -translate-y-1/2 bottom-0 w-10 flex items-center justify-center text-green-500 font-medium pointer-events-none z-10 ${disabled ? "text-gray-400" : ""}`}>
              {symbol}
          </div>
          
          <input
              type="text"
              id={id}
              name={name}
              value={localStr}
              onChange={handleChange}
              placeholder={placeholder}
              disabled={disabled}
              className={`border border-gray-200 dark:border-gray-700 rounded-md pl-3 pr-10 py-2 w-full transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-right
                ${disabled ? "bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed" : "bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white"}
              `}
              autoComplete="off"
          />
      </div>
  );
}
