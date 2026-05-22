import Link from "next/link"
import { ArrowLeft, Edit, Plus, Truck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DeleteSubmitButton } from "@/components/delete-submit-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/data"
import { WhatsAppButton } from "@/components/shared/whatsapp-button"
import { formatDateDisplay, formatMoney, todayIso } from "@/lib/client/format"
import { clientTypeLabel, habitualDayLabel } from "@/lib/client/client-segments"
import { deactivateOwnClientAction, deleteOwnClientAction, reactivateOwnClientAction } from "@/lib/actions/deliveries"
import type { Delivery, OwnClient } from "@/lib/types"

export function ClientDetail({
  client,
  deliveries,
  created,
  updated,
}: {
  client: OwnClient
  deliveries: Delivery[]
  created?: string
  updated?: string
}) {
  const clientDeliveries = deliveries.filter((delivery) => delivery.client_id === client.id)
  const paidTotal = clientDeliveries.reduce((acc, delivery) => acc + Number(delivery.paid_amount || 0), 0)
  const pendingBalance = Number(client.balance || 0)
  const debtMessage = `Hola ${client.name}, te escribimos de Agua de Mesa Dos Hermanas. Te recordamos que al día ${formatDateDisplay(todayIso())} tenés un saldo pendiente de ${formatMoney(pendingBalance)}. Cuando puedas, podés regularizarlo. Gracias.`

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/clientes">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="min-w-0">
            <h1 className="break-words text-2xl font-bold text-foreground">{client.name}</h1>
            <p className="text-sm text-muted-foreground">Cliente propio de reparto</p>
          </div>
        </div>
        <Link href={`/clientes/${client.id}/editar`}>
          <Button variant="outline" size="sm" className="gap-2">
            <Edit className="h-4 w-4" />
            Editar
          </Button>
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {client.is_active !== false ? (
          <form action={deactivateOwnClientAction}>
            <input type="hidden" name="id" value={client.id} />
            <Button type="submit" variant="outline" size="sm" className="text-warning hover:text-warning">
              Desactivar cliente
            </Button>
          </form>
        ) : (
          <form action={reactivateOwnClientAction}>
            <input type="hidden" name="id" value={client.id} />
            <Button type="submit" variant="outline" size="sm" className="text-success hover:text-success">
              Reactivar cliente
            </Button>
          </form>
        )}
        <form action={deleteOwnClientAction}>
          <input type="hidden" name="id" value={client.id} />
          <DeleteSubmitButton
            label="Eliminar definitivamente"
            title="Eliminar cliente definitivamente"
            description="¿Seguro que querés eliminar este registro? Esta acción no se puede deshacer."
            confirmLabel="Eliminar definitivamente"
          />
        </form>
      </div>

      {created && <StatusMessage text="Cliente creado correctamente." />}
      {updated && <StatusMessage text="Cliente actualizado correctamente." />}

      {pendingBalance > 0 && (
        <Card>
          <CardContent className="flex flex-col gap-3 p-3 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
            <p className="text-sm text-muted-foreground">Saldo pendiente: <span className="font-semibold text-foreground">{formatCurrency(pendingBalance)}</span></p>
            {client.phone ? (
              <WhatsAppButton phone={client.phone} message={debtMessage} />
            ) : (
              <p className="text-sm text-warning">Este cliente no tiene teléfono cargado.</p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Saldo</p>
            <p className="safe-number text-xl font-bold">{formatCurrency(Number(client.balance || 0))}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Bidones en calle</p>
            <p className="safe-number text-xl font-bold">{client.bottles_in_street}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Repartos</p>
            <p className="safe-number text-xl font-bold">{clientDeliveries.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Pagos registrados</p>
            <p className="safe-number text-xl font-bold">{formatCurrency(paidTotal)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Datos del cliente</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm min-[520px]:grid-cols-2">
          <Info label="Teléfono" value={client.phone || "Sin teléfono"} />
          <Info label="Dirección" value={client.address || "Sin dirección"} />
          <Info label="Sector" value={client.sector || "Otros"} />
          <Info label="Grupo" value={client.delivery_group || "Sin grupo"} />
          <Info label="Día habitual" value={(client.habitual_days || []).map(habitualDayLabel).join(", ") || "Sin día habitual"} />
          <Info label="Tipo" value={clientTypeLabel(client.client_type)} />
          <Info label="Estado" value={client.is_active !== false ? "Activo" : "Inactivo"} />
          <Info label="Notas" value={client.notes || "Sin notas"} />
        </CardContent>
      </Card>

      <div className="grid gap-3 min-[420px]:grid-cols-2">
        <Link href={`/repartos/nuevo?client=${client.id}`}>
          <Button className="h-12 w-full gap-2">
            <Plus className="h-4 w-4" />
            Registrar reparto para este cliente
          </Button>
        </Link>
        <Link href="/caja">
          <Button variant="outline" className="h-12 w-full">
            Ver caja
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Historial de repartos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {clientDeliveries.map((delivery) => (
            <Link key={delivery.id} href={`/repartos/${delivery.id}`}>
              <div className="rounded-lg border p-3 transition-colors hover:bg-muted/50">
                <div className="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Truck className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium">{delivery.delivery_date}</p>
                      <p className="text-xs text-muted-foreground">
                        {delivery.delivered_qty} entregados · {delivery.returned_empty_qty} vacíos devueltos
                      </p>
                    </div>
                  </div>
                  <div className="text-left min-[420px]:text-right">
                    <p className="font-semibold">{formatCurrency(Number(delivery.total_amount || 0))}</p>
                    <Badge variant={delivery.payment_status === "PAGADO" ? "default" : delivery.payment_status === "PARCIAL" ? "secondary" : "outline"} className="text-[10px]">
                      {delivery.payment_status === "PAGADO" ? "Pagado" : delivery.payment_status === "PARCIAL" ? "Parcial" : "Pendiente"}
                    </Badge>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {clientDeliveries.length === 0 && (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              Este cliente todavía no tiene repartos cargados.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="break-words font-medium">{value}</p>
    </div>
  )
}

function StatusMessage({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success">
      {text}
    </div>
  )
}
