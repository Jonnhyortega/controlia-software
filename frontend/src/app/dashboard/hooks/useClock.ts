"use client";

import { useState, useEffect } from "react";
import { useCustomization } from "../../../context/CustomizationContext"; // Adjust path if needed

export function useClock() {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const { settings } = useCustomization();

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const tz = settings.timezone || "America/Argentina/Buenos_Aires";
      
      try {
        setTime(
          now.toLocaleTimeString("es-AR", {
            timeZone: tz,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        );
        setDate(
          now.toLocaleDateString("es-AR", {
            timeZone: tz,
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        );
      } catch (e) {
        // Fallback if timezone is invalid
         setTime(now.toLocaleTimeString("es-AR"));
         setDate(now.toLocaleDateString("es-AR"));
      }
    };

    update();
    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [settings.timezone]); // Re-run if timezone changes

  return { time, date };
}
