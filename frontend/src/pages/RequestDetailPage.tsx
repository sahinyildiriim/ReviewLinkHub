import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, RotateCw } from 'lucide-react'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { QrCodePanel } from '@/components/business/QrCodePanel'
import { useResendReviewRequest, useReviewRequest } from '@/queries/useReviewRequests'
import { statusBadgeVariant, statusLabels } from '@/lib/status'

export function RequestDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: request, isLoading, isError } = useReviewRequest(id)
  const { mutate: resend, isPending: isResending } = useResendReviewRequest()

  function handleResend() {
    if (!id) return
    resend(id, {
      onSuccess: (data) => {
        if (data.status === 'Sent') {
          toast.success('E-posta tekrar gönderildi.')
        } else {
          toast.error('Yeniden gönderim yine başarısız oldu.')
        }
      },
      onError: () => {
        toast.error('Yeniden gönderilemedi. Lütfen tekrar deneyin.')
      },
    })
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <Button variant="ghost" size="sm" className="self-start" asChild>
        <Link to="/requests">
          <ArrowLeft className="h-4 w-4" />
          Taleplere dön
        </Link>
      </Button>

      {isLoading ? (
        <Card className="flex flex-col items-center gap-6 p-8">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-48 w-48 rounded-lg" />
          <Skeleton className="h-10 w-full" />
        </Card>
      ) : isError || !request ? (
        <Card className="flex flex-col items-center gap-2 p-8 text-center">
          <p className="font-medium">Talep bulunamadı</p>
          <p className="text-sm text-muted-foreground">
            Bu ID'ye ait bir değerlendirme talebi yok.
          </p>
        </Card>
      ) : (
        <Card className="flex w-full flex-col items-center gap-6 p-8 text-center">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-xl font-semibold">{request.businessName}</h1>
            <Badge variant={statusBadgeVariant[request.status]}>
              {statusLabels[request.status]}
            </Badge>
            <p className="text-sm text-muted-foreground">
              Oluşturulma:{' '}
              {new Date(request.createdAtUtc).toLocaleString('tr-TR')}
            </p>
          </div>

          {request.status === 'Failed' && (
            <Button
              variant="outline"
              className="w-full"
              disabled={isResending}
              onClick={handleResend}
            >
              <RotateCw className="h-4 w-4" />
              {isResending ? 'Gönderiliyor…' : 'Yeniden Gönder'}
            </Button>
          )}

          <QrCodePanel
            requestId={request.id}
            businessName={request.businessName}
            reviewUrl={request.reviewUrl}
          />
        </Card>
      )}
    </div>
  )
}
