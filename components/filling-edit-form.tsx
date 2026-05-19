"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency } from "@/lib/data"
import { updateFillingAction } from "@/lib/actions/fillings"
import type { Brand, Filling } from "@/lib/types"

export function FillingEditForm({ filling, brands, error }: { filling: Filling; brands: Brand[]; error?: string }) {
  const [formData, setFormData] = useState({
    brandId: filling.brand_id,
    date: filling.filling_date,
    receivedQty: String(filling.received_qty),
    filledQty: String(filling.filled_qty),
    withdrawnQty: String(filling.withdrawn_qty),
    unitPrice: String(Number(filling.unit_price || 0)),
    paidAmount: String(Number(filling.paid_amount || 0)),
    notes: filling.notes || "",
  })

  const receivedQty = Number(formData.receivedQty) || 0
  const filledQty = Number(formData.filledQty) || 0
  const withdrawnQty = Number(formData.withdrawnQty) || 0
  const unitPrice = Number(formData.unitPrice) || 0
  const paidAmount = Number(formData.paidAmount) || 0
  const total = filledQty * unitPrice
  const pending = Math.max(total - paidAmount, 0)
  const status = paidAmount >= total && total > 0 ? "PAGADO" : paidAmount > 0 ? "PARCIAL" : "PENDIENTE"

  const errorMessage = {
    "no-brand": "Seleccioná una marca o revendedor.",
    negative: "Las cantidades y montos no pueden ser negativos.",
    "paid-too-high": "El monto cobrado no puede superar el total.",
  }[error || ""]

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <Link href={`/llenados/${filling.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-foreground">Editar llenado</h1>
          <p className="text-sm text-muted-foreground">Actualizá cantidades, precio y cobro.</p>
        </div>
      </div>

      {errorMessage && <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{errorMessage}</div>}

      <form action={updateFillingAction} className="space-y-4">
        <input type="hidden" name="id" value={filling.id} />
        <input type="hidden" name="brand_id" value={formData.brandId} />

        <Card>
          <CardHeader><CardTitle className="text-base">Datos</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Marca / revendedor</Label>
              <Select value={formData.brandId} onValueChange={(brandId) => setFormData({ ...formData, brandId })}>
                <SelectTrigger><SelectValue placeholder="Seleccionar marca" /></SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fecha</Label>
              <Input name="filling_date" type="date" value={formData.date} onChange={(event) => setFormData({ ...formData, date: event.target.value })} required />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Cantidades y cobro</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 min-[420px]:grid-cols-3">
              <Field label="Recibidos" name="received_qty" value={formData.receivedQty} onChange={(receivedQty) => setFormData({ ...formData, receivedQty })} />
              <Field label="Llenados" name="filled_qty" value={formData.filledQty} onChange={(filledQty) => setFormData({ ...formData, filledQty })} />
              <Field label="Retirados" name="withdrawn_qty" value={formData.withdrawnQty} onChange={(withdrawnQty) => setFormData({ ...formData, withdrawnQty })} />
              <Field label="Precio unitario" name="unit_price" value={formData.unitPrice} onChange={(unitPrice) => setFormData({ ...formData, unitPrice })} step="0.01" />
              <Field label="Monto cobrado" name="paid_amount" value={formData.paidAmount} onChange={(paidAmount) => setFormData({ ...formData, paidAmount })} step="0.01" />
            </div>

            <div className="grid gap-3 rounded-lg bg-muted/50 p-4 min-[420px]:grid-cols-3">
              <Calc label="Cuenta" value={`${filledQty} x ${formatCurrency(unitPrice)}`} />
              <Calc label="Total" value={formatCurrency(total)} strong />
              <Calc label="Pendiente" value={formatCurrency(pending)} strong />
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

        <Button className="h-12 w-full" disabled={!formData.brandId || paidAmount > total}>Guardar cambios</Button>
      </form>
    </div>
  )
}

function Field({ label, name, value, step, onChange }: { label: string; name: string; value: string; step?: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input name={name} type="number" min="0" step={step} value={value} onChange={(event) => onChange(event.target.value)} required />
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
