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
    <div className="flex w-full flex-col items-center gap-6 pt-2 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-10 lg:grid-cols-[1.2fr_1fr]"
      >
        <div className="flex flex-col items-center gap-3 text-center lg:items-start lg:text-left">
          <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Google Değerlendirme Aracı
          </span>
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-primary">
              Google değerlendirme linkinizi
            </span>{' '}
            <span className="text-foreground">oluşturun</span>
          </h1>
          <p className="max-w-xl text-muted-foreground">
            İşletmenizi arayın, bir müşteri için özel değerlendirme talebi ve
            QR kod oluşturun.
          </p>
        </div>

        <PhoneMockup />
      </motion.div>

      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown className="h-5 w-5 text-muted-foreground" />
      </motion.div>

      <div className="w-full max-w-2xl rounded-xl border border-border bg-muted/40 p-8">
        <div className="flex w-full flex-col items-center gap-8">
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
      </div>

      <WhyUs />
    </div>
  )
}
