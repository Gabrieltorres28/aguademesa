"use client"

import Link from "next/link"
import { ArrowLeft, Droplets, User, Package, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/data"
import { registerFillingPaymentAction } from "@/lib/actions/fillings"
import type { Filling } from "@/lib/types"

interface RepartoDetailProps {
  repartoId: string
}

export function RepartoDetail({ repartoId, filling }: RepartoDetailProps & { filling?: Filling | null }) {
  const llenado = filling
  
  if (!llenado) {
    return (
      <div className="p-4 md:p-6">
        <p>Llenado no encontrado</p>
      </div>
    )
  }
  
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
            <h1 className="text-xl font-bold text-foreground break-words min-[380px]:text-2xl">Llenado #{llenado.id}</h1>
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
              <p className="text-2xl font-bold text-success break-words">{llenado.received_qty}</p>
              <p className="text-xs text-muted-foreground">Recibidos</p>
            </div>
            <div className="min-w-0 p-3 bg-accent/10 rounded-lg">
              <p className="text-2xl font-bold text-accent break-words">{llenado.filled_qty}</p>
              <p className="text-xs text-muted-foreground">Llenados</p>
            </div>
            <div className="min-w-0 p-3 rounded-lg bg-muted">
              <p className="text-2xl font-bold break-words text-muted-foreground">
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
            <span className="text-lg font-bold break-words min-[420px]:text-xl">{formatCurrency(Number(llenado.unit_price))}</span>
          </div>
          <div className="flex flex-col gap-1 p-3 bg-success/10 rounded-lg min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
            <span className="text-sm text-muted-foreground min-[420px]:text-base">Total a cobrar</span>
            <span className="text-lg font-bold text-success break-words min-[420px]:text-xl">{formatCurrency(Number(llenado.total_amount))}</span>
          </div>
          <div className="flex flex-col gap-1 p-3 bg-muted/50 rounded-lg min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
            <span className="text-sm text-muted-foreground min-[420px]:text-base">Monto cobrado</span>
            <span className="text-lg font-bold break-words min-[420px]:text-xl">{formatCurrency(Number(llenado.paid_amount))}</span>
          </div>
          {Number(llenado.paid_amount) < Number(llenado.total_amount) && (
            <div className="flex flex-col gap-1 p-3 bg-warning/10 rounded-lg min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
              <span className="text-sm text-muted-foreground min-[420px]:text-base">Pendiente de cobro</span>
              <span className="text-lg font-bold text-warning break-words min-[420px]:text-xl">
                {formatCurrency(Number(llenado.total_amount) - Number(llenado.paid_amount))}
              </span>
            </div>
          )}
          <form action={registerFillingPaymentAction} className="grid gap-2 rounded-lg border p-3 min-[420px]:grid-cols-[1fr_auto]">
            <input type="hidden" name="id" value={llenado.id} />
            <input type="hidden" name="brand_id" value={llenado.brand_id} />
            <input type="hidden" name="total_amount" value={llenado.total_amount} />
            <input
              name="paid_amount"
              type="number"
              min="0"
              step="0.01"
              defaultValue={Number(llenado.paid_amount)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              aria-label="Monto cobrado"
            />
            <Button type="submit">Registrar pago</Button>
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
