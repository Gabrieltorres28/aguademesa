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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { categorias, formatCurrency } from "@/lib/data"

export function NuevoMovimientoForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    tipo: "egreso",
    categoria: "",
    descripcion: "",
    monto: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const categoriasOptions = formData.tipo === 'ingreso' 
    ? categorias.ingresos 
    : categorias.egresos
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Guardado local de transición; la carga real se realiza desde Caja.
    await new Promise(resolve => setTimeout(resolve, 800))
    
    setShowSuccess(true)
    setTimeout(() => {
      router.push('/caja')
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
            <h2 className="text-xl font-bold mb-2">
              {formData.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'} registrado
            </h2>
            <p className="text-muted-foreground">
              {formatCurrency(parseInt(formData.monto) || 0)}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/caja">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nuevo movimiento</h1>
          <p className="text-sm text-muted-foreground">Registrar ingreso o gasto</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Tipo de movimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={formData.tipo}
              onValueChange={(value) => setFormData({...formData, tipo: value, categoria: ""})}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem 
                  value="ingreso" 
                  id="ingreso" 
                  className="peer sr-only" 
                />
                <Label 
                  htmlFor="ingreso"
                  className="flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer peer-data-[state=checked]:border-success peer-data-[state=checked]:bg-success/5 hover:bg-muted/50 transition-colors"
                >
                  <span className="text-lg font-semibold text-success">Ingreso</span>
                  <span className="text-xs text-muted-foreground">Cobro o venta</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem 
                  value="egreso" 
                  id="egreso" 
                  className="peer sr-only" 
                />
                <Label 
                  htmlFor="egreso"
                  className="flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer peer-data-[state=checked]:border-destructive peer-data-[state=checked]:bg-destructive/5 hover:bg-muted/50 transition-colors"
                >
                  <span className="text-lg font-semibold text-destructive">Gasto</span>
                  <span className="text-xs text-muted-foreground">Pago o compra</span>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Detalles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Categoría */}
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría *</Label>
              <Select 
                value={formData.categoria} 
                onValueChange={(value) => setFormData({...formData, categoria: value})}
              >
                <SelectTrigger id="categoria">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categoriasOptions.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Monto */}
            <div className="space-y-2">
              <Label htmlFor="monto">Monto *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input 
                  id="monto"
                  type="number"
                  placeholder="0"
                  value={formData.monto}
                  onChange={(e) => setFormData({...formData, monto: e.target.value})}
                  className="pl-8 text-lg font-semibold"
                />
              </div>
            </div>
            
            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción *</Label>
              <Textarea 
                id="descripcion"
                placeholder="Detalle del movimiento..."
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Resumen */}
        {formData.monto && (
          <Card className={formData.tipo === 'ingreso' ? 'bg-success/5 border-success/20' : 'bg-destructive/5 border-destructive/20'}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {formData.tipo === 'ingreso' ? 'Ingreso a registrar' : 'Gasto a registrar'}
                </span>
                <span className={`text-2xl font-bold ${
                  formData.tipo === 'ingreso' ? 'text-success' : 'text-destructive'
                }`}>
                  {formData.tipo === 'ingreso' ? '+' : '-'}{formatCurrency(parseInt(formData.monto) || 0)}
                </span>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Botón guardar */}
        <Button 
          type="submit" 
          className="w-full h-12 text-base"
          disabled={!formData.categoria || !formData.monto || !formData.descripcion || isSubmitting}
        >
          {isSubmitting ? 'Guardando...' : 'Registrar movimiento'}
        </Button>
      </form>
    </div>
  )
}
