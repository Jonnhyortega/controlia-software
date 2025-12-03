
import { Plus } from "lucide-react";
import HistorySales from "./historySales";
import { Button } from "../components/button";

export default function VentasPage() {
  return (
    <section className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Ventas</h1>
        {/* <Button className="flex items-center gap-2">
          <Plus size={18} /> Nueva venta
        </Button> */}
      </div>
      <HistorySales />
    </section>
  );
}
