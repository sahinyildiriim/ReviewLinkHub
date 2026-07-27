import { motion } from 'framer-motion'
import { IconQrcode, IconStarFilled } from '@tabler/icons-react'
import { CheckCircle2 } from 'lucide-react'

export function PhoneMockup() {
  return (
    <div className="relative mx-auto w-56 sm:w-64" aria-hidden="true">
      <div className="absolute inset-0 -z-10 scale-90 rounded-full bg-primary/20 blur-3xl" />

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative rounded-[2.25rem] border-[6px] border-foreground/90 bg-foreground/90 p-1.5 shadow-2xl shadow-primary/10"
      >
        <div className="flex flex-col overflow-hidden rounded-[1.6rem] bg-card">
          <div className="flex flex-col items-center gap-2 bg-linear-to-br from-primary to-[oklch(0.55_0.2_265)] px-5 pt-7 pb-6 text-center">
            <span className="text-xs font-medium tracking-wide text-primary-foreground/80">
              Ada Kahve Dükkanı
            </span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <IconStarFilled key={i} className="h-3.5 w-3.5 text-primary-foreground" />
              ))}
            </div>
            <p className="text-sm font-medium text-primary-foreground">
              Deneyiminizi paylaşın
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 px-5 py-6">
            <div className="flex items-center justify-center rounded-xl border border-border bg-background p-3">
              <IconQrcode className="h-16 w-16 text-foreground" stroke={1.4} />
            </div>
            <div className="h-8 w-full rounded-lg bg-primary/90" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6, rotate: -6 }}
        animate={{ opacity: 1, y: 0, rotate: -6 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="absolute -right-6 top-10 flex items-center gap-1.5 rounded-xl border border-success/20 bg-card px-3 py-2 shadow-lg sm:-right-10"
      >
        <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
        <span className="text-xs font-medium whitespace-nowrap text-foreground">
          Talep gönderildi
        </span>
      </motion.div>
    </div>
  )
}
