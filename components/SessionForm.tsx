'use client'

import { useState, useEffect } from 'react'
import { Plus, Loader2, Calendar as CalendarIcon, Activity } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'

interface SessionFormProps { lesionId: string; userId: string }

export default function SessionForm({ lesionId, userId }: SessionFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [painLevel, setPainLevel] = useState(5)
  const [exercises, setExercises] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('sessions').insert({
      user_id: userId, lesion_id: lesionId, date,
      pain_level: painLevel,
      exercises: exercises.trim() || null,
      notes: notes.trim() || null,
    })
    setLoading(false)
    if (error) { toast.error('Error: ' + error.message) }
    else {
      toast.success('Registro guardado')
      setIsOpen(false); setDate(format(new Date(), 'yyyy-MM-dd')); setPainLevel(5); setExercises(''); setNotes('')
      router.refresh()
    }
  }

  const sliderColor = painLevel <= 3 ? 'var(--green)' : painLevel <= 6 ? 'var(--orange)' : 'var(--red)'

  return (
    <>
      {/* Apple-style inline trigger — text button in page flow */}
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 text-[15px] font-medium active:opacity-60 transition-opacity"
        style={{ color: 'var(--accent)' }}
      >
        <Plus className="w-4 h-4" />
        Registrar
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[60]" style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} onClick={() => setIsOpen(false)} />
          <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
            <div className="w-full max-w-md pointer-events-auto max-h-[90vh] flex flex-col rounded-t-2xl sm:rounded-2xl" style={{ background: 'var(--card)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
              <div className="w-9 h-[5px] rounded-full mx-auto mt-2 mb-1 sm:hidden" style={{ background: 'var(--divider)' }} />
              <div className="p-5 sm:p-6 overflow-y-auto hide-scrollbar">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-[20px] font-bold" style={{ color: 'var(--text)' }}>Registrar Dolor</h3>
                  <button onClick={() => setIsOpen(false)} className="w-7 h-7 rounded-full flex items-center justify-center text-[14px] active:scale-90" style={{ background: 'var(--subtle)', color: 'var(--text2)' }}>✕</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="rounded-xl overflow-hidden" style={{ background: 'var(--subtle)' }}>
                    <div className="px-4 py-3 relative" style={{ borderBottom: '0.5px solid var(--divider)' }}>
                      <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text2)' }}>
                        <CalendarIcon className="w-3 h-3" /> Fecha
                      </label>
                      <div className="relative">
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full bg-transparent text-[15px] focus:outline-none date-clean" style={{ color: 'var(--text)' }} />
                        <CalendarIcon className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text2)' }} />
                      </div>
                    </div>
                    <div className="px-4 py-3">
                      <div className="flex items-center justify-between mb-2">
                        <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text2)' }}>
                          <Activity className="w-3 h-3" /> Intensidad
                        </label>
                        <span className="text-[13px] font-bold tabular-nums" style={{ color: sliderColor }}>{painLevel}/10</span>
                      </div>
                      <input type="range" min="1" max="10" value={painLevel} onChange={e => setPainLevel(parseInt(e.target.value))}
                        className="w-full h-[5px] rounded-full appearance-none cursor-pointer"
                        style={{ background: 'linear-gradient(90deg, var(--green), var(--orange), var(--red))', accentColor: sliderColor }} />
                      <div className="flex justify-between text-[10px] font-medium mt-1.5" style={{ color: 'var(--text2)' }}>
                        <span>Leve</span><span>Moderado</span><span>Severo</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl overflow-hidden" style={{ background: 'var(--subtle)' }}>
                    <div className="px-4 py-3" style={{ borderBottom: '0.5px solid var(--divider)' }}>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text2)' }}>Ejercicios</label>
                      <textarea value={exercises} onChange={e => setExercises(e.target.value)} placeholder="Ej: 3×10 Rotación externa..." rows={2} className="w-full bg-transparent text-[15px] focus:outline-none resize-none" style={{ color: 'var(--text)' }} />
                    </div>
                    <div className="px-4 py-3">
                      <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text2)' }}>Notas</label>
                      <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Sensaciones, observaciones..." rows={2} className="w-full bg-transparent text-[15px] focus:outline-none resize-none" style={{ color: 'var(--text)' }} />
                    </div>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 rounded-xl font-semibold text-[15px] text-white transition-all active:scale-[0.98] disabled:opacity-40 flex items-center justify-center"
                    style={{ background: 'var(--accent)' }}>
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Guardar Registro'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
