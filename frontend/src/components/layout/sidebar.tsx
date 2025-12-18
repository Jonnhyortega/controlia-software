"use client";

import { useState } from "react";
import {
  Home,
  ShoppingCart,
  Package,
  Truck,
  Settings,
  Menu,
  Users,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

const mainLinks = [
  { label: "Dashboard", icon: Home, path: "/" },
  { label: "Ventas", icon: ShoppingCart, path: "/dashboard/sales" },
  { label: "Productos", icon: Package, path: "/dashboard/products" },
  { label: "Proveedores", icon: Truck, path: "/dashboard/providers" },
  { label: "Clientes", icon: Users, path: "/dashboard/clients" },
];

const pluginLinks = [
  { label: "Configuración", icon: Settings, path: "/dashboard/settings" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  return (
    <aside
      className={`
        hidden md:flex
        bg-gray-200/80 dark:bg-[#0E0E0E] text-gray-600 dark:text-gray-300 h-screen border-r border-gray-200 dark:border-[#1a1a1a]
        flex-col justify-between transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* TOP SECTION */}
      <div>
        {/* Logo + Collapse Button */}
        <div className="flex items-center justify-between px-3 py-5">
          {!collapsed && (
            <h1 className="text-xl font-bold tracking-wide text-gray-900 dark:text-white">
              <img src="/logosinfondo.png" alt="Logo controlia" width={48} height={48} />
            </h1>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#1f1f1f] transition text-gray-500 dark:text-gray-400"
          >
            <Menu size={22} />
          </button>
        </div>

        {/* MAIN LINKS */}
        <nav className="mt-3 px-2">
          <p
            className={`px-4 text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-2 ${
              collapsed ? "hidden" : ""
            }`}
          >
            Panel
          </p>

          {mainLinks.map((item) => {
            const active = pathname === item.path;
            const Icon = item.icon;

            return (
              <div key={item.label} className="relative group mb-1">
                <button
                  onClick={() => router.push(item.path)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200
                    ${
                      active
                        ? "bg-primary text-white shadow-lg shadow-primary/20 font-medium"
                        : "hover:bg-gray-100 dark:hover:bg-[#1f1f1f] text-gray-600 dark:text-gray-400"
                    }
                  `}
                >
                  <Icon
                    size={20}
                    className={active ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200"}
                  />

                  {!collapsed && <span className="text-sm">{item.label}</span>}
                </button>

                {/* Tooltip when collapsed */}
                {collapsed && (
                  <span
                    className="
                      absolute left-16 top-1/2 -translate-y-1/2 
                      bg-gray-900 dark:bg-black text-white text-xs px-3 py-1.5 rounded-md opacity-0 
                      group-hover:opacity-100 transition-all shadow-xl z-50
                      border border-gray-800 pointer-events-none whitespace-nowrap
                    "
                  >
                    {item.label}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* PLUGINS SECTION */}
        <nav className="mt-6 px-2">
          {!collapsed && (
            <p className="px-4 text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-2">
              Ajustes
            </p>
          )}

          {pluginLinks.map((item) => {
            const active = pathname === item.path;
            const Icon = item.icon;

            return (
              <div key={item.label} className="relative group mb-1">
                <button
                  onClick={() => router.push(item.path)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200
                    ${
                      active
                        ? "bg-primary text-white shadow-lg shadow-primary/20 font-medium"
                        : "hover:bg-gray-100 dark:hover:bg-[#1f1f1f] text-gray-600 dark:text-gray-400"
                    }
                  `}
                >
                  <Icon
                    size={20}
                    className={active ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200"}
                  />

                  {!collapsed && <span className="text-sm">{item.label}</span>}
                </button>

                {collapsed && (
                  <span
                    className="
                      absolute left-16 top-1/2 -translate-y-1/2 
                      bg-gray-900 dark:bg-black text-white text-xs px-3 py-1.5 rounded-md opacity-0 
                      group-hover:opacity-100 transition-all shadow-xl z-50
                      border border-gray-800 pointer-events-none whitespace-nowrap
                    "
                  >
                    {item.label}
                  </span>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
