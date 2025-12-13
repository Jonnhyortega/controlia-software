"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getCustomization, updateCustomization } from "../utils/api";
import { useAuth } from "./authContext";
import { useToast } from "./ToastContext";

export interface CustomizationData {
  businessName: string;
  businessEmail?: string;
  businessPhone?: string;
  primaryColor: string;
  secondaryColor?: string;
  logoUrl?: string;
  currency: string; // "ARS", "USD", etc.
  theme: "light" | "dark";
  dateFormat: string;
  timeFormat: string;
  timezone?: string;
}

interface CustomizationContextType {
  settings: CustomizationData;
  loading: boolean;
  updateSettings: (newSettings: Partial<CustomizationData>) => Promise<void>;
  formatCurrency: (value: number) => string;
}

const defaultSettings: CustomizationData = {
  businessName: "Mi Comercio",
  primaryColor: "#2563eb",
  currency: "ARS",
  theme: "dark",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "HH:mm",
  timezone: "America/Argentina/Buenos_Aires",
};

const CustomizationContext = createContext<CustomizationContextType | null>(null);

export function CustomizationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const toast = useToast();
  const [settings, setSettings] = useState<CustomizationData>(defaultSettings);
  const [loading, setLoading] = useState(true);

  // 1. Fetch data on mount or when user changes
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await getCustomization();
        // Merge with defaults to avoid nulls
        const merged = { ...defaultSettings, ...res };
        setSettings(merged);
        applyTheme(merged);
      } catch (error) {
        console.error("Error loading customization:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  // 2. Apply theme to CSS Variables
  const applyTheme = (data: CustomizationData) => {
    const root = document.documentElement;

    // Toggle Dark Mode Class
    if (data.theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Set Primary Color
    // We can't easily generate infinite tailwind shades in runtime without a library like 'tinycolor2'
    // But we can set the main variable which we will map in tailwind.config.js
    root.style.setProperty("--primary-color", data.primaryColor || "#2563eb");
    
    // Optional: Secondary
    if (data.secondaryColor) {
      root.style.setProperty("--secondary-color", data.secondaryColor);
    }

    // Font or other variables can go here
  };

  const updateSettings = async (newSettings: Partial<CustomizationData>) => {
    try {
      // Optimistic update
      const updated = { ...settings, ...newSettings };
      setSettings(updated);
      applyTheme(updated);

      // Persist
      await updateCustomization(updated);
      
      // If businessName changed, we might want to refresh user? 
      // Actually userController.js already syncs User model, fetching fresh profile on reload handles it.

    } catch (error) {
      toast.error("Error al actualizar configuración");
      // Revert? (Complex for now, assume success)
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: settings.currency || "ARS",
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <CustomizationContext.Provider value={{ settings, loading, updateSettings, formatCurrency }}>
      {children}
    </CustomizationContext.Provider>
  );
}

export function useCustomization() {
  const context = useContext(CustomizationContext);
  if (!context) {
    throw new Error("useCustomization must be used within a CustomizationProvider");
  }
  return context;
}
