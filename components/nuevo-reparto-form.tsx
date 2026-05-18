"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/data"
import { createFillingAction } from "@/lib/actions/fillings"
import type { Brand } from "@/lib/types"

export function NuevoRepartoForm({ brands = [] }: { brands?: Brand[] }) {
  const [formData, setFormData] = useState({
    marca: "",
    fecha: "2026-05-18",
    bidonesRecibidos: "",
    bidonesLlenados: "",
    bidonesRetirados: "",
    precioUnitario: "700",
    montoCobrado: "",
    estadoPago: "PENDIENTE",
    observaciones: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const cantidadNum = parseInt(formData.bidonesLlenados) || 0
  const precioNum = parseInt(formData.precioUnitario) || 0
  const total = cantidadNum * precioNum
  
  const handleSubmit = () => setIsSubmitting(true)
  
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
      
      <form action={createFillingAction} onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Datos del llenado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="marca">Marca / revendedor *</Label>
              <Select
                value={formData.marca} 
                onValueChange={(value) => setFormData({...formData, marca: value})}
              >
                <input type="hidden" name="brand_id" value={formData.marca} />
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
                  placeholder="0"
                  value={formData.bidonesRetirados}
                  onChange={(e) => setFormData({...formData, bidonesRetirados: e.target.value})}
                  className="text-lg font-semibold"
                />
              </div>
            </div>
            
            {/* Precio unitario */}
            <div className="space-y-2">
              <Label htmlFor="precio">Precio por llenado</Label>
              <Input 
                id="precio"
                name="unit_price"
                type="number"
                placeholder="0"
                value={formData.precioUnitario}
                onChange={(e) => setFormData({...formData, precioUnitario: e.target.value})}
              />
            </div>
            
            {/* Total calculado */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total a cobrar</span>
                <span className="text-2xl font-bold">{formatCurrency(total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Cobro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="estadoPago">Estado de pago</Label>
              <Select
                value={formData.estadoPago}
                onValueChange={(value) => setFormData({...formData, estadoPago: value})}
              >
                <SelectTrigger id="estadoPago">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PAGADO">Pagado</SelectItem>
                  <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                  <SelectItem value="PARCIAL">Parcial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="montoCobrado">Monto cobrado</Label>
              <Input 
                id="montoCobrado"
                name="paid_amount"
                type="number"
                placeholder={formData.estadoPago === "pagado" ? total.toString() : "0"}
                value={formData.montoCobrado}
                onChange={(e) => setFormData({...formData, montoCobrado: e.target.value})}
              />
              <p className="text-xs text-muted-foreground">
                Usar 0 si queda pendiente. Total calculado: {formatCurrency(total)}
              </p>
            </div>
            
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
        
        {/* Botón guardar */}
        <Button 
          type="submit" 
          className="w-full h-12 text-base"
          disabled={!formData.marca || !formData.fecha || !formData.bidonesRecibidos || !formData.bidonesLlenados || !formData.bidonesRetirados || isSubmitting}
        >
          {isSubmitting ? 'Guardando...' : 'Registrar llenado'}
        </Button>
      </form>
    </div>
  )
}
