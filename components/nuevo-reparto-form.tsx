"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { clientes, repartidores, productos, formatCurrency } from "@/lib/data"

export function NuevoRepartoForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    cliente: "",
    repartidor: "",
    producto: "",
    cantidadEntregada: "",
    vaciosDevueltos: "",
    precioUnitario: "1500",
    cobrado: false,
    montoCobrado: "",
    observaciones: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const clientesMarcas = clientes.filter(c => c.tipo === 'marca')
  const productosAgua = productos.filter(p => p.nombre.includes('Bidón') || p.nombre.includes('Agua'))
  
  const cantidadNum = parseInt(formData.cantidadEntregada) || 0
  const precioNum = parseInt(formData.precioUnitario) || 0
  const total = cantidadNum * precioNum
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 800))
    
    setShowSuccess(true)
    setTimeout(() => {
      router.push('/repartos')
    }, 1500)
  }
  
  if (showSuccess) {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-sm">
          <CardContent className="p-8 text-center">
            <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-xl font-bold mb-2">Reparto registrado</h2>
            <p className="text-muted-foreground">El reparto se guardó correctamente</p>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/repartos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nuevo reparto</h1>
          <p className="text-sm text-muted-foreground">Registrar entrega de bidones</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Datos del reparto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Cliente */}
            <div className="space-y-2">
              <Label htmlFor="cliente">Marca / Cliente *</Label>
              <Select 
                value={formData.cliente} 
                onValueChange={(value) => setFormData({...formData, cliente: value})}
              >
                <SelectTrigger id="cliente">
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map(c => (
                    <SelectItem key={c.id} value={c.nombre}>
                      {c.nombre} {c.tipo === 'particular' && '(Particular)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Repartidor */}
            <div className="space-y-2">
              <Label htmlFor="repartidor">Repartidor *</Label>
              <Select 
                value={formData.repartidor} 
                onValueChange={(value) => setFormData({...formData, repartidor: value})}
              >
                <SelectTrigger id="repartidor">
                  <SelectValue placeholder="Seleccionar repartidor" />
                </SelectTrigger>
                <SelectContent>
                  {repartidores.map(r => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Producto */}
            <div className="space-y-2">
              <Label htmlFor="producto">Producto *</Label>
              <Select 
                value={formData.producto} 
                onValueChange={(value) => setFormData({...formData, producto: value})}
              >
                <SelectTrigger id="producto">
                  <SelectValue placeholder="Seleccionar producto" />
                </SelectTrigger>
                <SelectContent>
                  {productosAgua.map(p => (
                    <SelectItem key={p.id} value={p.nombre}>{p.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Cantidades</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Cantidad entregada */}
              <div className="space-y-2">
                <Label htmlFor="cantidad">Entregados *</Label>
                <Input 
                  id="cantidad"
                  type="number"
                  placeholder="0"
                  value={formData.cantidadEntregada}
                  onChange={(e) => setFormData({...formData, cantidadEntregada: e.target.value})}
                  className="text-lg font-semibold"
                />
              </div>
              
              {/* Vacíos devueltos */}
              <div className="space-y-2">
                <Label htmlFor="vacios">Vacíos devueltos</Label>
                <Input 
                  id="vacios"
                  type="number"
                  placeholder="0"
                  value={formData.vaciosDevueltos}
                  onChange={(e) => setFormData({...formData, vaciosDevueltos: e.target.value})}
                  className="text-lg font-semibold"
                />
              </div>
            </div>
            
            {/* Precio unitario */}
            <div className="space-y-2">
              <Label htmlFor="precio">Precio unitario</Label>
              <Input 
                id="precio"
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
            {/* Switch cobrado */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="cobrado">¿Se cobró?</Label>
                <p className="text-xs text-muted-foreground">Marcar si se recibió el pago</p>
              </div>
              <Switch 
                id="cobrado"
                checked={formData.cobrado}
                onCheckedChange={(checked) => setFormData({...formData, cobrado: checked})}
              />
            </div>
            
            {/* Monto cobrado (si es parcial) */}
            {formData.cobrado && (
              <div className="space-y-2">
                <Label htmlFor="montoCobrado">Monto cobrado</Label>
                <Input 
                  id="montoCobrado"
                  type="number"
                  placeholder={total.toString()}
                  value={formData.montoCobrado}
                  onChange={(e) => setFormData({...formData, montoCobrado: e.target.value})}
                />
                <p className="text-xs text-muted-foreground">
                  Dejar vacío si se cobró el total ({formatCurrency(total)})
                </p>
              </div>
            )}
            
            {/* Observaciones */}
            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea 
                id="observaciones"
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
          disabled={!formData.cliente || !formData.repartidor || !formData.producto || !formData.cantidadEntregada || isSubmitting}
        >
          {isSubmitting ? 'Guardando...' : 'Registrar reparto'}
        </Button>
      </form>
    </div>
  )
}
