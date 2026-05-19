"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency } from "@/lib/data"
import { updateDeliveryAction } from "@/lib/actions/deliveries"
import type { Delivery, OwnClient } from "@/lib/types"

export function DeliveryEditForm({ delivery, clients, error }: { delivery: Delivery; clients: OwnClient[]; error?: string }) {
  const [formData, setFormData] = useState({
    clientId: delivery.client_id,
    date: delivery.delivery_date,
    product: delivery.product,
    deliveredQty: String(delivery.delivered_qty),
    returnedEmptyQty: String(delivery.returned_empty_qty),
    unitPrice: String(Number(delivery.unit_price || 0)),
    paidAmount: String(Number(delivery.paid_amount || 0)),
    notes: delivery.notes || "",
  })

  const deliveredQty = Number(formData.deliveredQty) || 0
  const returnedEmptyQty = Number(formData.returnedEmptyQty) || 0
  const unitPrice = Number(formData.unitPrice) || 0
  const paidAmount = Number(formData.paidAmount) || 0
  const total = deliveredQty * unitPrice
  const pending = Math.max(total - paidAmount, 0)
  const bottlesDelta = deliveredQty - returnedEmptyQty
  const status = paidAmount >= total && total > 0 ? "PAGADO" : paidAmount > 0 ? "PARCIAL" : "PENDIENTE"

  const errorMessage = {
    "no-client": "Seleccioná un cliente.",
    negative: "Las cantidades y montos no pueden ser negativos.",
    "paid-too-high": "El monto cobrado no puede superar el total.",
  }[error || ""]

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <Link href={`/repartos/${delivery.id}`}>
          <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-foreground">Editar reparto</h1>
          <p className="text-sm text-muted-foreground">Actualizá entrega, vacíos y cobro.</p>
        </div>
      </div>
      {errorMessage && <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{errorMessage}</div>}

      <form action={updateDeliveryAction} className="space-y-4">
        <input type="hidden" name="id" value={delivery.id} />
        <Card>
          <CardHeader><CardTitle className="text-base">Datos</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Cliente propio</Label>
              <select name="client_id" value={formData.clientId} onChange={(event) => setFormData({ ...formData, clientId: event.target.value })} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                {clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}
              </select>
            </div>
            <div className="grid gap-4 min-[420px]:grid-cols-2">
              <Field label="Fecha" name="delivery_date" type="date" value={formData.date} onChange={(date) => setFormData({ ...formData, date })} />
              <Field label="Producto" name="product" type="text" value={formData.product} onChange={(product) => setFormData({ ...formData, product })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Cantidades y cobro</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 min-[420px]:grid-cols-2">
              <Field label="Entregados" name="delivered_qty" type="number" value={formData.deliveredQty} onChange={(deliveredQty) => setFormData({ ...formData, deliveredQty })} />
              <Field label="Vacíos devueltos" name="returned_empty_qty" type="number" value={formData.returnedEmptyQty} onChange={(returnedEmptyQty) => setFormData({ ...formData, returnedEmptyQty })} />
              <Field label="Precio unitario" name="unit_price" type="number" step="0.01" value={formData.unitPrice} onChange={(unitPrice) => setFormData({ ...formData, unitPrice })} />
              <Field label="Monto cobrado" name="paid_amount" type="number" step="0.01" value={formData.paidAmount} onChange={(paidAmount) => setFormData({ ...formData, paidAmount })} />
            </div>
            <div className="grid gap-3 rounded-lg bg-muted/50 p-4 min-[420px]:grid-cols-3">
              <Calc label="Cuenta" value={`${deliveredQty} x ${formatCurrency(unitPrice)}`} />
              <Calc label="Total" value={formatCurrency(total)} strong />
              <Calc label="Pendiente" value={formatCurrency(pending)} strong />
              <Calc label="Cambio en calle" value={`${bottlesDelta >= 0 ? "+" : ""}${bottlesDelta}`} strong />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-sm text-muted-foreground">Estado automático</span>
              <Badge variant={status === "PAGADO" ? "default" : status === "PARCIAL" ? "secondary" : "outline"}>
                {status === "PAGADO" ? "Pagado" : status === "PARCIAL" ? "Parcial" : "Pendiente"}
              </Badge>
            </div>
            {paidAmount > total && <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">El monto cobrado no puede superar el total.</div>}
            <Button type="button" variant="outline" className="w-full" onClick={() => setFormData({ ...formData, paidAmount: String(total) })}>
              Marcar cobrado completo
            </Button>
            <div className="space-y-2">
              <Label>Observaciones</Label>
              <Textarea name="notes" rows={3} value={formData.notes} onChange={(event) => setFormData({ ...formData, notes: event.target.value })} />
            </div>
          </CardContent>
        </Card>
        <Button className="h-12 w-full" disabled={!formData.clientId || paidAmount > total}>Guardar cambios</Button>
      </form>
    </div>
  )
}

function Field({ label, name, type, value, step, onChange }: { label: string; name: string; type: string; value: string; step?: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input name={name} type={type} min={type === "number" ? "0" : undefined} step={step} value={value} onChange={(event) => onChange(event.target.value)} required />
    </div>
  )
}

function Calc({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`${strong ? "text-xl" : "text-base"} safe-number font-bold`}>{value}</p>
    </div>
  )
}
