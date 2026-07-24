import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { DailyTrendPoint } from '@/types'

interface TrendChartProps {
  data: DailyTrendPoint[] | undefined
  isLoading: boolean
}

export function TrendChart({ data, isLoading }: TrendChartProps) {
  return (
    <Card className="w-full p-6">
      <h3 className="mb-4 text-sm font-medium text-muted-foreground">
        Günlük Gönderim Trendi
      </h3>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : !data || data.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
          Henüz gösterilecek veri yok.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={256}>
          <LineChart data={data} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              className="fill-muted-foreground"
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12 }}
              className="fill-muted-foreground"
            />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line
              type="linear"
              dataKey="sentCount"
              name="Gönderildi"
              stroke="#16a34a"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="linear"
              dataKey="failedCount"
              name="Başarısız"
              stroke="#dc2626"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
