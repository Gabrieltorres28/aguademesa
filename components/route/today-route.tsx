import Link from "next/link"
import { CalendarDays, Check, ClipboardPlus, MapPin, MessageCircleMore, PackagePlus, UserRound } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { WhatsAppButton } from "@/components/shared/whatsapp-button"
import { createQuickOrderAction, setOrderStatusAction } from "@/lib/actions/orders"
import { clientSectors, habitualDayLabel, sectorBroadcastMessage, todayHabitualDay } from "@/lib/client/client-segments"
import { formatDateDisplay } from "@/lib/client/format"
import type { ClientOrder, ClientSector, OwnClient } from "@/lib/types"

export function TodayRoute({ clients, orders, date, status, error }: { clients: OwnClient[]; orders: ClientOrder[]; date: string; status?: string; error?: string }) {
  const activeClients = clients.filter((client) => client.is_active !== false)
  const currentDay = todayHabitualDay()
  const routeOrders = orders.filter((order) => order.status !== "CANCELADO")
  const orderedClientIds = new Set(routeOrders.map((order) => order.client_id))
  const suggestedClients = activeClients.filter((client) => (client.habitual_days || []).includes(currentDay) && !orderedClientIds.has(client.id))

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex flex-col gap-3 min-[520px]:flex-row min-[520px]:items-start min-[520px]:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Recorrido de hoy</h1>
          <p className="flex items-center gap-1 text-sm text-muted-foreground"><CalendarDays className="h-4 w-4" />{formatDateDisplay(date)}</p>
        </div>
        <Link href="/repartos/nuevo">
          <Button variant="outline" className="gap-2"><PackagePlus className="h-4 w-4" />Registrar reparto</Button>
        </Link>
      </div>

      {status && <Message tone="success" text={status} />}
      {error && <Message tone="error" text={error} />}

      <div className="grid gap-3 min-[420px]:grid-cols-3">
        <Summary label="Pedidos de hoy" value={routeOrders.length} />
        <Summary label="Pendientes" value={routeOrders.filter((order) => order.status === "PENDIENTE").length} />
        <Summary label="Sugeridos" value={suggestedClients.length} />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base"><ClipboardPlus className="h-4 w-4" />Agregar pedido rápido</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createQuickOrderAction} className="grid gap-3 lg:grid-cols-[minmax(220px,1.5fr)_minmax(160px,1fr)_110px_auto] lg:items-end">
            <input type="hidden" name="order_date" value={date} />
            <div className="space-y-2">
              <Label htmlFor="client_id">Cliente</Label>
              <select id="client_id" name="client_id" required className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="">Seleccionar cliente</option>
                {activeClients.map((client) => <option key={client.id} value={client.id}>{client.name} - {client.sector || "Otros"}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="product">Producto</Label>
              <Input id="product" name="product" defaultValue="Bidón 20L" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Cantidad</Label>
              <Input id="quantity" name="quantity" type="number" min="1" defaultValue="1" required />
            </div>
            <Button type="submit" className="h-10">Agregar</Button>
            <div className="space-y-2 lg:col-span-4">
              <Label htmlFor="notes">Observaciones</Label>
              <Textarea id="notes" name="notes" rows={2} placeholder="Portón, horario, pedido por WhatsApp..." />
            </div>
          </form>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">Pedidos confirmados</h2>
          <p className="text-sm text-muted-foreground">El pedido con fecha define quién entra en el recorrido.</p>
        </div>
        {clientSectors.map((sector) => (
          <SectorOrders key={sector} sector={sector} orders={routeOrders.filter((order) => (order.own_clients?.sector || "Otros") === sector)} />
        ))}
        {routeOrders.length === 0 && <Empty text="Todavía no hay pedidos para hoy." />}
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">Sugeridos por día habitual</h2>
          <p className="text-sm text-muted-foreground">Hoy corresponde {habitualDayLabel(currentDay)}. Agregá pedido solo cuando quede confirmado.</p>
        </div>
        {clientSectors.map((sector) => (
          <SectorSuggestions key={sector} sector={sector} clients={suggestedClients.filter((client) => (client.sector || "Otros") === sector)} date={date} />
        ))}
        {suggestedClients.length === 0 && <Empty text="No hay clientes activos sugeridos para hoy." />}
      </section>
    </div>
  )
}

function SectorOrders({ sector, orders }: { sector: ClientSector; orders: ClientOrder[] }) {
  if (orders.length === 0) return null
  const segmentMessage = sectorBroadcastMessage(sector)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-base">
          <span>{sector}</span>
          <Badge variant="secondary">{orders.length} pedido{orders.length === 1 ? "" : "s"}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <SegmentText text={segmentMessage} />
        {orders.map((order) => (
          <div key={order.id} className="rounded-lg border p-3">
            <div className="flex flex-col gap-3 min-[520px]:flex-row min-[520px]:items-start min-[520px]:justify-between">
              <ClientLine client={order.own_clients} />
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={order.status === "ENTREGADO" ? "default" : "outline"}>{order.status === "ENTREGADO" ? "Entregado" : "Pendiente"}</Badge>
                <span className="text-sm font-semibold">{order.quantity} x {order.product}</span>
              </div>
            </div>
            {order.notes && <p className="mt-2 rounded-md bg-muted/50 p-2 text-sm text-muted-foreground">{order.notes}</p>}
            <div className="mt-3 flex flex-wrap gap-2 border-t pt-3">
              {order.status !== "ENTREGADO" && (
                <form action={setOrderStatusAction}>
                  <input type="hidden" name="id" value={order.id} />
                  <input type="hidden" name="status" value="ENTREGADO" />
                  <Button type="submit" size="sm" className="gap-2"><Check className="h-4 w-4" />Marcar entregado</Button>
                </form>
              )}
              {order.status === "PENDIENTE" && (
                <form action={setOrderStatusAction}>
                  <input type="hidden" name="id" value={order.id} />
                  <input type="hidden" name="status" value="CANCELADO" />
                  <Button type="submit" size="sm" variant="outline">Cancelar</Button>
                </form>
              )}
              {order.status === "ENTREGADO" && (
                <form action={setOrderStatusAction}>
                  <input type="hidden" name="id" value={order.id} />
                  <input type="hidden" name="status" value="PENDIENTE" />
                  <Button type="submit" size="sm" variant="outline">Volver a pendiente</Button>
                </form>
              )}
              {order.own_clients?.phone && <WhatsAppButton phone={order.own_clients.phone} message={segmentMessage} label="Contactar" />}
              <Link href={`/repartos/nuevo?client=${order.client_id}`}><Button size="sm" variant="outline">Registrar reparto</Button></Link>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function SectorSuggestions({ sector, clients, date }: { sector: ClientSector; clients: OwnClient[]; date: string }) {
  if (clients.length === 0) return null
  const segmentMessage = sectorBroadcastMessage(sector)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-base">
          <span>{sector}</span>
          <Badge variant="outline">{clients.length} sugerido{clients.length === 1 ? "" : "s"}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <SegmentText text={segmentMessage} />
        {clients.map((client) => (
          <div key={client.id} className="rounded-lg border p-3">
            <div className="flex flex-col gap-3 min-[520px]:flex-row min-[520px]:items-start min-[520px]:justify-between">
              <ClientLine client={client} />
              <div className="flex flex-wrap gap-2">
                <form action={createQuickOrderAction}>
                  <input type="hidden" name="client_id" value={client.id} />
                  <input type="hidden" name="order_date" value={date} />
                  <input type="hidden" name="product" value="Bidón 20L" />
                  <input type="hidden" name="quantity" value="1" />
                  <Button type="submit" size="sm">Pedido de hoy</Button>
                </form>
                {client.phone && <WhatsAppButton phone={client.phone} message={segmentMessage} label="Contactar" />}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function ClientLine({ client }: { client?: Pick<OwnClient, "id" | "name" | "phone" | "address" | "delivery_group"> }) {
  if (!client) return <p className="text-sm text-muted-foreground">Cliente no disponible</p>
  return (
    <div className="flex min-w-0 gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10"><UserRound className="h-4 w-4 text-primary" /></div>
      <div className="min-w-0">
        <p className="break-words font-semibold">{client.name}</p>
        {client.delivery_group && <p className="text-xs text-muted-foreground">Grupo: {client.delivery_group}</p>}
        {client.address && <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /><span className="break-words">{client.address}</span></p>}
      </div>
    </div>
  )
}

function SegmentText({ text }: { text: string }) {
  return <p className="flex gap-2 rounded-md bg-muted/50 p-2 text-sm text-muted-foreground"><MessageCircleMore className="mt-0.5 h-4 w-4 shrink-0" /><span>{text}</span></p>
}

function Summary({ label, value }: { label: string; value: number }) {
  return <Card><CardContent className="p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="safe-number text-xl font-bold">{value}</p></CardContent></Card>
}

function Empty({ text }: { text: string }) {
  return <div className="rounded-lg border border-dashed p-5 text-center text-sm text-muted-foreground">{text}</div>
}

function Message({ text, tone }: { text: string; tone: "success" | "error" }) {
  return <div className={tone === "success" ? "rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success" : "rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"}>{text}</div>
}
