'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, MailCheck } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) toast.error(error.message)
    else { setSent(true); toast.success('Magic link enviado') }
    setLoading(false)
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center p-5" style={{ background: 'var(--bg)' }}>
      <Toaster position="top-center" />
      <div className="w-full max-w-[380px] p-7 rounded-2xl space-y-7" style={{ background: 'var(--card)', border: '0.5px solid var(--divider)', boxShadow: 'var(--shadow-lg)' }}>
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-1" style={{ background: 'color-mix(in srgb, var(--accent) 10%, transparent)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <h1 className="text-[24px] font-bold tracking-tight" style={{ color: 'var(--text)' }}>Rehab Tracker</h1>
          <p className="text-[14px]" style={{ color: 'var(--text2)' }}>Ingresa con tu correo para acceder</p>
        </div>

        {sent ? (
          <div className="p-5 rounded-xl text-center space-y-2" style={{ background: 'color-mix(in srgb, var(--accent) 6%, transparent)' }}>
            <MailCheck className="w-8 h-8 mx-auto" style={{ color: 'var(--accent)' }} />
            <p className="text-[14px] font-semibold" style={{ color: 'var(--text)' }}>Revisa tu bandeja</p>
            <p className="text-[13px]" style={{ color: 'var(--text2)' }}>Enlace enviado a <strong>{email}</strong></p>
            <button onClick={() => setSent(false)} className="text-[13px] font-medium mt-1" style={{ color: 'var(--accent)' }}>Usar otro correo</button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium mb-1.5" style={{ color: 'var(--text2)' }}>Correo electrónico</label>
              <input type="email" placeholder="tu@correo.com" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ background: 'var(--subtle)', color: 'var(--text)', border: '0.5px solid var(--divider)' }} />
            </div>
            <button type="submit" disabled={loading || !email}
              className="w-full py-3 rounded-xl font-semibold text-[15px] text-white transition-all active:scale-[0.98] disabled:opacity-40 flex items-center justify-center"
              style={{ background: 'var(--accent)' }}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continuar'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
