"use client";
import { useState, useEffect } from "react";
import { getTodayDailySales } from "../../../utils/api";

export function useSales() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    try {
      // Usamos el endpoint que obtiene (o crea) la caja de "hoy" según el backend
      const res = await getTodayDailySales();
      setData(res);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  return { data, loading, reload };
}
