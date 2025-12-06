"use client";
import { useState, useEffect } from "react";
import { getDailyCashByDate } from "../../../utils/api";

export function useSales() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    try {
      // Calcular fecha en Argentina (YYYY-MM-DD)
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Argentina/Buenos_Aires",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const argentinaDate = formatter.format(now); // YYYY-MM-DD
      
      const res = await getDailyCashByDate(argentinaDate);
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
