import type { ReviewRequestStatus } from '@/types'

export const statusLabels: Record<ReviewRequestStatus, string> = {
  Pending: 'Beklemede',
  Sent: 'Gönderildi',
  Failed: 'Başarısız',
}

export const statusBadgeVariant: Record<
  ReviewRequestStatus,
  'secondary' | 'default' | 'destructive'
> = {
  Pending: 'secondary',
  Sent: 'default',
  Failed: 'destructive',
}
