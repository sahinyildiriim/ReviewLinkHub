import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { QrCodePanel } from '@/components/business/QrCodePanel'
import { statusBadgeVariant, statusLabels } from '@/lib/status'
import type { ReviewRequest } from '@/types'

interface RequestResultProps {
  request: ReviewRequest
  onCreateAnother: () => void
}

export function RequestResult({
  request,
  onCreateAnother,
}: RequestResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full"
    >
      <Card className="flex w-full flex-col items-center gap-6 p-6 text-center sm:p-8">
        <div className="flex flex-col items-center gap-2">
          <CheckCircle2 className="h-10 w-10 text-primary" />
          <h2 className="text-xl font-semibold">Talep oluşturuldu</h2>
          <p className="text-sm text-muted-foreground">
            {request.businessName}
          </p>
          <Badge variant={statusBadgeVariant[request.status]}>
            {statusLabels[request.status]}
          </Badge>
        </div>

        <QrCodePanel
          requestId={request.id}
          businessName={request.businessName}
          reviewUrl={request.reviewUrl}
        />

        <Button className="w-full" onClick={onCreateAnother}>
          Yeni Talep Oluştur
        </Button>
      </Card>
    </motion.div>
  )
}
