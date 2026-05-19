"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Droplets, Edit, User, Package, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/data"
import { deleteFillingAction, registerFillingPaymentAction } from "@/lib/actions/fillings"
import { DeleteSubmitButton } from "@/components/delete-submit-button"
import type { Filling } from "@/lib/types"

interface RepartoDetailProps {
  repartoId: string
}

export function RepartoDetail({ repartoId, filling }: RepartoDetailProps & { filling?: Filling | null }) {
  const llenado = filling
  const [paymentAmount, setPaymentAmount] = useState(String(Number(llenado?.paid_amount || 0)))
  
  if (!llenado) {
    return (
      <div className="p-4 md:p-6">
        <p>Llenado no encontrado</p>
      </div>
    )
  }

  const totalAmount = Number(llenado.total_amount || 0)
  const currentPaid = Number(llenado.paid_amount || 0)
  const nextPaid = Number(paymentAmount) || 0
  const nextPending = Math.max(totalAmount - nextPaid, 0)
  const nextStatus = nextPaid >= totalAmount && totalAmount > 0 ? "PAGADO" : nextPaid > 0 ? "PARCIAL" : "PENDIENTE"
  
  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 min-w-0 min-[380px]:gap-4">
        <Link href="/llenados">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-foreground break-words min-[380px]:text-2xl">Llenado #{llenado.id.slice(0, 8)}</h1>
            <Badge 
              variant={
                llenado.payment_status === 'PAGADO' ? 'default' : 
                llenado.payment_status === 'PARCIAL' ? 'secondary' : 'outline'
              }
            >
              {llenado.payment_status === 'PAGADO' ? 'Pagado' : 
               llenado.payment_status === 'PARCIAL' ? 'Parcial' : 'Pendiente'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{llenado.filling_date}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href={`/llenados/${llenado.id}/editar`}>
          <Button variant="outline" size="sm" className="gap-2">
            <Edit className="h-4 w-4" />
            Editar
          </Button>
        </Link>
        <form action={deleteFillingAction}>
          <input type="hidden" name="id" value={llenado.id} />
          <DeleteSubmitButton />
        </form>
      </div>
      
      {/* Info principal */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Información del llenado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2">
            <div className="flex min-w-0 items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Marca / revendedor</p>
                <p className="font-semibold break-words">{llenado.brands?.name || "Sin marca"}</p>
              </div>
            </div>
            <div className="flex min-w-0 items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <Droplets className="h-5 w-5 text-accent" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Operación</p>
                <p className="font-semibold break-words">Lavado, desinfección y llenado</p>
              </div>
            </div>
          </div>
          
          <div className="flex min-w-0 items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
              <Package className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Tipo de bidón</p>
              <p className="font-semibold break-words">Bidones propios de la marca</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Cantidades */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Bidones procesados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 text-center min-[360px]:grid-cols-3 min-[420px]:gap-4">
            <div className="min-w-0 p-3 bg-success/10 rounded-lg">
              <p className="safe-number text-2xl font-bold text-success">{llenado.received_qty}</p>
              <p className="text-xs text-muted-foreground">Recibidos</p>
            </div>
            <div className="min-w-0 p-3 bg-accent/10 rounded-lg">
              <p className="safe-number text-2xl font-bold text-accent">{llenado.filled_qty}</p>
              <p className="text-xs text-muted-foreground">Llenados</p>
            </div>
            <div className="min-w-0 p-3 rounded-lg bg-muted">
              <p className="safe-number text-2xl font-bold text-muted-foreground">
                {llenado.withdrawn_qty}
              </p>
              <p className="text-xs text-muted-foreground">Retirados</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Cobro */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Información de cobro</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-1 p-3 bg-muted/50 rounded-lg min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
            <span className="text-sm text-muted-foreground min-[420px]:text-base">Precio por llenado</span>
            <span className="safe-number text-lg font-bold min-[420px]:text-xl">{formatCurrency(Number(llenado.unit_price))}</span>
          </div>
          <div className="flex flex-col gap-1 p-3 bg-success/10 rounded-lg min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
            <span className="text-sm text-muted-foreground min-[420px]:text-base">Total a cobrar</span>
            <span className="safe-number text-lg font-bold text-success min-[420px]:text-xl">{formatCurrency(totalAmount)}</span>
          </div>
          <div className="flex flex-col gap-1 p-3 bg-muted/50 rounded-lg min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
            <span className="text-sm text-muted-foreground min-[420px]:text-base">Monto cobrado</span>
            <span className="safe-number text-lg font-bold min-[420px]:text-xl">{formatCurrency(currentPaid)}</span>
          </div>
          {Number(llenado.paid_amount) < Number(llenado.total_amount) && (
            <div className="flex flex-col gap-1 p-3 bg-warning/10 rounded-lg min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
              <span className="text-sm text-muted-foreground min-[420px]:text-base">Pendiente de cobro</span>
              <span className="safe-number text-lg font-bold text-warning min-[420px]:text-xl">
                {formatCurrency(totalAmount - currentPaid)}
              </span>
            </div>
          )}
          <form action={registerFillingPaymentAction} className="space-y-3 rounded-lg border p-3">
            <input type="hidden" name="id" value={llenado.id} />
            <input type="hidden" name="brand_id" value={llenado.brand_id} />
            <input type="hidden" name="total_amount" value={llenado.total_amount} />
            <div className="grid gap-2 min-[420px]:grid-cols-[1fr_auto]">
              <input
                name="paid_amount"
                type="number"
                min="0"
                step="0.01"
                value={paymentAmount}
                onChange={(event) => setPaymentAmount(event.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                aria-label="Monto cobrado"
              />
              <Button type="submit" disabled={nextPaid > totalAmount}>Registrar pago</Button>
            </div>
            <div className="grid gap-3 rounded-lg bg-muted/50 p-3 min-[420px]:grid-cols-3">
              <CalcItem label="Total" value={formatCurrency(totalAmount)} />
              <CalcItem label="Cobrado" value={formatCurrency(nextPaid)} />
              <CalcItem label="Pendiente" value={formatCurrency(nextPending)} strong />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-sm text-muted-foreground">Estado automático</span>
              <Badge variant={nextStatus === "PAGADO" ? "default" : nextStatus === "PARCIAL" ? "secondary" : "outline"}>
                {nextStatus === "PAGADO" ? "Pagado" : nextStatus === "PARCIAL" ? "Parcial" : "Pendiente"}
              </Badge>
            </div>
            {nextPaid > totalAmount && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                El monto cobrado no puede superar el total del llenado.
              </div>
            )}
            <Button type="button" variant="outline" className="w-full" onClick={() => setPaymentAmount(String(totalAmount))}>
              Marcar cobrado completo
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Observaciones */}
      {llenado.notes && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Observaciones</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{llenado.notes}</p>
          </CardContent>
        </Card>
      )}
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
