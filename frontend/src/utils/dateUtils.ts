// frontend/src/utils/dateUtils.ts

// Zona horaria de Argentina (cambiá si tu app crece internacionalmente)
const DEFAULT_TZ = "America/Argentina/Buenos_Aires";

/**
 * 📅 Convierte una fecha UTC (ISO del backend) a fecha legible local.
 * Ej: "2025-10-31T03:00:00.000Z" → "viernes, 31 de octubre"
 */
export const formatLocalDate = (
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string => {
  if (!date) return "";
  const d = new Date(date);
  // console.log("🧩 [formatLocalDate]", {
  //   input: date,
  //   parsed: d.toISOString(),
  //   local: d.toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" })
  // });
  return new Intl.DateTimeFormat("es-AR", {
    timeZone: DEFAULT_TZ,
    day: "numeric",
    month: "long",
    ...options,
  }).format(d);
};

/**
 * 🕔 Convierte una fecha UTC a hora local (ej: 18:45)
 */
export const formatLocalTime = (
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string => {
  if (!date) return "";
  const d = new Date(date);
  return new Intl.DateTimeFormat("es-AR", {
    timeZone: DEFAULT_TZ,
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  }).format(d);
};

/**
 * 🧭 Devuelve el día local en formato YYYY-MM-DD
 * (para agrupar por fecha sin errores de zona)
 */
export const getLocalDateKey = (date: string | Date): string => {
  const d = new Date(date);
  const tzDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: DEFAULT_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
  return tzDate; // ejemplo: "2025-10-31"
};
