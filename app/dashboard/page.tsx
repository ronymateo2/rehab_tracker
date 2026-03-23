import { createServerClient } from '@/lib/supabase/server'
import LesionCard from '@/components/LesionCard'
import AddLesionForm from '@/components/AddLesionForm'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'

type LesionCardProps = React.ComponentProps<typeof LesionCard>;
export const dynamic = 'force-dynamic'

async function LesionList() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: lesions, error } = await supabase
    .from('lesions')
    .select(`*, sessions ( id, date, pain_level, created_at )`)
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  if (error) {
    return <div className="p-4 rounded-2xl text-center text-[14px]" style={{ background: 'rgba(255,59,48,0.08)', color: 'var(--red)' }}>Error: {error.message}</div>
  }

  return (
    <>
      {/* Grouped list */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '0.5px solid var(--divider)', boxShadow: 'var(--shadow)' }}>
        {lesions && lesions.length > 0 ? (
          lesions.map((lesion, index) => (
            <LesionCard 
              key={lesion.id} 
              lesion={lesion as unknown as LesionCardProps['lesion']}
              isLast={index === lesions.length - 1}
            />
          ))
        ) : (
          <div className="px-5 py-12 text-center">
            <p className="text-[15px] font-medium" style={{ color: 'var(--text2)' }}>Sin lesiones registradas</p>
            <p className="text-[13px] mt-1" style={{ color: 'var(--text2)', opacity: 0.6 }}>Presiona + para agregar tu primera</p>
          </div>
        )}
      </div>
    </>
  )
}

export default async function DashboardPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const name = user.email?.split('@')[0] || ''

  return (
    <div className="space-y-6">
      {/* Title row with add action */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            Hola, {name.charAt(0).toUpperCase() + name.slice(1)} 👋
          </h1>
          <p className="text-[15px] mt-1" style={{ color: 'var(--text2)' }}>
            Tu resumen de lesiones
          </p>
        </div>
        <AddLesionForm userId={user.id} />
      </div>

      <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--accent)' }} /></div>}>
        <LesionList />
      </Suspense>
    </div>
  )
}
