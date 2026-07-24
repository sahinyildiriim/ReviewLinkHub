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
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map(({ icon: Icon, title, description }) => (
        <div
          key={title}
          className="flex flex-col gap-2 rounded-lg border border-border p-5"
        >
          <Icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      ))}
    </div>
  )
}
