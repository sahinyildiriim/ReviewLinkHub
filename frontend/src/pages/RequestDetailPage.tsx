import { useParams } from 'react-router-dom'

export function RequestDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Talep Detayı</h1>
      <p className="text-muted-foreground">ID: {id}</p>
    </div>
  )
}
