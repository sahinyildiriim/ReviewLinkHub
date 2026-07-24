import { apiClient } from '@/lib/api-client'
import type {
  CreateReviewRequestPayload,
  PagedResult,
  ReviewRequest,
  ReviewRequestListParams,
} from '@/types'

export async function createReviewRequest(
  payload: CreateReviewRequestPayload,
) {
  const { data } = await apiClient.post<ReviewRequest>(
    '/api/review-requests',
    payload,
  )
  return data
}

export async function resendReviewRequest(id: string) {
  const { data } = await apiClient.post<ReviewRequest>(
    `/api/review-requests/${id}/resend`,
  )
  return data
}

export async function getReviewRequest(id: string) {
  const { data } = await apiClient.get<ReviewRequest>(
    `/api/review-requests/${id}`,
  )
  return data
}

export async function listReviewRequests(params: ReviewRequestListParams) {
  const { data } = await apiClient.get<PagedResult<ReviewRequest>>(
    '/api/review-requests',
    { params },
  )
  return data
}

export function getQrCodeUrl(id: string) {
  return `${apiClient.defaults.baseURL}/api/review-requests/${id}/qr-code`
}

export async function downloadQrCode(id: string, businessName: string) {
  const { data } = await apiClient.get<Blob>(
    `/api/review-requests/${id}/qr-code`,
    { responseType: 'blob' },
  )

  const url = URL.createObjectURL(data)
  const link = document.createElement('a')
  link.href = url
  link.download = `${businessName}-review-qr.png`
  link.click()
  URL.revokeObjectURL(url)
}
