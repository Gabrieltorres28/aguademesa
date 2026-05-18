"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Plus, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpCircle, 
  ArrowDownCircle,
  Filter
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { movimientos, formatCurrency, getEstadisticasFinanzas, categorias } from "@/lib/data"

export function CajaModule() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategoria, setFilterCategoria] = useState<string>("todas")
  
  const stats = getEstadisticasFinanzas()
  
  const ingresos = movimientos.filter(m => m.tipo === 'ingreso')
  const egresos = movimientos.filter(m => m.tipo === 'egreso')
  
  const filterMovimientos = (lista: typeof movimientos) => {
    return lista.filter(m => {
      const matchesSearch = m.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            m.categoria.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategoria = filterCategoria === "todas" || m.categoria === filterCategoria
      return matchesSearch && matchesCategoria
    })
  }
  
  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Caja</h1>
          <p className="text-sm text-muted-foreground">Control de ingresos y gastos</p>
        </div>
        <Link href="/caja/nuevo">
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden md:inline">Registrar</span>
          </Button>
        </Link>
      </div>
      
      {/* Resumen financiero */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-success/5 border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-xs text-muted-foreground">Ingresos del día</span>
            </div>
            <p className="text-xl font-bold text-success">{formatCurrency(stats.ingresosDelDia)}</p>
          </CardContent>
        </Card>
        <Card className="bg-destructive/5 border-destructive/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="h-4 w-4 text-destructive" />
              <span className="text-xs text-muted-foreground">Gastos del día</span>
            </div>
            <p className="text-xl font-bold text-destructive">{formatCurrency(stats.egresosDelDia)}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Resumen mensual */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Ingresos mes</p>
              <p className="text-lg font-bold text-success">{formatCurrency(stats.ingresosDelMes)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Gastos mes</p>
              <p className="text-lg font-bold text-destructive">{formatCurrency(stats.egresosDelMes)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Balance</p>
              <p className={`text-lg font-bold ${stats.balanceMensual >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatCurrency(stats.balanceMensual)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar movimiento..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="todos">
            Todos ({movimientos.length})
          </TabsTrigger>
          <TabsTrigger value="ingresos" className="text-success data-[state=active]:text-success">
            Ingresos ({ingresos.length})
          </TabsTrigger>
          <TabsTrigger value="egresos" className="text-destructive data-[state=active]:text-destructive">
            Gastos ({egresos.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="todos" className="mt-4 space-y-3">
          {filterMovimientos(movimientos).map((mov) => (
            <MovimientoCard key={mov.id} movimiento={mov} />
          ))}
        </TabsContent>
        
        <TabsContent value="ingresos" className="mt-4 space-y-3">
          {filterMovimientos(ingresos).map((mov) => (
            <MovimientoCard key={mov.id} movimiento={mov} />
          ))}
        </TabsContent>
        
        <TabsContent value="egresos" className="mt-4 space-y-3">
          {filterMovimientos(egresos).map((mov) => (
            <MovimientoCard key={mov.id} movimiento={mov} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface MovimientoCardProps {
  movimiento: typeof movimientos[0]
}

function MovimientoCard({ movimiento }: MovimientoCardProps) {
  const isIngreso = movimiento.tipo === 'ingreso'
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
            isIngreso ? 'bg-success/10' : 'bg-destructive/10'
          }`}>
            {isIngreso 
              ? <ArrowUpCircle className="h-5 w-5 text-success" />
              : <ArrowDownCircle className="h-5 w-5 text-destructive" />
            }
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-medium truncate">{movimiento.descripcion}</p>
              <Badge variant="outline" className="text-[10px] shrink-0">
                {movimiento.categoria}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{movimiento.fecha}</p>
          </div>
          
          <p className={`font-bold text-lg shrink-0 ${
            isIngreso ? 'text-success' : 'text-destructive'
          }`}>
            {isIngreso ? '+' : '-'}{formatCurrency(movimiento.monto)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
