import { FileText, ListChecks, Zap } from 'lucide-react'

const items = [
  {
    icon: Zap,
    title: 'Hızlı',
    description:
      'İşletmenizi arayın, saniyeler içinde review linki ve QR kodunuz hazır olsun.',
  },
  {
    icon: ListChecks,
    title: 'Takip Edilebilir',
    description:
      'Gönderdiğiniz her talebi durumuna göre arayın, filtreleyin, tek panelden izleyin.',
  },
  {
    icon: FileText,
    title: 'Raporlanabilir',
    description:
      'Kayıtlarınızı istediğiniz an Excel veya PDF olarak dışa aktarın.',
  },
]

export function WhyUs() {
  return (
    <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map(({ icon: Icon, title, description }) => (
        <div
          key={title}
          className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
        >
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
            <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      ))}
    </div>
  )
}
