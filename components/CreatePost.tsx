'use client'

import { useState } from 'react'
import { Send, Skull } from 'lucide-react' // Usamos los íconos que ya tienes en tu package.json

export default function CreatePost({ userId }: { userId: string }) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)

    // Aquí irá tu conexión a Supabase más adelante. Ejemplo:
    // await supabase.from('posts').insert({ user_id: userId, content })

    // Simulamos el envío por ahora
    setTimeout(() => {
      setContent('')
      setIsSubmitting(false)
    }, 800)
  }

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <form 
        onSubmit={handleSubmit} 
        className="bg-spn-paper border border-gray-800 border-t-4 border-t-spn-blood p-5 shadow-2xl relative overflow-hidden"
      >
        {/* Marca de agua decorativa de fondo */}
        <div className="absolute -bottom-6 -right-6 opacity-5 pointer-events-none">
          <Skull size={120} />
        </div>

        <div className="relative z-10">
          <label htmlFor="hunter-note" className="flex items-center gap-2 text-spn-gold uppercase tracking-widest text-xs font-bold mb-3">
            <span className="bg-spn-gold w-2 h-2 rounded-full animate-pulse"></span>
            Añadir entrada al registro
          </label>
          
          <textarea
            id="hunter-note"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="¿Qué has estado cazando, Sammy?..."
            className="w-full bg-black/60 border border-gray-700 text-gray-300 placeholder-gray-600 p-4 min-h-[120px] resize-y focus:outline-none focus:border-spn-blood focus:ring-1 focus:ring-spn-blood transition-all"
          />

          <div className="mt-4 flex justify-between items-center">
            <p className="text-xs text-gray-500 italic">
              ID Cazador: <span className="text-gray-400 font-mono">{userId.slice(0, 8)}...</span>
            </p>
            
            <button
              type="submit"
              disabled={!content.trim() || isSubmitting}
              className="bg-spn-blood hover:bg-red-900 disabled:bg-gray-800 disabled:text-gray-500 text-white px-6 py-2 uppercase tracking-wider text-sm font-bold flex items-center gap-2 transition-colors border border-transparent disabled:border-gray-700"
            >
              {isSubmitting ? 'Sellando...' : 'Publicar Nota'}
              <Send size={16} className={isSubmitting ? 'animate-bounce' : ''} />
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}