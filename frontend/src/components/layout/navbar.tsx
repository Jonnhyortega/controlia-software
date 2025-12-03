"use client";

import { useEffect, useState } from "react";
import { ContactRound } from "lucide-react";
import { getProfile } from "../../utils/api";
import { useAuth } from "../../context/authContext";

export default function Navbar() {
  const [nameProfile, setName] = useState("");
  const [imgPerfil, setImgPerfil] = useState("" as any);
  const auth = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const data = await getProfile();
        setName(data.name || "");
        setImgPerfil(data?.logoUrl || "");
      } catch {}
    })();
  }, []);

  return (
    <header className="bg-[#121212] border-b border-[#1f1f1f] shadow-md px-6 py-4 flex justify-end items-center relative">

      {/* Nombre */}
      <span className="font-light text-white text-sm mr-4">
        {nameProfile}
      </span>

      <div className="relative group">
      {/* Avatar */}
      {imgPerfil ? (
        <img
          src={imgPerfil}
          alt="Perfil"
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

      {/* Dropdown */}
      <div
        className="
          opacity-0 pointer-events-none
          group-hover:opacity-100 group-hover:pointer-events-auto
          absolute right-2 top-8 mt-2 w-52 
          bg-[#1a1a1a] border border-[#2c2c2c]
          rounded-lg shadow-xl z-50 transition-all duration-150
        "
      >
        <ul className="py-2 text-sm text-gray-300">
          <li>
            <a
              href="/dashboard/settings/customization"
              className="block px-4 py-2 hover:bg-[#2a2a2a]"
            >
              Personalización
            </a>
          </li>

          <li>
            <a
              href="/dashboard/settings/profile"
              className="block px-4 py-2 hover:bg-[#2a2a2a]"
            >
              Perfil
            </a>
          </li>

          <li>
            <a
              href="/dashboard/settings/membresia"
              className="block px-4 py-2 hover:bg-[#2a2a2a]"
            >
              Membresía
            </a>
          </li>

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
  
    </header>
  );
}
