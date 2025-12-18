import { api, getDashboardData } from "./api";

export const validateStockBeforeSale = (productsDB: any[], products: any[]) => {
  for (const item of products) {
    const found = productsDB.find((p) => p._id === item.productId);
    if (found && item.quantity > found.stock) {
      return `⚠️ No hay stock suficiente para "${found.name}". Disponible: ${found.stock}`;
    }
  }
  return null;
};

export const buildSalePayload = (newSale: any) => {
  const products = newSale.products.map((p: any) => {
    const isManual = p.productId === "otro" || !p.productId;
    return {
      product: isManual ? null : p.productId,
      name: isManual ? (p.name?.trim() || "Otro") : "",
      quantity: Number(p.quantity),
      price: Number(p.price),
    };
  });

  const total = products.reduce((sum: number, p: any) => sum + p.price * p.quantity, 0);

  // Asegurar consistencia de amountPaid
  let finalAmountPaid = newSale.amountPaid;
  
  // Si no está definido, para el payload enviamos null o undefined (backend decide).
  // Pero para estar 100% seguros de qué estamos mandando:
  if (finalAmountPaid !== undefined) {
      finalAmountPaid = Number(finalAmountPaid);
  }

  const payload = {
    products,
    total,
    paymentMethod: newSale.paymentMethod,
    clientId: newSale.clientId || null, 
    amountPaid: finalAmountPaid, 
  };
  
  console.log("🛠️ [Frontend] Construyendo Payload:", payload);
  return payload;
};

export const submitSale = async (payload: any, onCreated: () => void) => {
  try {
      const res = await api.post("/sales", payload);

      if (res.status >= 200 && res.status < 300) {
        onCreated();
        return res.data?.message || "✅ Venta registrada correctamente.";
      } else {
        throw new Error(res.data?.message || "Error al registrar la venta");
      }
  } catch (error: any) {
      console.error("❌ Error en submitSale:", error);
      throw error;
  }
};

