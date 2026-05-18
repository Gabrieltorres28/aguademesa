"use client"

import Link from "next/link"
import { ArrowLeft, Truck, User, Package, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { repartos, formatCurrency } from "@/lib/data"

interface RepartoDetailProps {
  repartoId: string
}

export function RepartoDetail({ repartoId }: RepartoDetailProps) {
  const reparto = repartos.find(r => r.id === repartoId)
  
  if (!reparto) {
    return (
      <div className="p-4 md:p-6">
        <p>Reparto no encontrado</p>
      </div>
    )
  }
  
  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 min-w-0 min-[380px]:gap-4">
        <Link href="/repartos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-foreground break-words min-[380px]:text-2xl">Reparto #{reparto.id}</h1>
            <Badge 
              variant={
                reparto.estado === 'cobrado' ? 'default' : 
                reparto.estado === 'parcial' ? 'secondary' : 'outline'
              }
            >
              {reparto.estado === 'cobrado' ? 'Cobrado' : 
               reparto.estado === 'parcial' ? 'Parcial' : 'Pendiente'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{reparto.fecha}</p>
        </div>
      </div>
      
      {/* Info principal */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Información del reparto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2">
            <div className="flex min-w-0 items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Cliente</p>
                <p className="font-semibold break-words">{reparto.cliente}</p>
              </div>
            </div>
            <div className="flex min-w-0 items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <Truck className="h-5 w-5 text-accent" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Repartidor</p>
                <p className="font-semibold break-words">{reparto.repartidor}</p>
              </div>
            </div>
          </div>
          
          <div className="flex min-w-0 items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
              <Package className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Producto</p>
              <p className="font-semibold break-words">{reparto.producto}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Cantidades */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Detalle de bidones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 text-center min-[360px]:grid-cols-3 min-[420px]:gap-4">
            <div className="min-w-0 p-3 bg-success/10 rounded-lg">
              <p className="text-2xl font-bold text-success break-words">{reparto.bidonesEntregados}</p>
              <p className="text-xs text-muted-foreground">Entregados</p>
            </div>
            <div className="min-w-0 p-3 bg-accent/10 rounded-lg">
              <p className="text-2xl font-bold text-accent break-words">{reparto.vaciosDevueltos}</p>
              <p className="text-xs text-muted-foreground">Devueltos</p>
            </div>
            <div className={`min-w-0 p-3 rounded-lg ${reparto.bidonesPendientes > 0 ? 'bg-warning/10' : 'bg-muted'}`}>
              <p className={`text-2xl font-bold break-words ${reparto.bidonesPendientes > 0 ? 'text-warning' : 'text-muted-foreground'}`}>
                {reparto.bidonesPendientes}
              </p>
              <p className="text-xs text-muted-foreground">Pendientes</p>
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
            <span className="text-sm text-muted-foreground min-[420px]:text-base">Total del reparto</span>
            <span className="text-lg font-bold break-words min-[420px]:text-xl">{formatCurrency(reparto.montoTotal)}</span>
          </div>
          <div className="flex flex-col gap-1 p-3 bg-success/10 rounded-lg min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
            <span className="text-sm text-muted-foreground min-[420px]:text-base">Monto cobrado</span>
            <span className="text-lg font-bold text-success break-words min-[420px]:text-xl">{formatCurrency(reparto.montoCobrado)}</span>
          </div>
          {reparto.montoCobrado < reparto.montoTotal && (
            <div className="flex flex-col gap-1 p-3 bg-warning/10 rounded-lg min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
              <span className="text-sm text-muted-foreground min-[420px]:text-base">Pendiente de cobro</span>
              <span className="text-lg font-bold text-warning break-words min-[420px]:text-xl">
                {formatCurrency(reparto.montoTotal - reparto.montoCobrado)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Observaciones */}
      {reparto.observaciones && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Observaciones</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{reparto.observaciones}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
