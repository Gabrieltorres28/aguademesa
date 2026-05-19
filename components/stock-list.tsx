"use client"

import { useState } from "react"
import { Package, AlertTriangle, AlertCircle, Check, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { createStockItemAction, deleteStockItemAction, updateStockItemAction } from "@/lib/actions/stock"
import { DeleteSubmitButton } from "@/components/delete-submit-button"
import type { StockItem } from "@/lib/types"

export function StockList({ stockItems = [] }: { stockItems?: StockItem[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  
  const filteredProductos = stockItems.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  const getEstado = (p: StockItem) => p.current_stock <= p.min_stock ? "critico" : p.current_stock <= p.min_stock * 1.5 ? "bajo" : "normal"
  const productosCriticos = stockItems.filter(p => getEstado(p) === 'critico')
  const productosBajos = stockItems.filter(p => getEstado(p) === 'bajo')
  
  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Stock</h1>
          <p className="text-sm text-muted-foreground">Control de inventario</p>
        </div>
        <a href="#nuevo-stock">
          <Button size="sm">Nuevo</Button>
        </a>
      </div>
      
      {/* Alertas */}
      {(productosCriticos.length > 0 || productosBajos.length > 0) && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-foreground">Atención al stock</p>
                {productosCriticos.length > 0 && (
                  <p className="text-sm text-destructive mt-1">
                    <strong>Crítico:</strong> {productosCriticos.map(p => p.name).join(', ')}
                  </p>
                )}
                {productosBajos.length > 0 && (
                  <p className="text-sm text-warning mt-1">
                    <strong>Bajo:</strong> {productosBajos.map(p => p.name).join(', ')}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Resumen */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-1">
              <Check className="h-4 w-4 text-success" />
            </div>
            <p className="safe-number text-lg font-bold">{stockItems.filter(p => getEstado(p) === 'normal').length}</p>
            <p className="text-xs text-muted-foreground">Normal</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="h-8 w-8 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-1">
              <AlertCircle className="h-4 w-4 text-warning" />
            </div>
            <p className="safe-number text-lg font-bold">{productosBajos.length}</p>
            <p className="text-xs text-muted-foreground">Bajo</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-1">
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <p className="safe-number text-lg font-bold">{productosCriticos.length}</p>
            <p className="text-xs text-muted-foreground">Crítico</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {/* Lista de productos */}
      <div className="space-y-3">
        {filteredProductos.map((producto) => (
          <ProductoCard key={producto.id} producto={producto} />
        ))}
        {filteredProductos.length === 0 && (
          <Card><CardContent className="p-6 text-center text-sm text-muted-foreground">No hay stock cargado.</CardContent></Card>
        )}
      </div>

      <Card id="nuevo-stock">
        <CardHeader><CardTitle className="text-base">Nuevo item de stock</CardTitle></CardHeader>
        <CardContent>
          <form action={createStockItemAction} className="grid gap-3 md:grid-cols-5">
            <Input name="name" placeholder="Nombre" required />
            <Input name="category" placeholder="Categoría" required />
            <Input name="current_stock" type="number" placeholder="Stock" required />
            <Input name="min_stock" type="number" placeholder="Mínimo" required />
            <Button type="submit">Crear</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

interface ProductoCardProps {
  producto: StockItem
}

function ProductoCard({ producto }: ProductoCardProps) {
  const porcentaje = Math.min((producto.current_stock / Math.max(producto.min_stock * 3, 1)) * 100, 100)
  const estado = producto.current_stock <= producto.min_stock ? "critico" : producto.current_stock <= producto.min_stock * 1.5 ? "bajo" : "normal"
  
  const estadoColors = {
    normal: { badge: 'default', progress: 'bg-success' },
    bajo: { badge: 'secondary', progress: 'bg-warning' },
    critico: { badge: 'destructive', progress: 'bg-destructive' }
  }
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{producto.name}</h3>
              <p className="text-xs text-muted-foreground">
                Mínimo: {producto.min_stock} {producto.unit}
              </p>
            </div>
          </div>
          <Badge 
            variant={estadoColors[estado].badge as 'default' | 'secondary' | 'destructive'}
            className="shrink-0"
          >
            {estado === 'normal' ? 'Normal' : estado === 'bajo' ? 'Bajo' : 'Crítico'}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Stock actual</span>
            <span className="safe-number text-right text-lg font-bold">{producto.current_stock} {producto.unit}</span>
          </div>
          
          <div className="relative">
            <Progress value={porcentaje} className="h-2" />
            <div 
              className={`absolute top-0 left-0 h-2 rounded-full transition-all ${estadoColors[estado].progress}`}
              style={{ width: `${porcentaje}%` }}
            />
          </div>
        </div>
        <form action={updateStockItemAction} className="mt-3 grid grid-cols-[1fr_1fr_auto] gap-2">
          <input type="hidden" name="id" value={producto.id} />
          <Input name="current_stock" type="number" defaultValue={producto.current_stock} aria-label="Stock actual" />
          <Input name="min_stock" type="number" defaultValue={producto.min_stock} aria-label="Stock mínimo" />
          <Button type="submit" variant="outline">Editar</Button>
        </form>
        <form action={deleteStockItemAction} className="mt-2">
          <input type="hidden" name="id" value={producto.id} />
          <DeleteSubmitButton />
        </form>
      </CardContent>
    </Card>
  )
}
