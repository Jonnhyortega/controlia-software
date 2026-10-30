"use client";

// Esqueleto con la misma estructura que SalesForm (header + lista + sidebar)
// para mostrar mientras se cargan productos y clientes.
const Bone = ({ className = "" }: { className?: string }) => (
  <div className={`bg-gray-200 dark:bg-zinc-800 rounded-md ${className}`} />
);

export default function SalesFormSkeleton() {
  return (
    <div
      className="flex flex-col w-full h-full bg-white dark:bg-[#09090b] overflow-hidden animate-pulse"
      aria-busy="true"
      aria-label="Cargando formulario de venta"
    >
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-zinc-800 shrink-0">
        <div className="flex items-center gap-4">
          <Bone className="w-9 h-9 rounded-lg" />
          <div className="space-y-2">
            <Bone className="h-4 w-44" />
            <Bone className="h-3 w-28" />
          </div>
        </div>
        <Bone className="w-8 h-8 rounded-full" />
      </div>

      {/* --- MAIN CONTENT (Split View) --- */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* --- LEFT PANEL --- */}
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="px-3 pt-3 md:px-6 md:pt-6 pb-2 flex items-start gap-2">
            <Bone className="flex-1 h-10" />
            <Bone className="h-10 w-10 sm:w-28" />
          </div>

          <div className="hidden md:grid grid-cols-12 gap-3 px-6 py-3 border-b border-gray-200 dark:border-zinc-800">
            <Bone className="col-span-5 h-3 w-20" />
            <Bone className="col-span-2 h-3 w-10 mx-auto" />
            <Bone className="col-span-3 h-3 w-20 ml-auto" />
          </div>

          <div className="flex-1 px-2 md:px-4 py-2 space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 items-center p-2">
                <Bone className="md:col-span-5 h-8" />
                <Bone className="md:col-span-2 h-8" />
                <Bone className="md:col-span-3 h-8" />
              </div>
            ))}
            <div className="pt-2 px-1">
              <div className="w-full h-12 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-lg" />
            </div>
          </div>
        </div>

        {/* --- RIGHT PANEL --- */}
        <div className="w-full md:w-[400px] xl:w-[450px] bg-gray-50 dark:bg-[#121212] border-t md:border-t-0 md:border-l border-gray-200 dark:border-zinc-800 flex flex-col shrink-0 max-h-[55%] md:max-h-none">
          <div className="flex-1 p-4 md:p-6 space-y-6">
            <div className="space-y-3">
              <Bone className="h-3 w-28" />
              <Bone className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-3">
              <Bone className="h-3 w-16" />
              <Bone className="h-10 w-full rounded-lg" />
            </div>
          </div>

          <div className="p-4 md:p-6 bg-white dark:bg-[#18181b] border-t border-gray-200 dark:border-zinc-800 space-y-3">
            <Bone className="h-4 w-24" />
            <Bone className="h-10 w-40" />
            <Bone className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
