import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MapPin, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useBusinessSearch } from '@/queries/useBusinessSearch'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import type { BusinessSearchResult } from '@/types'

interface BusinessSearchProps {
  onSelect: (business: BusinessSearchResult) => void
}

export function BusinessSearch({ onSelect }: BusinessSearchProps) {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, 400)
  const { data, isLoading, isFetching, isError } =
    useBusinessSearch(debouncedQuery)

  const showEmpty =
    !isLoading && !isError && debouncedQuery.trim().length > 1 && data?.length === 0

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="İşletme adı ve konum yazın, ör. ABC Diş Kliniği Kadıköy"
          className="h-12 pl-10 text-base"
        />
      </div>

      {(isLoading || isFetching) && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-sm text-destructive">
          İşletmeler aranırken bir hata oluştu. Lütfen tekrar deneyin.
        </p>
      )}

      {showEmpty && (
        <p className="text-sm text-muted-foreground">
          "{debouncedQuery}" için sonuç bulunamadı.
        </p>
      )}

      <AnimatePresence initial={false}>
        {!isLoading && !isFetching && data && data.length > 0 && (
          <div className="flex flex-col gap-3">
            {data.map((business, index) => (
              <motion.div
                key={business.placeId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
              >
                <Card className="flex flex-row items-center justify-between gap-4 p-4 text-left">
                  <div className="flex min-w-0 items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{business.name}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {business.formattedAddress}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="shrink-0"
                    onClick={() => onSelect(business)}
                  >
                    Seç
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
