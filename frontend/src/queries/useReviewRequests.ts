import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createReviewRequest,
  getReviewRequest,
  listReviewRequests,
} from '@/lib/api/reviewRequests'
import type { CreateReviewRequestPayload, ReviewRequestListParams } from '@/types'

export function useReviewRequestsList(params: ReviewRequestListParams) {
  return useQuery({
    queryKey: ['review-requests', params],
    queryFn: () => listReviewRequests(params),
    placeholderData: (previous) => previous,
  })
}

export function useReviewRequest(id: string | undefined) {
  return useQuery({
    queryKey: ['review-requests', id],
    queryFn: () => getReviewRequest(id!),
    enabled: Boolean(id),
  })
}

export function useCreateReviewRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateReviewRequestPayload) =>
      createReviewRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review-requests'] })
    },
  })
}
