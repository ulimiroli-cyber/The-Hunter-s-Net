'use client'
import { useState } from 'react'
import { User, Camera, Shield } from 'lucide-react'

export default function ProfilePage() {
  const [name, setName] = useState('Cazador Desconocido')
  const [avatar, setAvatar] = useState('/api/placeholder/150/150')

  return (
    <div className="min-h-screen bg-spn-dark p-8 flex justify-center">
      <div className="max-w-md w-full bg-spn-paper border-2 border-gray-800 p-8 shadow-2xl relative">
        <div className="absolute top-0 right-0 p-2 bg-spn-blood text-white text-[10px] uppercase font-bold tracking-tighter">
          Expediente Clasificado
        </div>
        
        <h2 className="text-spn-gold font-bold uppercase tracking-widest mb-8 border-b border-gray-800 pb-2 flex items-center gap-2">
          <Shield size={18} /> Perfil de Operativo
        </h2>

        <div className="flex flex-col items-center gap-6">
          {/* Foto de Perfil */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-none border-2 border-spn-gold overflow-hidden bg-black flex items-center justify-center">
              <img src={avatar} alt="Profile" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
            </div>
            <label className="absolute bottom-0 right-0 bg-spn-blood p-2 cursor-pointer hover:bg-red-700 transition-colors">
              <Camera size={16} className="text-white" />
              <input type="file" className="hidden" onChange={(e) => {/* Lógica para subir a Supabase Storage */}} />
            </label>
          </div>

          {/* Nombre */}
          <div className="w-full">
            <label className="block text-gray-500 text-[10px] uppercase mb-1 tracking-widest">Alias en el campo</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black border border-gray-800 p-3 text-spn-gold font-mono focus:border-spn-blood outline-none"
            />
          </div>

          <button className="w-full bg-transparent border border-spn-gold text-spn-gold py-2 uppercase font-bold text-xs hover:bg-spn-gold hover:text-black transition-all">
            Actualizar Credenciales
          </button>
        </div>
      </div>
    </div>
  )
}