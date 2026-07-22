import { useState } from 'react'
import { BusinessSearch } from '@/components/business/BusinessSearch'
import { NewRequestForm } from '@/components/business/NewRequestForm'
import type { BusinessSearchResult, ReviewRequest } from '@/types'

export function HomePage() {
  const [selectedBusiness, setSelectedBusiness] =
    useState<BusinessSearchResult | null>(null)
  const [createdRequest, setCreatedRequest] = useState<ReviewRequest | null>(
    null,
  )

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 py-12">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">
          Google değerlendirme linkinizi oluşturun
        </h1>
        <p className="max-w-xl text-muted-foreground">
          İşletmenizi arayın, bir müşteri için özel değerlendirme talebi ve QR
          kod oluşturun.
        </p>
      </div>

      {createdRequest ? (
        <p className="text-sm text-muted-foreground">
          Talep #{createdRequest.id} oluşturuldu — sonuç ekranı bir sonraki
          adımda eklenecek.
        </p>
      ) : selectedBusiness ? (
        <NewRequestForm
          business={selectedBusiness}
          onBack={() => setSelectedBusiness(null)}
          onCreated={setCreatedRequest}
        />
      ) : (
        <BusinessSearch onSelect={setSelectedBusiness} />
      )}
    </div>
  )
}
