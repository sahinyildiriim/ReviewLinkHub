import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { BusinessSearch } from '@/components/business/BusinessSearch'
import { NewRequestForm } from '@/components/business/NewRequestForm'
import { RequestResult } from '@/components/business/RequestResult'
import { StepIndicator } from '@/components/business/StepIndicator'
import { PhoneMockup } from '@/components/business/PhoneMockup'
import { WhyUs } from '@/components/business/WhyUs'
import type { BusinessSearchResult, ReviewRequest } from '@/types'

export function HomePage() {
  const [selectedBusiness, setSelectedBusiness] =
    useState<BusinessSearchResult | null>(null)
  const [createdRequest, setCreatedRequest] = useState<ReviewRequest | null>(
    null,
  )

  const step = createdRequest ? 3 : selectedBusiness ? 2 : 1

  return (
    <div className="flex w-full flex-col items-center gap-14 pt-2 pb-14 sm:gap-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-12"
      >
        <div className="flex flex-col items-center gap-4 text-center lg:items-start lg:text-left">
          <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Google Değerlendirme Aracı
          </span>
          <h1 className="text-3xl leading-[1.1] font-bold tracking-tight sm:text-4xl lg:text-5xl">
            <span className="text-primary">
              Google değerlendirme linkinizi
            </span>{' '}
            <span className="text-foreground">saniyeler içinde oluşturun</span>
          </h1>
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            İşletmenizi arayın, bir müşteri için özel değerlendirme talebi ve
            QR kod oluşturun — biz gönderimi ve takibini üstlenelim.
          </p>
        </div>

        <PhoneMockup />
      </motion.div>

      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        className="-mt-8 sm:-mt-10"
        aria-hidden="true"
      >
        <ChevronDown className="h-5 w-5 text-muted-foreground" />
      </motion.div>

      <section
        aria-label="Değerlendirme talebi oluşturma sihirbazı"
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-muted/30 p-5 sm:p-8"
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary/70 via-primary to-primary/70" />
        <div className="flex w-full flex-col items-center gap-6 sm:gap-8">
          <StepIndicator step={step} />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="w-full"
          >
            <AnimatePresence mode="wait">
              {createdRequest ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <RequestResult
                    request={createdRequest}
                    onCreateAnother={() => {
                      setCreatedRequest(null)
                      setSelectedBusiness(null)
                    }}
                  />
                </motion.div>
              ) : selectedBusiness ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <NewRequestForm
                    business={selectedBusiness}
                    onBack={() => setSelectedBusiness(null)}
                    onCreated={setCreatedRequest}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="search"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <BusinessSearch onSelect={setSelectedBusiness} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <WhyUs />
    </div>
  )
}
