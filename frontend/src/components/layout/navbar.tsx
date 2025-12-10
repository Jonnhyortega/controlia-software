"use client";

import { useEffect, useState } from "react";
import { ContactRound, Menu, X, Home, ShoppingCart, Package, Truck, Settings } from "lucide-react";
import { getProfile } from "../../utils/api";
import { useAuth } from "../../context/authContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [nameProfile, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [imgPerfil, setImgPerfil] = useState("" as any);
  const [daysRemaining, setdaysremaining] = useState("" as any)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const auth = useAuth();
  const pathname = usePathname();
  const user = auth?.user;

  useEffect(() => {
    (async () => {
      try {
        const data = await getProfile();
        setdaysremaining(data.trialDaysRemaining || "Prueba finalizada");
        setName(data.name || "");
        setBusinessName(data.businessName || "");
        setImgPerfil(data?.logoUrl);
        console.log(imgPerfil)
      } catch {}
    })();
  }, []);

  const menuItems = [
    { label: "Dashboard", icon: Home, path: "/dashboard" },
    { label: "Ventas", icon: ShoppingCart, path: "/dashboard/sales" },
    { label: "Productos", icon: Package, path: "/dashboard/products" },
    { label: "Proveedores", icon: Truck, path: "/dashboard/providers" },
    { label: "Configuración", icon: Settings, path: "/dashboard/settings" },
  ];

  const capitalize = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <>
      <header className="bg-[#121212] border-b border-[#1f1f1f] shadow-md px-4 md:px-6 py-4 flex justify-between md:justify-end items-center relative z-40">
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white p-1"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu size={28} />
        </button>

        <div className="flex items-center">
          {/* Nombre Comercial (o Usuario si no hay comercial) */}
          <span className="hidden md:block font-light text-white text-sm mr-4 uppercase tracking-wider">
            {businessName || nameProfile}
          </span>

          <div className="relative group">
            {/* Avatar */}
            {imgPerfil ? (
              <img
                src={imgPerfil}
                alt="Perfil"
                title={capitalize(user?.name || "Usuario")}
                width={48}
                height={48}
                className="rounded-full cursor-pointer transition"
              />
            ) : (
              <ContactRound
                size={48}
                strokeWidth={1}
                className="text-white cursor-pointer"
              />
            )}

            {/* Dropdown (Desktop) */}
            <div
              className="
                opacity-0 pointer-events-none
                group-hover:opacity-100 group-hover:pointer-events-auto
                absolute right-5 top-5 mt-2 w-52 
                bg-[#1a1a1a] border border-[#2c2c2c]
                rounded-sm shadow-xl z-50 transition-all duration-150
              "
            >
              <ul className="py-2 text-sm text-gray-300">
                
                  {/* Nombre del Usuario */}
                  <li className="px-4 py-2 border-b border-[#2c2c2c] mb-2">
                    <div className="text-xs text-gray-400">Usuario</div>
                    <div className="text-sm text-white font-medium">
                      {capitalize(nameProfile)}
                    </div>
                  </li>

                  <li className="px-4 py-2 border-b border-[#2c2c2c] mb-2">
                    <div className="text-xs text-gray-400">Prueba gratuita</div>
                    <div className="text-sm text-primary-400 font-medium">
                      {daysRemaining} días restantes
                    </div>
                  </li>

                  <li className="px-4 py-2 border-b border-[#2c2c2c] mb-2">
                    <div className="text-xs text-gray-400">Rol</div>
                    <div className="text-sm text-blue-400 font-medium capitalize">
                      {user?.role || "Cargando..."}
                    </div>
                  </li>
                          
                <li>
                  <Link
                    href="/dashboard/settings/customization"
                    className="block px-4 py-2 hover:bg-[#2a2a2a]"
                  >
                    Personalización
                  </Link>
                </li>

                <li>
                  <Link
                    href="/dashboard/settings/profile"
                    className="block px-4 py-2 hover:bg-[#2a2a2a]"
                  >
                    Perfil
                  </Link>
                </li>

                {user?.role !== "empleado" && (
                  <li>
                    <Link
                      href="/dashboard/subscription"
                      className="block px-4 py-2 hover:bg-[#2a2a2a]"
                    >
                      Subscripcion
                    </Link>
                  </li>
                )}

                <li>
                  <button
                    onClick={() => auth?.logout()}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-[#2a2a2a] hover:text-red-300"
                  >
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Drawer */}
          <div className="absolute left-0 top-0 bottom-0 w-3/4 max-w-xs bg-[#121212] border-r border-[#1f1f1f] shadow-2xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-white tracking-wide">CONTROLIA</h2>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex-1 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                      ${isActive 
                        ? "bg-primary text-white font-medium" 
                        : "text-gray-400 hover:bg-[#1f1f1f] hover:text-white"
                      }
                    `}
                  >
                    <Icon size={20} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto pt-6 border-t border-[#1f1f1f]">
              <button
                onClick={() => {
                  auth?.logout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-900/20 rounded-xl transition-all"
              >
                <LogOut size={20} />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Import LogOut icon which was missing in imports
import { LogOut } from "lucide-react";
