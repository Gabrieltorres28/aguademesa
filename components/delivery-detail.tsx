import Link from "next/link"
import { ArrowLeft, Edit, Package, Truck, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/data"
import { deleteDeliveryAction } from "@/lib/actions/deliveries"
import { DeleteSubmitButton } from "@/components/delete-submit-button"
import type { Delivery } from "@/lib/types"

export function DeliveryDetail({ delivery }: { delivery?: Delivery | null }) {
  if (!delivery) {
    return (
      <div className="p-4 md:p-6">
        <p>Reparto no encontrado</p>
      </div>
    )
  }

  const total = Number(delivery.total_amount || 0)
  const paid = Number(delivery.paid_amount || 0)
  const pending = Math.max(total - paid, 0)
  const bottlesDelta = Number(delivery.delivered_qty || 0) - Number(delivery.returned_empty_qty || 0)

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex items-center gap-3 min-w-0 min-[380px]:gap-4">
        <Link href="/repartos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="break-words text-xl font-bold text-foreground min-[380px]:text-2xl">Reparto propio</h1>
            <Badge variant={delivery.payment_status === "PAGADO" ? "default" : delivery.payment_status === "PARCIAL" ? "secondary" : "outline"}>
              {delivery.payment_status === "PAGADO" ? "Pagado" : delivery.payment_status === "PARCIAL" ? "Parcial" : "Pendiente"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{delivery.delivery_date}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href={`/repartos/${delivery.id}/editar`}>
          <Button variant="outline" size="sm" className="gap-2">
            <Edit className="h-4 w-4" />
            Editar
          </Button>
        </Link>
        <form action={deleteDeliveryAction}>
          <input type="hidden" name="id" value={delivery.id} />
          <DeleteSubmitButton />
        </form>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Cliente y producto</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 min-[420px]:grid-cols-2">
          <Info icon={User} label="Cliente propio" value={delivery.own_clients?.name || "Cliente"} />
          <Info icon={Package} label="Producto" value={delivery.product} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Bidones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 text-center min-[360px]:grid-cols-3">
            <Metric label="Entregados" value={String(delivery.delivered_qty)} tone="success" />
            <Metric label="Vacíos devueltos" value={String(delivery.returned_empty_qty)} tone="accent" />
            <Metric label="Cambio en calle" value={`${bottlesDelta >= 0 ? "+" : ""}${bottlesDelta}`} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Cobro automático</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <MoneyRow label="Cuenta" value={`${delivery.delivered_qty} x ${formatCurrency(Number(delivery.unit_price || 0))}`} />
          <MoneyRow label="Total" value={formatCurrency(total)} tone="success" />
          <MoneyRow label="Cobrado" value={formatCurrency(paid)} />
          <MoneyRow label="Pendiente" value={formatCurrency(pending)} tone={pending > 0 ? "warning" : "success"} />
        </CardContent>
      </Card>

      {delivery.notes && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Observaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{delivery.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function Info({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="break-words font-semibold">{value}</p>
      </div>
    </div>
  )
}

function Metric({ label, value, tone }: { label: string; value: string; tone?: "success" | "accent" }) {
  const toneClass = tone === "success" ? "text-success bg-success/10" : tone === "accent" ? "text-accent bg-accent/10" : "text-foreground bg-muted"
  return (
    <div className={`min-w-0 rounded-lg p-3 ${toneClass}`}>
      <p className="safe-number text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

function MoneyRow({ label, value, tone }: { label: string; value: string; tone?: "success" | "warning" }) {
  const toneClass = tone === "success" ? "text-success bg-success/10" : tone === "warning" ? "text-warning bg-warning/10" : "text-foreground bg-muted/50"
  return (
    <div className={`flex flex-col gap-1 rounded-lg p-3 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between ${toneClass}`}>
      <span className="text-sm text-muted-foreground min-[420px]:text-base">{label}</span>
      <span className="safe-number text-lg font-bold min-[420px]:text-xl">{value}</span>
    </div>
  )
}
