"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/data"
import type { Brand, Filling, OwnClient } from "@/lib/types"

interface ClienteDetailProps {
  clienteId: string
}

export function ClienteDetail({ brand, ownClient, fillings = [] }: ClienteDetailProps & { brand?: Brand | null, ownClient?: OwnClient | null, fillings?: Filling[] }) {
  if (!brand && !ownClient) {
    return (
      <div className="p-4 md:p-6">
        <p>Cliente no encontrado</p>
      </div>
    )
  }

  const name = brand?.name || ownClient?.name || ""
  const isBrand = Boolean(brand)
  const pending = isBrand
    ? fillings.reduce((acc, f) => acc + Math.max(Number(f.total_amount) - Number(f.paid_amount), 0), 0)
    : Number(ownClient?.balance || 0)
  const totalFilled = fillings.reduce((acc, f) => acc + f.filled_qty, 0)
  const totalWithdrawn = fillings.reduce((acc, f) => acc + f.withdrawn_qty, 0)
  const totalPaid = fillings.reduce((acc, f) => acc + Number(f.paid_amount), 0)
  
  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/marcas">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">{name}</h1>
            <Badge variant="outline">{isBrand ? "Cliente de llenado" : "Cliente propio"}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {isBrand ? "Sus bidones son propios de la marca. Dos Hermanas cobra por unidad llenada." : "Operación propia de reparto y bidones en calle."}
          </p>
        </div>
      </div>
      
      {/* Estado de cuenta */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Estado de cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Saldo pendiente</p>
              <p className={`text-2xl font-bold ${pending > 0 ? 'text-warning' : 'text-success'}`}>
                {formatCurrency(pending)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                {isBrand ? 'Llenados cargados' : 'Bidones en calle'}
              </p>
              <p className="text-2xl font-bold">
                {isBrand ? totalFilled : ownClient?.bottles_in_street || 0}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Llenados</p>
              <p className="font-semibold">{totalFilled}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Retirados</p>
              <p className="font-semibold">{totalWithdrawn}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Pagado</p>
              <p className="font-semibold">{formatCurrency(totalPaid)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {isBrand && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Historial de llenados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {fillings.map((llenado) => (
              <div key={llenado.id} className="rounded-lg bg-muted/30 p-3">
                <div className="flex flex-col gap-2 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
                  <div>
                    <p className="font-medium text-sm">{llenado.filling_date}</p>
                    <p className="text-xs text-muted-foreground">
                      {llenado.received_qty} recibidos · {llenado.filled_qty} llenados · {llenado.withdrawn_qty} retirados
                    </p>
                  </div>
                  <div className="text-left min-[420px]:text-right">
                    <p className="font-semibold">{formatCurrency(Number(llenado.total_amount))}</p>
                    <Badge
                      variant={llenado.payment_status === 'PAGADO' ? 'default' : llenado.payment_status === 'PARCIAL' ? 'secondary' : 'outline'}
                      className="text-[10px]"
                    >
                      {llenado.payment_status === 'PAGADO' ? 'Pagado' : llenado.payment_status === 'PARCIAL' ? 'Parcial' : 'Pendiente'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Información adicional */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Información</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{isBrand ? 'Teléfono' : 'Dirección'}</span>
            <span className="font-medium">{isBrand ? brand?.phone || "Sin teléfono" : ownClient?.address || "Sin dirección"}</span>
          </div>
          {isBrand && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estado de cuenta</span>
              <Badge variant={pending === 0 ? 'default' : 'outline'}>
                {pending === 0 ? 'Al día' : 'Pendiente'}
              </Badge>
            </div>
          )}
          {isBrand && (
            <div className="rounded-lg bg-muted/40 p-3 text-sm text-muted-foreground">
              Esta marca trae sus propios bidones. Dos Hermanas no los registra como bidones prestados ni en calle; solo controla cantidades procesadas y saldo por servicio de llenado.
            </div>
          )}
          {isBrand && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estado</span>
              <Badge variant={brand?.is_active ? 'default' : 'secondary'}>
                {brand?.is_active ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
