'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const supabase = useRef(createClient()).current

  useEffect(() => {
    const authError = new URLSearchParams(window.location.search).get('error')
    if (authError) {
      toast.error('No fue posible iniciar sesión. Intenta de nuevo.')
    }
  }, [])

  const handleGoogleLogin = async () => {
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    if (data.url) {
      window.location.assign(data.url)
      return
    }

    setLoading(false)
    toast.error('No fue posible abrir Google Auth.')
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center p-5" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-[380px] p-7 rounded-2xl space-y-7" style={{ background: 'var(--card)', border: '0.5px solid var(--divider)', boxShadow: 'var(--shadow-lg)' }}>
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-1" style={{ background: 'color-mix(in srgb, var(--accent) 10%, transparent)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <h1 className="text-[24px] font-bold tracking-tight" style={{ color: 'var(--text)' }}>Rehab Tracker</h1>
          <p className="text-[14px]" style={{ color: 'var(--text2)' }}>Ingresa con Google sin depender de enlaces por correo</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-semibold text-[15px] transition-all active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-3"
            style={{ background: 'var(--subtle)', color: 'var(--text)', border: '0.5px solid var(--divider)' }}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-[var(--text2)]" />
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Continuar con Google</span>
              </>
            )}
          </button>

          <p className="text-center text-[13px]" style={{ color: 'var(--text2)' }}>
            El acceso abre Google Auth y vuelve a la app con tu sesión de Supabase.
          </p>
        </div>
      </div>
    </div>
  )
}
