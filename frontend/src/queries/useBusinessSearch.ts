import { useQuery } from '@tanstack/react-query'
import { searchBusinesses } from '@/lib/api/businesses'

export function useBusinessSearch(query: string) {
  return useQuery({
    queryKey: ['business-search', query],
    queryFn: () => searchBusinesses(query),
    enabled: query.trim().length > 1,
  })
}
