import Link from 'next/link'
import { ChevronRight, Activity, CalendarDays } from 'lucide-react'
import { painColor } from '@/lib/utils'

interface LesionCardProps {
  lesion: {
    id: string
    name: string
    zone: string | null
    color: string
    sessions?: { id: string; date: string; pain_level: number }[]
  }
  isLast?: boolean
}

export default function LesionCard({ lesion, isLast = false }: LesionCardProps) {
  const count = lesion.sessions?.length || 0
  const last = count > 0 ? lesion.sessions![count - 1] : null
  
  let trend = ''
  let trendColor = 'var(--text2)'
  if (count >= 2) {
    const prev = lesion.sessions![count - 2].pain_level
    const curr = last!.pain_level
    if (curr < prev) { trend = '↘ Mejor'; trendColor = 'var(--green)' }
    else if (curr > prev) { trend = '↗ Peor'; trendColor = 'var(--red)' }
    else { trend = '→ Igual'; trendColor = 'var(--text2)' }
  }

  return (
    <Link href={`/lesion/${lesion.id}`}>
      <div 
        className="px-4 sm:px-5 py-4 transition-colors active:bg-[var(--subtle)] cursor-pointer group flex items-center justify-between gap-3"
        style={{ borderBottom: isLast ? 'none' : '0.5px solid var(--divider)' }}
      >
        {/* Left: dot + name */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: lesion.color }} />
          <div className="min-w-0">
            <h3 className="text-[16px] font-semibold truncate" style={{ color: 'var(--text)' }}>{lesion.name}</h3>
            {lesion.zone && <p className="text-[13px] truncate" style={{ color: 'var(--text2)' }}>{lesion.zone}</p>}
          </div>
        </div>

        {/* Right: stats + chevron */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" style={{ color: 'var(--text2)' }} />
            <span className="text-[15px] font-semibold tabular-nums" style={{ color: last ? painColor(last.pain_level) : 'var(--text2)' }}>
              {last ? last.pain_level : '–'}
            </span>
          </div>
          {trend && <span className="text-[11px] font-semibold hidden sm:inline" style={{ color: trendColor }}>{trend}</span>}
          <div className="w-px h-4" style={{ background: 'var(--divider)' }} />
          <div className="flex items-center gap-1">
            <CalendarDays className="w-3.5 h-3.5" style={{ color: 'var(--text2)' }} />
            <span className="text-[15px] font-semibold tabular-nums" style={{ color: 'var(--text)' }}>{count}</span>
          </div>
          <ChevronRight className="w-4 h-4" style={{ color: 'var(--text2)', opacity: 0.4 }} />
        </div>
      </div>
    </Link>
  )
}
