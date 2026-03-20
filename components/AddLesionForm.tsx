'use client'

import { useState, useEffect } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { PRESET_COLORS, cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export default function AddLesionForm({ userId }: { userId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [zone, setZone] = useState('')
  const [color, setColor] = useState(PRESET_COLORS[0])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    const { error } = await supabase.from('lesions').insert({ user_id: userId, name, zone, color })
    setLoading(false)
    if (error) { toast.error('Error: ' + error.message) }
    else {
      toast.success('Lesión agregada')
      setIsOpen(false); setName(''); setZone(''); setColor(PRESET_COLORS[0])
      router.refresh()
    }
  }

  return (
    <>
      {/* Apple-style text button — sits in the nav/title area */}
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1 text-[15px] font-medium active:opacity-60 transition-opacity"
        style={{ color: 'var(--accent)' }}
      >
        <Plus className="w-4 h-4" />
        Agregar
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[60]" style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} onClick={() => setIsOpen(false)} />
          <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
            <div className="w-full max-w-md pointer-events-auto max-h-[90vh] flex flex-col rounded-t-2xl sm:rounded-2xl" style={{ background: 'var(--card)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
              <div className="w-9 h-[5px] rounded-full mx-auto mt-2 mb-1 sm:hidden" style={{ background: 'var(--divider)' }} />
              <div className="p-5 sm:p-6 overflow-y-auto hide-scrollbar">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-[20px] font-bold" style={{ color: 'var(--text)' }}>Nueva Lesión</h3>
                  <button onClick={() => setIsOpen(false)} className="w-7 h-7 rounded-full flex items-center justify-center text-[14px] active:scale-90" style={{ background: 'var(--subtle)', color: 'var(--text2)' }}>✕</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="rounded-xl overflow-hidden" style={{ background: 'var(--subtle)' }}>
                    <div className="px-4 py-3" style={{ borderBottom: '0.5px solid var(--divider)' }}>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text2)' }}>Nombre *</label>
                      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Hombro derecho" required autoFocus className="w-full bg-transparent text-[15px] focus:outline-none" style={{ color: 'var(--text)' }} />
                    </div>
                    <div className="px-4 py-3">
                      <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text2)' }}>Zona / Diagnóstico</label>
                      <input type="text" value={zone} onChange={e => setZone(e.target.value)} placeholder="Ej: Supraespinoso" className="w-full bg-transparent text-[15px] focus:outline-none" style={{ color: 'var(--text)' }} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text2)' }}>Color</label>
                    <div className="flex gap-3">
                      {PRESET_COLORS.map(c => (
                        <button key={c} type="button" onClick={() => setColor(c)}
                          className={cn("w-7 h-7 rounded-full transition-all", color === c ? "ring-2 ring-offset-2 scale-110" : "hover:scale-105")}
                          style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-3 rounded-xl font-medium text-[15px] active:scale-[0.98]" style={{ background: 'var(--subtle)', color: 'var(--text)' }}>
                      Cancelar
                    </button>
                    <button type="submit" disabled={loading || !name} className="flex-1 py-3 rounded-xl font-semibold text-[15px] text-white active:scale-[0.98] disabled:opacity-40 flex items-center justify-center" style={{ background: 'var(--accent)' }}>
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Guardar'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
