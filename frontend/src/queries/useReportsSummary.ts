import { useQuery } from '@tanstack/react-query'
import { getReviewRequestsSummary } from '@/lib/api/reports'

export function useReportsSummary() {
  return useQuery({
    queryKey: ['review-requests-summary'],
    queryFn: getReviewRequestsSummary,
  })
}
