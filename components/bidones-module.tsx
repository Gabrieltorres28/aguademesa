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
  Search,
  Factory
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import type { Filling, OwnClient, StockItem } from "@/lib/types"

export function BidonesModule({ fillings = [], stockItems = [], ownClients = [] }: { fillings?: Filling[], stockItems?: StockItem[], ownClients?: OwnClient[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const stats = {
    totalBidones: stockItems.filter(i => i.category.toLowerCase().includes("bid")).reduce((acc, i) => acc + i.current_stock, 0) + ownClients.reduce((acc, c) => acc + c.bottles_in_street, 0),
    bidonesLlenos: stockItems.filter(i => i.name.toLowerCase().includes("lleno")).reduce((acc, i) => acc + i.current_stock, 0),
    bidonesVacios: stockItems.filter(i => i.name.toLowerCase().includes("vac")).reduce((acc, i) => acc + i.current_stock, 0),
    bidonesEnCalle: ownClients.reduce((acc, c) => acc + c.bottles_in_street, 0),
    bidonesPrestados: ownClients.reduce((acc, c) => acc + c.bottles_in_street, 0),
    bidonesRotos: 0,
    bidonesProcesadosTerceros: fillings.reduce((acc, f) => acc + f.filled_qty, 0),
  }
  
  const filteredPrestados = ownClients.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const filteredProcesados = fillings.filter(b =>
    (b.brands?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  )
  
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
          <p className="text-sm text-muted-foreground">Bidones propios y procesados para terceros</p>
        </div>
      </div>
      
      {/* Resumen general */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <Package className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Propios total</span>
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
              <span className="text-xs text-muted-foreground">Propios en calle</span>
            </div>
            <p className="text-xl font-bold text-warning">{stats.bidonesEnCalle}</p>
          </CardContent>
        </Card>
        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-accent" />
              <span className="text-xs text-muted-foreground">Propios prestados</span>
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
          placeholder="Buscar por marca o cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {/* Bidones procesados para terceros */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Bidones procesados para terceros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredProcesados.map((procesado) => (
            <div key={procesado.id} className="rounded-lg border bg-muted/30 p-3">
              <div className="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
                <div className="flex items-center gap-2">
                  <Factory className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">{procesado.brands?.name || "Sin marca"}</h3>
                </div>
                <span className="text-xs text-muted-foreground">{procesado.filling_date}</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
                <div className="rounded-md bg-card p-2">
                  <p className="text-xs text-muted-foreground">Recibida</p>
                  <p className="font-bold">{procesado.received_qty}</p>
                </div>
                <div className="rounded-md bg-card p-2">
                  <p className="text-xs text-muted-foreground">Llenada</p>
                  <p className="font-bold text-success">{procesado.filled_qty}</p>
                </div>
                <div className="rounded-md bg-card p-2">
                  <p className="text-xs text-muted-foreground">Retirada</p>
                  <p className="font-bold">{procesado.withdrawn_qty}</p>
                </div>
              </div>
            </div>
          ))}
          <p className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
            Estos bidones pertenecen a cada marca. No forman parte del stock propio ni de los bidones en calle de Dos Hermanas.
          </p>
        </CardContent>
      </Card>

      {/* Bidones propios en calle */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Bidones propios de Dos Hermanas en calle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredPrestados.map((prestado) => {
            const esUrgente = prestado.bottles_in_street > 10

            return (
              <div
                key={prestado.id}
                className={`p-3 rounded-lg border ${esUrgente ? 'border-warning/50 bg-warning/5' : 'bg-muted/30'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{prestado.name}</h3>
                    {esUrgente && (
                      <Badge variant="outline" className="text-[10px] text-warning border-warning">
                        alto
                      </Badge>
                    )}
                  </div>
                  <p className="text-xl font-bold">{prestado.bottles_in_street}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Cliente propio</span>
                  <span>{prestado.address || "Sin dirección"}</span>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
      
      {/* Resumen por estado */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Distribución de bidones propios</CardTitle>
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
                <span className="text-sm">En calle (clientes propios)</span>
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
