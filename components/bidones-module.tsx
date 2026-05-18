"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Droplets, 
  ArrowLeft, 
  Package, 
  Truck, 
  AlertTriangle,
  Clock,
  Search
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { getEstadisticasBidones, bidonesPrestados, formatCurrency } from "@/lib/data"

export function BidonesModule() {
  const [searchTerm, setSearchTerm] = useState("")
  const stats = getEstadisticasBidones()
  
  const filteredPrestados = bidonesPrestados.filter(b => 
    b.cliente.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // Calcular días desde entrega (simulado)
  const getDiasDesdeEntrega = (fecha: string) => {
    const partes = fecha.split('/')
    const fechaEntrega = new Date(parseInt(partes[2]), parseInt(partes[1]) - 1, parseInt(partes[0]))
    const hoy = new Date(2026, 4, 18) // 18/05/2026
    const diff = Math.floor((hoy.getTime() - fechaEntrega.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }
  
  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bidones</h1>
          <p className="text-sm text-muted-foreground">Trazabilidad y control</p>
        </div>
      </div>
      
      {/* Resumen general */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <Package className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Total</span>
            </div>
            <p className="text-xl font-bold">{stats.totalBidones}</p>
          </CardContent>
        </Card>
        <Card className="bg-success/5 border-success/20">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <Droplets className="h-4 w-4 text-success" />
              <span className="text-xs text-muted-foreground">Llenos</span>
            </div>
            <p className="text-xl font-bold text-success">{stats.bidonesLlenos}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <Droplets className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Vacíos</span>
            </div>
            <p className="text-xl font-bold">{stats.bidonesVacios}</p>
          </CardContent>
        </Card>
        <Card className="bg-warning/5 border-warning/20">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <Truck className="h-4 w-4 text-warning" />
              <span className="text-xs text-muted-foreground">En calle</span>
            </div>
            <p className="text-xl font-bold text-warning">{stats.bidonesEnCalle}</p>
          </CardContent>
        </Card>
        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-accent" />
              <span className="text-xs text-muted-foreground">Prestados</span>
            </div>
            <p className="text-xl font-bold text-accent">{stats.bidonesPrestados}</p>
          </CardContent>
        </Card>
        <Card className="bg-destructive/5 border-destructive/20">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-xs text-muted-foreground">Rotos/Perdidos</span>
            </div>
            <p className="text-xl font-bold text-destructive">{stats.bidonesRotos}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar por cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {/* Bidones pendientes por cliente */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Bidones pendientes de devolución</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredPrestados.map((prestado) => {
            const dias = getDiasDesdeEntrega(prestado.fechaEntrega)
            const esUrgente = dias > 3
            
            return (
              <div 
                key={prestado.id}
                className={`p-3 rounded-lg border ${esUrgente ? 'border-warning/50 bg-warning/5' : 'bg-muted/30'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{prestado.cliente}</h3>
                    {esUrgente && (
                      <Badge variant="outline" className="text-[10px] text-warning border-warning">
                        {dias} días
                      </Badge>
                    )}
                  </div>
                  <p className="text-xl font-bold">{prestado.pendientesDevolucion}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Entregados: {prestado.cantidadPrestada}</span>
                  <span>Fecha: {prestado.fechaEntrega}</span>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
      
      {/* Resumen por estado */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Distribución de bidones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-success" />
                <span className="text-sm">En stock (llenos)</span>
              </div>
              <span className="font-medium">{stats.bidonesLlenos}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-muted-foreground" />
                <span className="text-sm">Vacíos disponibles</span>
              </div>
              <span className="font-medium">{stats.bidonesVacios}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-warning" />
                <span className="text-sm">En calle (clientes)</span>
              </div>
              <span className="font-medium">{stats.bidonesEnCalle}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive" />
                <span className="text-sm">Rotos/Perdidos</span>
              </div>
              <span className="font-medium">{stats.bidonesRotos}</span>
            </div>
          </div>
          
          {/* Barra visual */}
          <div className="flex h-4 rounded-full overflow-hidden mt-4">
            <div 
              className="bg-success" 
              style={{ width: `${(stats.bidonesLlenos / stats.totalBidones) * 100}%` }}
            />
            <div 
              className="bg-muted-foreground/50" 
              style={{ width: `${(stats.bidonesVacios / stats.totalBidones) * 100}%` }}
            />
            <div 
              className="bg-warning" 
              style={{ width: `${(stats.bidonesEnCalle / stats.totalBidones) * 100}%` }}
            />
            <div 
              className="bg-destructive" 
              style={{ width: `${(stats.bidonesRotos / stats.totalBidones) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
