"use client"

import { useState } from "react"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/data"
import { createFillingAction } from "@/lib/actions/fillings"
import type { Brand } from "@/lib/types"

export function NuevoRepartoForm({
  brands = [],
  error,
  selectedBrandId,
}: {
  brands?: Brand[]
  error?: string
  selectedBrandId?: string
}) {
  const today = new Date().toISOString().slice(0, 10)
  const [formData, setFormData] = useState({
    marca: selectedBrandId || "",
    fecha: today,
    bidonesRecibidos: "",
    bidonesLlenados: "",
    bidonesRetirados: "",
    precioUnitario: "700",
    montoCobrado: "",
    observaciones: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const recibidosNum = parseInt(formData.bidonesRecibidos) || 0
  const cantidadNum = parseInt(formData.bidonesLlenados) || 0
  const retiradosNum = parseInt(formData.bidonesRetirados) || 0
  const precioNum = Number(formData.precioUnitario) || 0
  const cobradoNum = Number(formData.montoCobrado) || 0
  const total = cantidadNum * precioNum
  const pendiente = Math.max(total - cobradoNum, 0)
  const saldoBidones = recibidosNum - retiradosNum
  const estadoPago = cobradoNum >= total && total > 0 ? "PAGADO" : cobradoNum > 0 ? "PARCIAL" : "PENDIENTE"
  
  const handleSubmit = () => setIsSubmitting(true)
  const errorMessage = {
    "no-brand": "Seleccioná una marca o revendedor para registrar el llenado.",
    negative: "Las cantidades y montos no pueden ser negativos.",
    "paid-too-high": "El monto cobrado no puede superar el total del llenado.",
  }[error || ""]

  if (brands.length === 0) {
    return (
      <div className="space-y-4 p-4 md:p-6">
        <div className="flex items-center gap-4">
          <Link href="/llenados">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Nuevo llenado</h1>
            <p className="text-sm text-muted-foreground">Servicio de llenado para marcas y revendedores</p>
          </div>
        </div>
        <Card>
          <CardContent className="space-y-3 p-6 text-center">
            <div>
              <p className="font-semibold">Primero cargá una marca o revendedor</p>
              <p className="mt-1 text-sm text-muted-foreground">Para registrar un llenado necesitás elegir quién trajo sus bidones.</p>
            </div>
            <Link href="/marcas/nueva">
              <Button className="gap-2"><Plus className="h-4 w-4" />Crear marca</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/llenados">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nuevo llenado</h1>
          <p className="text-sm text-muted-foreground">Registro de producción para revendedores</p>
        </div>
      </div>
      {errorMessage && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {errorMessage}
        </div>
      )}
      
      <form action={createFillingAction} onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Datos del llenado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="marca">Marca / revendedor *</Label>
              <input type="hidden" name="brand_id" value={formData.marca} />
              <Select
                value={formData.marca} 
                onValueChange={(value) => setFormData({...formData, marca: value})}
              >
                <SelectTrigger id="marca">
                  <SelectValue placeholder="Seleccionar marca" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map(marca => (
                    <SelectItem key={marca.id} value={marca.id}>{marca.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha *</Label>
              <Input
                id="fecha"
                name="filling_date"
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({...formData, fecha: e.target.value})}
              />
            </div>

            <div className="rounded-lg bg-muted/40 p-3 text-sm text-muted-foreground">
              Los bidones pertenecen a cada marca. Dos Hermanas registra el proceso y cobra el servicio por unidad llenada.
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Cantidades</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="recibidos">Recibidos *</Label>
                <Input 
                  id="recibidos"
                  name="received_qty"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.bidonesRecibidos}
                  onChange={(e) => setFormData({...formData, bidonesRecibidos: e.target.value})}
                  className="text-lg font-semibold"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="llenados">Llenados *</Label>
                <Input 
                  id="llenados"
                  name="filled_qty"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.bidonesLlenados}
                  onChange={(e) => setFormData({...formData, bidonesLlenados: e.target.value})}
                  className="text-lg font-semibold"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="retirados">Retirados *</Label>
                <Input 
                  id="retirados"
                  name="withdrawn_qty"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.bidonesRetirados}
                  onChange={(e) => setFormData({...formData, bidonesRetirados: e.target.value})}
                  className="text-lg font-semibold"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="precio">Precio por llenado</Label>
              <Input 
                id="precio"
                name="unit_price"
                type="number"
                min="0"
                placeholder="0"
                value={formData.precioUnitario}
                onChange={(e) => setFormData({...formData, precioUnitario: e.target.value})}
              />
            </div>
            
            <div className="grid gap-3 rounded-lg bg-muted/50 p-4 min-[420px]:grid-cols-3">
              <CalcItem label="Recibidos - retirados" value={`${saldoBidones} pendientes`} />
              <CalcItem label="Cuenta" value={`${cantidadNum} x ${formatCurrency(precioNum)}`} />
              <CalcItem label="Total a cobrar" value={formatCurrency(total)} strong />
            </div>
            {retiradosNum > recibidosNum && (
              <div className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-warning">
                Revisá los bidones retirados: no deberían superar los recibidos.
              </div>
            )}
            {cantidadNum > recibidosNum && (
              <div className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-warning">
                Revisá los bidones llenados: no deberían superar los recibidos.
              </div>
            )}
            {cobradoNum > total && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                El monto cobrado no puede superar el total.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Cobro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="montoCobrado">Monto cobrado</Label>
              <Input 
                id="montoCobrado"
                name="paid_amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                value={formData.montoCobrado}
                onChange={(e) => setFormData({...formData, montoCobrado: e.target.value})}
              />
            </div>
            <div className="grid gap-3 rounded-lg bg-muted/50 p-4 min-[420px]:grid-cols-3">
              <CalcItem label="Total" value={formatCurrency(total)} />
              <CalcItem label="Cobrado" value={formatCurrency(cobradoNum)} />
              <CalcItem label="Pendiente" value={formatCurrency(pendiente)} strong />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-sm text-muted-foreground">Estado automático</span>
              <Badge variant={estadoPago === "PAGADO" ? "default" : estadoPago === "PARCIAL" ? "secondary" : "outline"}>
                {estadoPago === "PAGADO" ? "Pagado" : estadoPago === "PARCIAL" ? "Parcial" : "Pendiente"}
              </Badge>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setFormData({ ...formData, montoCobrado: String(total) })}
            >
              Marcar cobrado completo
            </Button>
            
            {/* Observaciones */}
            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea 
                id="observaciones"
                name="notes"
                placeholder="Agregar notas o comentarios..."
                value={formData.observaciones}
                onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
        
        <Button 
          type="submit" 
          className="w-full h-12 text-base"
          disabled={!formData.marca || !formData.fecha || cobradoNum > total || isSubmitting}
        >
          {isSubmitting ? 'Guardando...' : 'Registrar llenado'}
        </Button>
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
