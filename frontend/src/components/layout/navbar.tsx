"use client";

import { useEffect, useState } from "react";
import { any } from "zod";
import { getProfile } from "../../utils/api";
import { ContactRound } from "lucide-react";

export default function Navbar() {
  const [nameProfile, setName] = useState("")
  const [imgPerfil, setImgPerfil] = useState("" as any)
  useEffect(()=>{
    (async()=>{
      const data = await getProfile();
      // console.log(data)
      setImgPerfil(data.logoUrl);
      setName(data.name)
    })();
  },[]);
  
  return (
    <header className="bg-[#121212] border-b border-[#1f1f1f] shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold text-primary-300 tracking-wide">
        Panel de Controlia
      </h1>

      <div className="text-gray-300 text-sm flex items-center justify-between gap-4">
        <span className="font-semibold text-white">Bienvenido, {nameProfile}</span>
        {imgPerfil ? (<img src={imgPerfil} alt="" width={"50px"} />) : (<ContactRound size={48} strokeWidth={1} />)}
      </div>
    </header>
  );
}
