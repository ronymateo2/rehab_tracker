'use client'

import { useState, useEffect } from 'react'
import { Trash2, Loader2, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface DeleteLesionButtonProps {
  lesionId: string;
}

export default function DeleteLesionButton({ lesionId }: DeleteLesionButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  const handleDelete = async () => {
    setLoading(true)
    const { error } = await supabase
      .from('lesions')
      .delete()
      .eq('id', lesionId)

    setLoading(false)
    if (error) {
      toast.error('Error al eliminar: ' + error.message)
    } else {
      toast.success('Lesión eliminada')
      setIsOpen(false)
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl active:scale-[0.98] transition-transform"
        style={{ color: 'var(--red)', background: 'color-mix(in srgb, var(--red) 8%, transparent)' }}
        aria-label="Eliminar lesión"
      >
        <Trash2 className="w-5 h-5" />
        <span className="text-[15px] font-semibold">Eliminar lesión</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[60]" 
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} 
            onClick={() => setIsOpen(false)} 
          />
          <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
            <div className="w-full max-w-md pointer-events-auto flex flex-col rounded-t-2xl sm:rounded-2xl p-5 sm:p-6" style={{ background: 'var(--card)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
              <div className="w-9 h-[5px] rounded-full mx-auto mt-2 mb-4 sm:hidden" style={{ background: 'var(--divider)' }} />
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(255,59,48,0.1)', color: 'var(--red)' }}>
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-[20px] font-bold mb-2" style={{ color: 'var(--text)' }}>
                  ¿Eliminar lesión?
                </h3>
                <p className="text-[14px] mb-6" style={{ color: 'var(--text2)' }}>
                  Esta acción es permanente. Se eliminará el historial y todas las sesiones registradas de esta lesión.
                </p>
                
                <div className="flex flex-col sm:flex-row w-full gap-3">
                  <button 
                    onClick={() => setIsOpen(false)}
                    disabled={loading}
                    className="flex-1 py-3.5 rounded-xl font-semibold text-[15px] transition-all active:scale-[0.98]"
                    style={{ background: 'var(--subtle)', color: 'var(--text)' }}>
                    Cancelar
                  </button>
                  <button 
                    onClick={handleDelete}
                    disabled={loading}
                    className="flex-1 py-3.5 rounded-xl font-semibold text-[15px] flex items-center justify-center text-white transition-all active:scale-[0.98] disabled:opacity-40"
                    style={{ background: 'var(--red)' }}>
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Eliminar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
