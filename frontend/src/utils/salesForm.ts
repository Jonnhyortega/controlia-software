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

  return {
    products,
    total,
    paymentMethod: newSale.paymentMethod,
  };
};

export const submitSale = async (payload: any, onCreated: () => void) => {
  const res = await api.post("/sales", payload);

  if (res.status >= 200 && res.status < 300) {
    // avisamos que la venta se creó, pero sin pasar datos
    onCreated();
    return res.data?.message || "✅ Venta registrada correctamente.";
  } else {
    throw new Error(res.data?.message || "Error al registrar la venta");
  }
};

