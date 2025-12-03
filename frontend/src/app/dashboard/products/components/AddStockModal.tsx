import type { Product } from "../../../../types/product";

interface AddStockModalProps {
  product: Product;
  qty: number;
  setQty: (n: number) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export function AddStockModal({
  product,
  qty,
  setQty,
  onCancel,
  onConfirm,
}: AddStockModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl p-6 shadow-lg">

        <h3 className="text-lg font-semibold mb-2">Producto encontrado</h3>
        <p className="text-sm text-gray-500 mb-4">
          ¿Querés agregar stock a este producto?
        </p>

        <div className="border rounded-lg p-3 mb-4 bg-gray-50 flex items-center justify-between">
          <div>
            <div className="font-medium">{product.name}</div>
            <div className="text-xs text-gray-500">
              Código: {product.barcode || "-"}
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Stock actual:{" "}
            <span className="font-semibold">{product.stock}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <label className="text-xl font-bold" htmlFor="quantity">Cantidad:</label>
          <input
            type="number"
            min={1}
            value={qty}
            name="quantity"
            onChange={(e) => setQty(Number(e.target.value))}
            className="w-24 border rounded-xl px-3 py-2"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border text-gray-700"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-primary text-white"
          >
            Agregar stock
          </button>
        </div>
      </div>
    </div>
  );
}
