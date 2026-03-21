'use client'

import { createClient } from '@/lib/supabase/client'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => { supabase.auth.getUser() }, [supabase.auth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex flex-col min-h-[100dvh]" style={{ background: 'var(--bg)' }}>
      {/* Nav */}
      <header 
        className="sticky top-0 z-50 pt-safe"
        style={{ 
          background: 'color-mix(in srgb, var(--bg) 80%, transparent)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          borderBottom: '0.5px solid var(--divider)',
        }}
      >
        <div className="flex items-center justify-between px-5 sm:px-8 py-3.5 max-w-3xl mx-auto w-full">
          <span className="text-[17px] font-semibold" style={{ color: 'var(--text)' }}>
            Rehab <span style={{ color: 'var(--accent)' }}>Tracker</span>
          </span>
          <button 
            onClick={handleLogout}
            className="p-2 -mr-1.5 rounded-full transition-colors"
            style={{ color: 'var(--text2)' }}
          >
            <LogOut className="w-[17px] h-[17px]" />
          </button>
        </div>
      </header>
      
      <main className="flex-1 w-full max-w-3xl mx-auto px-5 sm:px-8 py-6 pb-24">
        {children}
      </main>
    </div>
  )
}
