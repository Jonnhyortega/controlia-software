import { closeDailyCash } from "./api";

async function runTest() {
  console.log("🧪 Iniciando test de cierre de caja...");

  // Caso simulado: backend devuelve 400 con mensaje de caja existente
  const fakeData = {
    expenses: [],
    payments: [],
  };

  try {
    const res = await closeDailyCash(fakeData);
    console.log("✅ Resultado:", res);
  } catch (err) {
    console.error("❌ Test falló:", err);
  }
}

runTest();
