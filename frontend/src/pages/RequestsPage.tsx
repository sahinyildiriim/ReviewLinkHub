import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, FileSpreadsheet, FileText, Search } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useReviewRequestsList } from '@/queries/useReviewRequests'
import { useReportsSummary } from '@/queries/useReportsSummary'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { downloadExcelReport, downloadPdfReport } from '@/lib/api/reports'
import { statusBadgeVariant, statusLabels } from '@/lib/status'
import { SummaryStats } from '@/components/business/SummaryStats'
import { TrendChart } from '@/components/business/TrendChart'
import type { ReviewRequestStatus } from '@/types'

const PAGE_SIZE = 20
const ALL_STATUSES = 'all'

export function RequestsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ReviewRequestStatus | typeof ALL_STATUSES>(
    ALL_STATUSES,
  )
  const [page, setPage] = useState(1)
  const [exporting, setExporting] = useState<'excel' | 'pdf' | null>(null)

  const debouncedSearch = useDebouncedValue(search, 400)

  const { data, isLoading, isFetching, isError } = useReviewRequestsList({
    search: debouncedSearch || undefined,
    status: status === ALL_STATUSES ? undefined : status,
    page,
    pageSize: PAGE_SIZE,
  })

  const { data: summary, isLoading: isSummaryLoading } = useReportsSummary()

  const totalPages = data ? Math.max(1, Math.ceil(data.totalCount / data.pageSize)) : 1

  function updateSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  function updateStatus(value: string) {
    setStatus(value as ReviewRequestStatus | typeof ALL_STATUSES)
    setPage(1)
  }

  const reportFilters = {
    search: debouncedSearch || undefined,
    status: status === ALL_STATUSES ? undefined : status,
  }

  async function handleExport(format: 'excel' | 'pdf') {
    setExporting(format)
    try {
      if (format === 'excel') {
        await downloadExcelReport(reportFilters)
      } else {
        await downloadPdfReport(reportFilters)
      }
    } catch {
      toast.error('Rapor indirilemedi.')
    } finally {
      setExporting(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Talepler</h1>
          <p className="text-muted-foreground">
            Gönderilen değerlendirme taleplerini görüntüleyin ve yönetin.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={exporting !== null}
            onClick={() => handleExport('excel')}
          >
            <FileSpreadsheet className="h-4 w-4" />
            {exporting === 'excel' ? 'İndiriliyor…' : 'Excel'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={exporting !== null}
            onClick={() => handleExport('pdf')}
          >
            <FileText className="h-4 w-4" />
            {exporting === 'pdf' ? 'İndiriliyor…' : 'PDF'}
          </Button>
        </div>
      </div>

      <SummaryStats summary={summary} isLoading={isSummaryLoading} />

      <TrendChart data={summary?.dailyTrend} isLoading={isSummaryLoading} />

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => updateSearch(e.target.value)}
            placeholder="İşletme adı veya alıcı e-posta ile ara"
            className="pl-10"
          />
        </div>
        <Select value={status} onValueChange={updateStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Durum" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_STATUSES}>Tüm durumlar</SelectItem>
            <SelectItem value="Pending">Beklemede</SelectItem>
            <SelectItem value="Sent">Gönderildi</SelectItem>
            <SelectItem value="Failed">Başarısız</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>İşletme</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Oluşturulma Tarihi</TableHead>
              <TableHead className="text-right">İşlem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(isLoading || isFetching) && !data ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={4}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-10 text-center text-destructive"
                >
                  Talepler yüklenirken bir hata oluştu.
                </TableCell>
              </TableRow>
            ) : data && data.items.length > 0 ? (
              data.items.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    {request.businessName}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant[request.status]}>
                      {statusLabels[request.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(request.createdAtUtc).toLocaleString('tr-TR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/requests/${request.id}`}>Detay</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-10 text-center text-muted-foreground"
                >
                  {debouncedSearch || status !== ALL_STATUSES
                    ? 'Arama kriterlerine uygun kayıt bulunamadı.'
                    : 'Henüz talep oluşturulmadı.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data && data.totalCount > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Toplam {data.totalCount} kayıt — sayfa {data.page} / {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
              Önceki
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Sonraki
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
