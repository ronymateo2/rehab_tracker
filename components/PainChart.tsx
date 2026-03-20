'use client'

import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

interface PainChartProps {
  data: { id: string; displayDate: string; fullLabel: string; pain_level: number }[]
  color: string
}

const CustomTooltip = ({ active, payload }: { active?: boolean, payload?: any[] }) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3.5 py-2.5 rounded-xl text-center" style={{ background: 'var(--card)', boxShadow: 'var(--shadow-lg)', border: '0.5px solid var(--divider)' }}>
        <p className="text-[11px] font-medium" style={{ color: 'var(--text2)' }}>{payload[0].payload.fullLabel}</p>
        <p className="text-[17px] font-bold mt-0.5" style={{ color: 'var(--text)' }}>
          {payload[0].value}<span className="text-[12px] font-normal" style={{ color: 'var(--text2)' }}> / 10</span>
        </p>
      </div>
    )
  }
  return null
}

export default function PainChart({ data, color }: PainChartProps) {
  if (data.length < 2) {
    return (
      <div className="h-full flex items-center justify-center rounded-xl p-6" style={{ border: '1.5px dashed var(--divider)' }}>
        <p className="text-[13px] text-center" style={{ color: 'var(--text2)' }}>
          Registra al menos 2 sesiones para ver la evolución.
        </p>
      </div>
    )
  }

  const chartData = data.slice(-15)

  return (
    <div className="h-full w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`g-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.15} />
              <stop offset="100%" stopColor={color} stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="id"
            tickFormatter={(_v, i) => chartData[i]?.displayDate || ''}
            axisLine={false} tickLine={false}
            tick={{ fontSize: 11, fill: 'var(--text2)' }}
            dy={10}
          />
          <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text2)' }} dx={-10} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="natural"
            dataKey="pain_level"
            stroke={color}
            strokeWidth={2}
            fill={`url(#g-${color.replace('#', '')})`}
            dot={{ r: 3.5, strokeWidth: 2, fill: 'var(--card)', stroke: color }}
            activeDot={{ r: 5, strokeWidth: 2, fill: color, stroke: 'var(--card)' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
