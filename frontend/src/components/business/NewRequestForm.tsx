import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateReviewRequest } from '@/queries/useReviewRequests'
import type { BusinessSearchResult, ReviewRequest } from '@/types'

interface NewRequestFormProps {
  business: BusinessSearchResult
  onBack: () => void
  onCreated: (request: ReviewRequest) => void
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function NewRequestForm({
  business,
  onBack,
  onCreated,
}: NewRequestFormProps) {
  const [recipientName, setRecipientName] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const { mutate, isPending } = useCreateReviewRequest()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!EMAIL_PATTERN.test(recipientEmail)) {
      setEmailError('Geçerli bir e-posta adresi girin.')
      return
    }
    setEmailError(null)

    mutate(
      {
        placeId: business.placeId,
        businessName: business.name,
        businessAddress: business.formattedAddress,
        googleMapsUrl: business.googleMapsUrl,
        recipientName,
        recipientEmail,
      },
      {
        onSuccess: (data) => {
          toast.success('Talep oluşturuldu ve gönderim başlatıldı.')
          onCreated(data)
        },
        onError: () => {
          toast.error('Talep oluşturulamadı. Lütfen tekrar deneyin.')
        },
      },
    )
  }

  return (
    <Card className="flex w-full flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">Seçilen işletme</p>
          <p className="truncate font-medium">{business.name}</p>
          <p className="truncate text-sm text-muted-foreground">
            {business.formattedAddress}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onBack} type="button">
          Değiştir
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="recipientName">Alıcı adı</Label>
          <Input
            id="recipientName"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="Ör. Ayşe Yılmaz"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="recipientEmail">Alıcı e-posta</Label>
          <Input
            id="recipientEmail"
            type="email"
            value={recipientEmail}
            onChange={(e) => {
              setRecipientEmail(e.target.value)
              if (emailError) setEmailError(null)
            }}
            placeholder="ornek@sirket.com"
            required
          />
          {emailError && (
            <p className="text-sm text-destructive">{emailError}</p>
          )}
        </div>

        <Button type="submit" disabled={isPending} className="mt-2">
          {isPending ? 'Gönderiliyor…' : 'Talep Oluştur ve Gönder'}
        </Button>
      </form>
    </Card>
  )
}
