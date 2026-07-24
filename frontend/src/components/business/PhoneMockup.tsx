import { IconQrcode } from '@tabler/icons-react'

export function PhoneMockup() {
  return (
    <div className="mx-auto w-48 rounded-[2rem] border border-border p-3">
      <div className="flex flex-col items-center gap-4 rounded-[1.25rem] border border-border px-4 py-8">
        <IconQrcode className="h-24 w-24 text-foreground" stroke={1.5} />
        <p className="text-sm text-muted-foreground">QR kodu tarayın</p>
      </div>
    </div>
  )
}
