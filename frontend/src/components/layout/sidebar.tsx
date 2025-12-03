"use client";

import { useState } from "react";
import {
  Home,
  ShoppingCart,
  Package,
  Truck,
  Settings,
  LogOut,
  Menu,
  Folder,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

const mainLinks = [
  { label: "Dashboard", icon: Home, path: "/" },
  { label: "Ventas", icon: ShoppingCart, path: "/dashboard/sales" },
  { label: "Productos", icon: Package, path: "/dashboard/products" },
  { label: "Proveedores", icon: Truck, path: "/dashboard/providers" },
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
        bg-[#0E0E0E] text-gray-300 h-screen border-r border-[#1a1a1a]
        flex flex-col justify-between transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* TOP SECTION */}
      <div>
        {/* Logo + Collapse Button */}
        <div className="flex items-center justify-between px-3 py-5">
          {!collapsed && (
            <h1 className="text-xl font-bold tracking-wide text-white">
              CONTROLIA
            </h1>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-sm hover:bg-[#1f1f1f] transition"
          >
            <Menu size={22} className="text-gray-400" />
          </button>
        </div>

        {/* MAIN LINKS */}
        <nav className="mt-3">
          <p
            className={`px-4 text-xs text-gray-500 uppercase tracking-wider mb-2 ${
              collapsed ? "hidden" : ""
            }`}
          >
            Panel
          </p>

          {mainLinks.map((item) => {
            const active = pathname === item.path;
            const Icon = item.icon;

            return (
              <div key={item.label} className="relative group">
                <button
                  onClick={() => router.push(item.path)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-sm transition
                    ${
                      active
                        ? "bg-[#1f1f1f] text-white"
                        : "hover:bg-[#1a1a1a] text-gray-300"
                    }
                  `}
                >
                  <Icon
                    size={20}
                    className={active ? "text-white" : "text-gray-400"}
                  />

                  {!collapsed && <span className="text-sm">{item.label}</span>}
                </button>

                {/* Tooltip when collapsed */}
                {collapsed && (
                  <span
                    className="
                      absolute left-20 top-1/2 -translate-y-1/2 
                      bg-black text-white text-xs px-3 py-1 rounded-sm opacity-0 
                      group-hover:opacity-100 transition-all shadow-lg
                      border border-gray-700 pointer-events-none
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
        <nav className="mt-6">
          {!collapsed && (
            <p className="px-4 text-xs text-gray-500 uppercase tracking-wider mb-2">
              Ajustes
            </p>
          )}

          {pluginLinks.map((item) => {
            const active = pathname === item.path;
            const Icon = item.icon;

            return (
              <div key={item.label} className="relative group">
                <button
                  onClick={() => router.push(item.path)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 roundedccccccc transition
                    ${
                      active
                        ? "bg-[#1f1f1f] text-white"
                        : "hover:bg-[#1a1a1a] text-gray-300"
                    }
                  `}
                >
                  <Icon
                    size={20}
                    className={active ? "text-white" : "text-gray-400"}
                  />

                  {!collapsed && <span className="text-sm">{item.label}</span>}
                </button>

                {collapsed && (
                  <span
                    className="
                      absolute left-20 top-1/2 -translate-y-1/2 
                      bg-black text-white text-xs px-3 py-1 rounded-md opacity-0 
                      group-hover:opacity-100 transition-all shadow-lg
                      border border-gray-700 pointer-events-none
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
