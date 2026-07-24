import { apiClient } from '@/lib/api-client'
import type { ReviewRequestsSummary, ReviewRequestStatus } from '@/types'

interface ReportFilters {
  search?: string
  status?: ReviewRequestStatus
}

async function downloadReport(
  path: string,
  filters: ReportFilters,
  filename: string,
) {
  const { data } = await apiClient.get<Blob>(path, {
    params: filters,
    responseType: 'blob',
  })

  const url = URL.createObjectURL(data)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function downloadExcelReport(filters: ReportFilters) {
  return downloadReport(
    '/api/reports/review-requests/excel',
    filters,
    'review-requests.xlsx',
  )
}

export function downloadPdfReport(filters: ReportFilters) {
  return downloadReport(
    '/api/reports/review-requests/pdf',
    filters,
    'review-requests.pdf',
  )
}

export async function getReviewRequestsSummary() {
  const { data } = await apiClient.get<ReviewRequestsSummary>(
    '/api/reports/review-requests/summary',
  )
  return data
}
