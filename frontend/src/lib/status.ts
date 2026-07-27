import type { ReviewRequestStatus } from '@/types'

export const statusLabels: Record<ReviewRequestStatus, string> = {
  Pending: 'Beklemede',
  Sent: 'Gönderildi',
  Failed: 'Başarısız',
}

export const statusBadgeVariant: Record<
  ReviewRequestStatus,
  'warning' | 'success' | 'destructive'
> = {
  Pending: 'warning',
  Sent: 'success',
  Failed: 'destructive',
}
