"use client";

import { useEffect, useState } from "react";
import { ContactRound, Menu, X, Home, ShoppingCart, Package, Truck, Settings, LogOut, Sun, Moon } from "lucide-react";
import { getProfile } from "../../utils/api";
import { useAuth } from "../../context/authContext";
import { useCustomization } from "../../context/CustomizationContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [nameProfile, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [imgPerfil, setImgPerfil] = useState("" as any);
  const [daysRemaining, setdaysremaining] = useState("" as any)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const auth = useAuth();
  const { settings, updateSettings } = useCustomization();
  const pathname = usePathname();
  const user = auth?.user;

  const isDark = settings.theme === 'dark';
  const toggleTheme = () => updateSettings({ theme: isDark ? 'light' : 'dark' });

  useEffect(() => {
    (async () => {
      try {
        const data = await getProfile();
        setdaysremaining(data.trialDaysRemaining || "Prueba finalizada");
        setName(data.name || "");
        setBusinessName(data.businessName || "");
        setImgPerfil(data?.logoUrl);
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
      <header className="bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-[#1f1f1f] shadow-sm px-4 md:px-6 py-4 flex justify-between md:justify-end items-center relative z-40 transition-colors duration-300">
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-600 dark:text-white p-1"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu size={28} />
        </button>

        <div className="flex items-center">
          {/* Nombre Comercial (o Usuario si no hay comercial) */}
          <span className="hidden md:block font-medium text-gray-900 dark:text-white text-sm mr-4 uppercase tracking-wider">
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
                className="rounded-full cursor-pointer transition shadow-sm border border-gray-200 dark:border-gray-700"
              />
            ) : (
              <ContactRound
                size={48}
                strokeWidth={1}
                className="text-gray-400 dark:text-white cursor-pointer"
              />
            )}

            {/* Dropdown (Desktop) */}
            <div
              className="
                opacity-0 pointer-events-none
                group-hover:opacity-100 group-hover:pointer-events-auto
                absolute right-5 top-5 mt-2 w-64 
                bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2c2c2c]
                rounded-xl shadow-2xl z-50 transition-all duration-150
              "
            >
              <ul className="py-2 text-sm text-gray-700 dark:text-gray-300">
                
                  {/* Nombre del Usuario */}
                  <li className="px-4 py-3 border-b border-gray-100 dark:border-[#2c2c2c] mb-2 bg-gray-50 dark:bg-transparent rounded-t-xl">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Usuario</div>
                    <div className="text-sm text-gray-900 dark:text-white font-semibold">
                      {capitalize(nameProfile)}
                    </div>
                  </li>

                  <li className="px-4 py-2 border-b border-gray-100 dark:border-[#2c2c2c] mb-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Prueba gratuita</div>
                    <div className="text-sm text-primary font-medium">
                      {daysRemaining} días restantes
                    </div>
                  </li>

                  <li className="px-4 py-2 border-b border-gray-100 dark:border-[#2c2c2c] mb-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Rol</div>
                    <div className="text-sm text-blue-600 dark:text-blue-400 font-medium capitalize">
                      {user?.role || "Cargando..."}
                    </div>
                  </li>

                  {/* Theme Toggle */}
                  <li className="px-4 py-2 border-b border-gray-100 dark:border-[#2c2c2c] mb-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Apariencia</div>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            toggleTheme();
                        }}
                        className="flex items-center justify-between w-full p-2 bg-gray-100 dark:bg-[#252525] rounded-lg hover:bg-gray-200 dark:hover:bg-[#303030] transition-colors cursor-pointer"
                    >
                        <div className="flex items-center gap-2">
                            {isDark 
                                ? <Moon size={16} className="text-blue-400"/> 
                                : <Sun size={16} className="text-amber-500"/>
                            }
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                {isDark ? "Modo Oscuro" : "Modo Claro"}
                            </span>
                        </div>
                    </button>
                  </li>
                          
                <li>
                  <Link
                    href="/dashboard/settings/customization"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                  >
                    Personalización
                  </Link>
                </li>

                <li>
                  <Link
                    href="/dashboard/settings/profile"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                  >
                    Perfil
                  </Link>
                </li>

                {user?.role !== "empleado" && (
                  <li>
                    <Link
                      href="/dashboard/subscription"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                    >
                      Subscripcion
                    </Link>
                  </li>
                )}

                <li>
                  <button
                    onClick={() => auth?.logout()}
                    className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-[#2a2a2a]"
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
          <div className="absolute left-0 top-0 bottom-0 w-3/4 max-w-xs bg-white dark:bg-[#121212] border-r border-gray-200 dark:border-[#1f1f1f] shadow-2xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-wide">CONTROLIA</h2>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
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
                        ? "bg-primary text-white font-medium shadow-md shadow-primary/20" 
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1f1f1f] hover:text-gray-900 dark:hover:text-white"
                      }
                    `}
                  >
                    <Icon size={20} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto border-t border-gray-200 dark:border-[#1f1f1f] pt-4 space-y-2">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1f1f1f] rounded-xl transition-all"
              >
                {isDark ? <Moon size={20} className="text-blue-500"/> : <Sun size={20} className="text-amber-500"/>}
                {isDark ? "Modo Oscuro" : "Modo Claro"}
              </button>

              <button
                onClick={() => {
                  auth?.logout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
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
