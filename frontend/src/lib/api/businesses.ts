import { apiClient } from '@/lib/api-client'
import type { BusinessSearchResult } from '@/types'

export async function searchBusinesses(query: string) {
  const { data } = await apiClient.get<BusinessSearchResult[]>(
    '/api/businesses/search',
    { params: { query } },
  )
  return data
}
