import { CheckCircle2, Clock, ListChecks, XCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { ReviewRequestsSummary } from '@/types'

interface SummaryStatsProps {
  summary: ReviewRequestsSummary | undefined
  isLoading: boolean
}

export function SummaryStats({ summary, isLoading }: SummaryStatsProps) {
  const stats = [
    {
      label: 'Toplam Talep',
      value: summary?.totalRequests,
      icon: ListChecks,
      iconClassName: 'text-muted-foreground',
    },
    {
      label: 'Gönderildi',
      value: summary?.sentCount,
      icon: CheckCircle2,
      iconClassName: 'text-emerald-600',
    },
    {
      label: 'Başarısız',
      value: summary?.failedCount,
      icon: XCircle,
      iconClassName: 'text-destructive',
    },
    {
      label: 'Bekleyen',
      value: summary?.pendingCount,
      icon: Clock,
      iconClassName: 'text-amber-600',
    },
  ]

  return (
    <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, iconClassName }) => (
        <Card key={label} className="flex flex-col gap-2 p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{label}</span>
            <Icon className={`h-4 w-4 ${iconClassName}`} strokeWidth={1.75} />
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <span className="text-2xl font-semibold tracking-tight">
              {value ?? 0}
            </span>
          )}
        </Card>
      ))}
    </div>
  )
}
