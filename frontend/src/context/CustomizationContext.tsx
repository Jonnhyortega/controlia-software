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
    // Initial local theme check
    const localTheme = typeof window !== "undefined" ? localStorage.getItem("theme") as "light" | "dark" : null;
    
    // If not logged in yet, we can at least apply local theme?
    if (localTheme) {
        const temp = { ...defaultSettings, theme: localTheme };
        applyTheme(temp);
        setSettings(temp);
    }

    if (!user) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await getCustomization();
        // Merge with defaults
        const merged = { ...defaultSettings, ...res };
        
        // Prioritize Local Storage for Theme if present
        if (localTheme) {
            merged.theme = localTheme;
        }

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
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    // Toggle Dark Mode Class
    if (data.theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Set Primary Color
    root.style.setProperty("--primary-color", data.primaryColor || "#2563eb");
    
    // Optional: Secondary
    if (data.secondaryColor) {
      root.style.setProperty("--secondary-color", data.secondaryColor);
    }
  };

  const updateSettings = async (newSettings: Partial<CustomizationData>) => {
    try {
      // Optimistic update
      const updated = { ...settings, ...newSettings };
      setSettings(updated);
      applyTheme(updated);

      // Persist Theme locally
      if (newSettings.theme) {
          localStorage.setItem("theme", newSettings.theme);
      }

      // If modification is ONLY theme, and user is NOT admin, skip API call
      if (newSettings.theme && Object.keys(newSettings).length === 1 && user?.role !== 'admin') {
          return;
      }

      // Persist to API
      const { businessName, businessEmail, businessPhone, ...payload } = updated;
      
      // If user is employee, they might trigger 403 if they try to save global settings.
      // But we handled the common case (theme toggle) above.
      // If they try to change something else, we let it fail or handled by backend.
      if (user?.role === 'admin') {
          await updateCustomization(payload);
      } else {
         // Employee safety: Don't call updateCustomization unless we are sure?
         // For now, only Admin persists global config.
      }

    } catch (error) {
      toast.error("Error al actualizar configuración");
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
