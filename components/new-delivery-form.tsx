"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createDeliveryAction } from "@/lib/actions/deliveries"
import { formatCurrency } from "@/lib/data"
import type { OwnClient } from "@/lib/types"

export function NewDeliveryForm({
  clients = [],
  error,
  selectedClientId,
}: {
  clients?: OwnClient[]
  error?: string
  selectedClientId?: string
}) {
  const today = new Date().toISOString().slice(0, 10)
  const [formData, setFormData] = useState({
    clientId: selectedClientId || "",
    deliveryDate: today,
    product: "Bidón 20L",
    deliveredQty: "0",
    returnedEmptyQty: "0",
    unitPrice: "0",
    paidAmount: "0",
    notes: "",
  })

  const deliveredQty = parseInt(formData.deliveredQty) || 0
  const returnedEmptyQty = parseInt(formData.returnedEmptyQty) || 0
  const unitPrice = Number(formData.unitPrice) || 0
  const paidAmount = Number(formData.paidAmount) || 0
  const total = deliveredQty * unitPrice
  const pending = Math.max(total - paidAmount, 0)
  const bottlesDelta = deliveredQty - returnedEmptyQty
  const paymentStatus = paidAmount >= total && total > 0 ? "PAGADO" : paidAmount > 0 ? "PARCIAL" : "PENDIENTE"

  if (clients.length === 0) {
    return (
      <div className="space-y-4 p-4 md:p-6">
        <div className="flex items-center gap-4">
          <Link href="/repartos"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
          <div>
            <h1 className="text-2xl font-bold">Nuevo reparto propio</h1>
            <p className="text-sm text-muted-foreground">Operación propia de Dos Hermanas</p>
          </div>
        </div>
        <Card>
          <CardContent className="space-y-3 p-6 text-center">
            <div>
              <p className="font-semibold">Primero cargá un cliente</p>
              <p className="mt-1 text-sm text-muted-foreground">Para registrar un reparto propio necesitás elegir una persona, comercio u oficina.</p>
            </div>
            <Link href="/clientes/nuevo">
              <Button className="gap-2"><Plus className="h-4 w-4" />Crear cliente</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const errorMessage = {
    "no-client": "Seleccioná un cliente para registrar el reparto.",
    negative: "Las cantidades y montos no pueden ser negativos.",
    "paid-too-high": "El monto cobrado no puede superar el total del reparto.",
  }[error || ""]

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Link href="/repartos"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold">Nuevo reparto propio</h1>
          <p className="text-sm text-muted-foreground">Operación propia de Dos Hermanas</p>
        </div>
      </div>
      {errorMessage && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {errorMessage}
        </div>
      )}
      <form action={createDeliveryAction} className="space-y-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Datos</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Cliente propio</Label>
              <select
                name="client_id"
                required
                value={formData.clientId}
                onChange={(event) => setFormData({ ...formData, clientId: event.target.value })}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Seleccionar cliente</option>
                {clients.map(client => <option key={client.id} value={client.id}>{client.name}</option>)}
              </select>
            </div>
            <div className="grid gap-4 min-[420px]:grid-cols-2">
              <div className="space-y-2">
                <Label>Fecha</Label>
                <Input name="delivery_date" type="date" value={formData.deliveryDate} onChange={(event) => setFormData({ ...formData, deliveryDate: event.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Producto</Label>
                <Input name="product" value={formData.product} onChange={(event) => setFormData({ ...formData, product: event.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Entregados</Label>
                <Input name="delivered_qty" type="number" min="0" value={formData.deliveredQty} onChange={(event) => setFormData({ ...formData, deliveredQty: event.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Vacíos devueltos</Label>
                <Input name="returned_empty_qty" type="number" min="0" value={formData.returnedEmptyQty} onChange={(event) => setFormData({ ...formData, returnedEmptyQty: event.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Precio unitario</Label>
                <Input name="unit_price" type="number" min="0" step="0.01" value={formData.unitPrice} onChange={(event) => setFormData({ ...formData, unitPrice: event.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Monto cobrado</Label>
                <Input name="paid_amount" type="number" min="0" step="0.01" value={formData.paidAmount} onChange={(event) => setFormData({ ...formData, paidAmount: event.target.value })} required />
              </div>
            </div>
            <div className="grid gap-3 rounded-lg bg-muted/50 p-4 min-[420px]:grid-cols-3">
              <CalcItem label="Cuenta" value={`${deliveredQty} x ${formatCurrency(unitPrice)}`} />
              <CalcItem label="Total" value={formatCurrency(total)} strong />
              <CalcItem label="Bidones en calle" value={`${bottlesDelta >= 0 ? "+" : ""}${bottlesDelta}`} strong />
              <CalcItem label="Cobrado" value={formatCurrency(paidAmount)} />
              <CalcItem label="Pendiente" value={formatCurrency(pending)} strong />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Estado automático</p>
                <Badge variant={paymentStatus === "PAGADO" ? "default" : paymentStatus === "PARCIAL" ? "secondary" : "outline"} className="mt-1">
                  {paymentStatus === "PAGADO" ? "Pagado" : paymentStatus === "PARCIAL" ? "Parcial" : "Pendiente"}
                </Badge>
              </div>
            </div>
            {returnedEmptyQty > deliveredQty && (
              <div className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-warning">
                Estás registrando más vacíos devueltos que bidones entregados. Revisá si corresponde.
              </div>
            )}
            {paidAmount > total && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                El monto cobrado no puede superar el total del reparto.
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setFormData({ ...formData, paidAmount: String(total) })}
            >
              Marcar cobrado completo
            </Button>
            <div className="space-y-2">
              <Label>Observaciones</Label>
              <Textarea name="notes" rows={3} value={formData.notes} onChange={(event) => setFormData({ ...formData, notes: event.target.value })} />
            </div>
          </CardContent>
        </Card>
        <Button className="w-full h-12" disabled={!formData.clientId || paidAmount > total}>Guardar reparto</Button>
      </form>
    </div>
  )
}

function CalcItem({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`${strong ? "text-xl" : "text-base"} safe-number font-bold text-foreground`}>{value}</p>
    </div>
  )
}
