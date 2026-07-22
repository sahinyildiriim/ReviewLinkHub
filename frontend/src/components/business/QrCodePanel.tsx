import { useState } from 'react'
import { Check, Copy, Download } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { downloadQrCode, getQrCodeUrl } from '@/lib/api/reviewRequests'

interface QrCodePanelProps {
  requestId: string
  businessName: string
  reviewUrl: string
}

export function QrCodePanel({
  requestId,
  businessName,
  reviewUrl,
}: QrCodePanelProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(reviewUrl)
    setCopied(true)
    toast.success('Bağlantı kopyalandı.')
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleDownload() {
    try {
      await downloadQrCode(requestId, businessName)
    } catch {
      toast.error('QR kod indirilemedi.')
    }
  }

  return (
    <>
      <img
        src={getQrCodeUrl(requestId)}
        alt="Değerlendirme QR kodu"
        className="h-48 w-48 rounded-lg border border-border p-2"
      />

      <div className="flex w-full items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2">
        <span className="min-w-0 flex-1 truncate text-left text-sm text-muted-foreground">
          {reviewUrl}
        </span>
        <Button variant="ghost" size="sm" onClick={handleCopy}>
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Button variant="outline" className="w-full" onClick={handleDownload}>
        <Download className="h-4 w-4" />
        QR Kodu İndir
      </Button>
    </>
  )
}
