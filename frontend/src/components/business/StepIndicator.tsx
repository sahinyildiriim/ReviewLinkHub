import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepIndicatorProps {
  step: 1 | 2 | 3
}

const steps = ['Ara', 'Bilgi Gir', 'Hazır']

export function StepIndicator({ step }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((label, i) => {
        const stepNumber = i + 1
        const isActive = stepNumber === step
        const isDone = stepNumber < step

        return (
          <div key={label} className="flex items-center gap-2">
            <div
              className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors',
                isDone
                  ? 'bg-primary text-primary-foreground'
                  : isActive
                    ? 'border-2 border-primary text-primary'
                    : 'border border-border text-muted-foreground',
              )}
            >
              {isDone ? <Check className="h-3 w-3" /> : stepNumber}
            </div>
            <span
              className={cn(
                'text-sm',
                isActive
                  ? 'font-medium text-foreground'
                  : 'text-muted-foreground',
              )}
            >
              {label}
            </span>
            {stepNumber < steps.length && (
              <div className="h-px w-6 bg-border" />
            )}
          </div>
        )
      })}
    </div>
  )
}
