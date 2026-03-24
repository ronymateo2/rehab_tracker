import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Activity, TrendingDown, TrendingUp, Minus, Dumbbell, StickyNote } from 'lucide-react'
import PainChart from '@/components/PainChart'
import SessionForm from '@/components/SessionForm'
import DeleteLesionButton from '@/components/DeleteLesionButton'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { painColor } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function LesionPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: lesion } = await supabase
    .from('lesions')
    .select(`*, sessions (*)`)
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!lesion) notFound()

  const ascSessions = [...(lesion.sessions || [])].sort((a, b) => {
    const diff = new Date(a.date).getTime() - new Date(b.date).getTime()
    if (diff === 0) return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    return diff
  })

  const chartData = ascSessions.map((s, i) => ({
    id: s.id || i.toString(),
    displayDate: format(parseISO(s.date), 'd MMM', { locale: es }),
    fullLabel: format(parseISO(s.created_at), "d MMM yyyy, HH:mm", { locale: es }),
    pain_level: s.pain_level
  }))

  const total = ascSessions.length
  const avg = total > 0 ? (ascSessions.reduce((a, s) => a + s.pain_level, 0) / total) : 0
  const last = total > 0 ? ascSessions[total - 1] : null
  const history = [...ascSessions].reverse()

  let trendLabel = ''
  let TrendIcon = Minus
  let trendColor = 'var(--text2)'
  if (total >= 2) {
    const prev = ascSessions[total - 2].pain_level
    const curr = last!.pain_level
    if (curr < prev) { trendLabel = 'Mejorando'; TrendIcon = TrendingDown; trendColor = 'var(--green)' }
    else if (curr > prev) { trendLabel = 'Empeorando'; TrendIcon = TrendingUp; trendColor = 'var(--red)' }
    else { trendLabel = 'Sin cambio'; TrendIcon = Minus }
  }

  return (
    <div className="space-y-6">
        {/* Header — same style as dashboard */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/dashboard" className="p-3 -ml-3 rounded-xl active:scale-90 transition-transform flex items-center justify-center shrink-0" style={{ color: 'var(--accent)' }}>
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: lesion.color }} />
              <h1 className="text-[28px] font-bold tracking-tight truncate" style={{ color: 'var(--text)' }}>
                {lesion.name}
              </h1>
            </div>
            {lesion.zone && (
              <p className="text-[14px] ml-5" style={{ color: 'var(--text2)' }}>{lesion.zone}</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {trendLabel && (
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-semibold" style={{ background: `color-mix(in srgb, ${trendColor} 10%, transparent)`, color: trendColor }}>
                <TrendIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{trendLabel}</span>
              </div>
            )}
            <SessionForm lesionId={lesion.id} userId={user.id} defaultPainLevel={last?.pain_level ?? 5} />
          </div>
        </div>

        {/* KPIs — same card style as LesionCard */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Sesiones', value: total, color: 'var(--accent)' },
            { label: 'Último', value: last ? last.pain_level : '–', color: last ? painColor(last.pain_level) : 'var(--text2)' },
            { label: 'Promedio', value: total > 0 ? avg.toFixed(1) : '–', color: 'var(--text)' },
          ].map(k => (
            <div key={k.label} className="p-4 rounded-2xl text-center" style={{ background: 'var(--card)', border: '0.5px solid var(--divider)', boxShadow: 'var(--shadow)' }}>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text2)' }}>{k.label}</p>
              <p className="text-[28px] font-bold tabular-nums leading-none" style={{ color: k.color }}>{k.value}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="p-5 sm:p-6 rounded-2xl" style={{ background: 'var(--card)', border: '0.5px solid var(--divider)', boxShadow: 'var(--shadow)' }}>
          <h3 className="text-[17px] font-semibold" style={{ color: 'var(--text)' }}>Evolución</h3>
          <p className="text-[13px] mb-1" style={{ color: 'var(--text2)' }}>
            {chartData.length > 0 ? `Últimas ${Math.min(chartData.length, 15)} sesiones` : 'Sin datos'}
          </p>
          <div className="h-56 sm:h-64">
            <PainChart data={chartData} color={lesion.color} />
          </div>
        </div>

        {/* History */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[20px] font-bold" style={{ color: 'var(--text)' }}>Historial</h3>
            <span className="text-[12px] font-semibold px-2.5 py-1 rounded-full tabular-nums" style={{ background: 'color-mix(in srgb, var(--accent) 10%, transparent)', color: 'var(--accent)' }}>
              {history.length}
            </span>
          </div>
          
          {history.length === 0 ? (
            <div className="text-center py-14 rounded-2xl" style={{ border: '1.5px dashed var(--divider)' }}>
              <Activity className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--text2)', opacity: 0.5 }} />
              <p className="text-[14px] font-medium" style={{ color: 'var(--text2)' }}>Sin registros aún</p>
              <p className="text-[12px] mt-0.5" style={{ color: 'var(--text2)', opacity: 0.6 }}>Presiona + para agregar</p>
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '0.5px solid var(--divider)', boxShadow: 'var(--shadow)' }}>
              {history.map((s, i) => {
                const pc = painColor(s.pain_level)
                return (
                  <div key={s.id} style={{ borderBottom: i < history.length - 1 ? '0.5px solid var(--divider)' : 'none' }}>
                    <div className="px-4 sm:px-5 py-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-[15px] font-medium" style={{ color: 'var(--text)' }}>
                            {format(parseISO(s.date), 'd MMM yyyy', { locale: es })}
                            <span className="mx-1.5" style={{ color: 'var(--text2)', opacity: 0.3 }}>·</span>
                            <span className="text-[13px] font-normal" style={{ color: 'var(--text2)' }}>{format(parseISO(s.created_at), 'HH:mm')}</span>
                          </p>
                          <p className="text-[12px] capitalize" style={{ color: 'var(--text2)' }}>
                            {format(parseISO(s.date), 'EEEE', { locale: es })}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[14px] font-bold tabular-nums shrink-0" style={{ background: `color-mix(in srgb, ${pc} 12%, transparent)`, color: pc }}>
                          <Activity className="w-3 h-3" />
                          {s.pain_level}
                        </div>
                      </div>

                      {(s.exercises || s.notes) && (
                        <div className="mt-3 space-y-2">
                          {s.exercises && (
                            <div className="flex gap-2">
                              <Dumbbell className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: 'var(--text2)', opacity: 0.4 }} />
                              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text2)' }}>{s.exercises}</p>
                            </div>
                          )}
                          {s.notes && (
                            <div className="flex gap-2">
                              <StickyNote className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: 'var(--orange)', opacity: 0.5 }} />
                              <p className="text-[13px] italic leading-relaxed" style={{ color: 'var(--text2)' }}>&ldquo;{s.notes}&rdquo;</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Zona de peligro */}
        <div className="pt-4 pb-8">
          <DeleteLesionButton lesionId={lesion.id} />
        </div>
    </div>
  )
}
