export type ReviewRequestStatus = 'Pending' | 'Sent' | 'Failed'

export interface BusinessSearchResult {
  placeId: string
  name: string
  formattedAddress: string
  googleMapsUrl: string | null
}

export interface CreateReviewRequestPayload {
  placeId: string
  businessName: string
  businessAddress: string
  googleMapsUrl: string | null
  recipientName: string
  recipientEmail: string
}

export interface ReviewRequest {
  id: string
  businessName: string
  reviewUrl: string
  status: ReviewRequestStatus
  createdAtUtc: string
}

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
}

export interface ReviewRequestListParams {
  search?: string
  status?: ReviewRequestStatus
  page?: number
  pageSize?: number
}
