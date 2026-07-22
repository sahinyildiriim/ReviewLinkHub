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
