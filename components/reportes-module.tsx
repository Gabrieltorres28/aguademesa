"use client"

import Link from "next/link"
import { 
  ArrowLeft, 
  BarChart3, 
  Droplets,
  DollarSign,
  Users,
  Calendar
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/data"
import type { Brand, CashMovement, Delivery, Filling, OwnClient, StockItem } from "@/lib/types"

export function ReportesModule({
  brands = [],
  fillings = [],
  deliveries = [],
  cashMovements = [],
  stockItems = [],
  ownClients = [],
}: {
  brands?: Brand[]
  fillings?: Filling[]
  deliveries?: Delivery[]
  cashMovements?: CashMovement[]
  stockItems?: StockItem[]
  ownClients?: OwnClient[]
}) {
  const today = new Date().toISOString().slice(0, 10)
  const monthStart = today.slice(0, 8) + "01"
  const displayToday = new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${today}T00:00:00`))

  const fillingsToday = fillings.filter((item) => item.filling_date === today)
  const movementsToday = cashMovements.filter((item) => item.movement_date === today)
  const movementsMonth = cashMovements.filter((item) => item.movement_date >= monthStart)

  const ingresosDia = movementsToday.filter((item) => item.type === "INGRESO").reduce((acc, item) => acc + Number(item.amount), 0)
  const egresosDia = movementsToday.filter((item) => item.type === "EGRESO").reduce((acc, item) => acc + Number(item.amount), 0)
  const ingresosMes = movementsMonth.filter((item) => item.type === "INGRESO").reduce((acc, item) => acc + Number(item.amount), 0)
  const egresosMes = movementsMonth.filter((item) => item.type === "EGRESO").reduce((acc, item) => acc + Number(item.amount), 0)

  const llenadosPorMarca = brands.map((brand) => {
    const brandFillings = fillings.filter((item) => item.brand_id === brand.id)
    return {
      id: brand.id,
      nombre: brand.name,
      llenados: brandFillings.reduce((acc, item) => acc + item.filled_qty, 0),
      retirados: brandFillings.reduce((acc, item) => acc + item.withdrawn_qty, 0),
      pendiente: brandFillings.reduce((acc, item) => acc + Math.max(Number(item.total_amount) - Number(item.paid_amount), 0), 0),
    }
  }).filter((item) => item.llenados > 0 || item.pendiente > 0).sort((a, b) => b.llenados - a.llenados)

  const totalLlenado = fillings.reduce((acc, item) => acc + item.filled_qty, 0)
  const totalRepartido = deliveries.reduce((acc, item) => acc + item.delivered_qty, 0)
  const totalPendienteClientes = ownClients.reduce((acc, item) => acc + Number(item.balance), 0)
  const stockCritico = stockItems.filter((item) => item.current_stock <= item.min_stock)
  const maxLlenados = Math.max(1, ...llenadosPorMarca.map((item) => item.llenados))

  const ratio = (value: number, total: number) => total > 0 ? `${(value / total) * 100}%` : "0%"
  
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
          <h1 className="text-2xl font-bold text-foreground">Reportes</h1>
          <p className="text-sm text-muted-foreground">Control de planta y operación diaria</p>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="diario" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="diario">Diario</TabsTrigger>
          <TabsTrigger value="semanal">Semanal</TabsTrigger>
          <TabsTrigger value="mensual">Mensual</TabsTrigger>
        </TabsList>
        
        <TabsContent value="diario" className="mt-4 space-y-4">
          {/* Resumen del día */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Reporte del {displayToday}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Servicios de llenado</p>
                  <p className="text-2xl font-bold">{fillingsToday.length}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Bidones llenados</p>
                  <p className="text-2xl font-bold">{fillingsToday.reduce((acc, item) => acc + item.filled_qty, 0)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Ingresos del día</p>
                  <p className="text-2xl font-bold text-success">{formatCurrency(ingresosDia)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Gastos del día</p>
                  <p className="text-2xl font-bold text-destructive">{formatCurrency(egresosDia)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="semanal" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Resumen semanal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Actividad acumulada cargada en el sistema</p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Llenados</p>
                  <p className="text-2xl font-bold">{fillings.length}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Bidones procesados</p>
                  <p className="text-2xl font-bold">{totalLlenado}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Repartos propios</p>
                  <p className="text-2xl font-bold">{deliveries.length}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Bidones repartidos</p>
                  <p className="text-2xl font-bold">{totalRepartido}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="mensual" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Resumen mensual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Ingresos totales</p>
                  <p className="text-2xl font-bold text-success">{formatCurrency(ingresosMes)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Gastos totales</p>
                  <p className="text-2xl font-bold text-destructive">{formatCurrency(egresosMes)}</p>
                </div>
                <div className="col-span-2 pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Balance del mes</p>
                    <p className={`text-2xl font-bold ${ingresosMes - egresosMes >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {formatCurrency(ingresosMes - egresosMes)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Llenados por marca */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Llenados por marca</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {llenadosPorMarca.map((marca, index) => (
            <div key={marca.nombre} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-4">{index + 1}.</span>
                  <span className="font-medium">{marca.nombre}</span>
                </div>
                <span className="font-bold">{marca.llenados} bidones</span>
              </div>
              <div className="flex h-2 rounded-full overflow-hidden bg-muted">
                <div 
                  className="bg-primary transition-all"
                  style={{ width: `${(marca.llenados / maxLlenados) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Bidones retirados por marca */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-warning" />
            <CardTitle className="text-base">Historial de bidones procesados</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {llenadosPorMarca
            .sort((a, b) => b.retirados - a.retirados)
            .map((marca) => (
            <div key={marca.nombre} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <span className="font-medium">{marca.nombre}</span>
              <div className="text-right">
                <p className="font-bold text-warning">{marca.llenados} llenados</p>
                <p className="text-xs text-muted-foreground">{marca.retirados} retirados</p>
              </div>
            </div>
          ))}
          {llenadosPorMarca.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">Sin llenados cargados.</p>
          )}
        </CardContent>
      </Card>
      
      {/* Cuentas a cobrar */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-accent" />
            <CardTitle className="text-base">Cuentas a cobrar</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {llenadosPorMarca
              .filter(m => m.pendiente > 0)
              .sort((a, b) => b.pendiente - a.pendiente)
              .map((marca) => (
              <div key={marca.nombre} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="font-medium">{marca.nombre}</span>
                <p className="font-bold text-warning">{formatCurrency(marca.pendiente)}</p>
              </div>
            ))}
            <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg border border-warning/20">
              <span className="font-semibold">Total a cobrar</span>
              <p className="font-bold text-xl text-warning">
                {formatCurrency(llenadosPorMarca.reduce((acc, m) => acc + m.pendiente, 0))}
              </p>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
              <span className="font-semibold">Clientes propios</span>
              <p className="font-bold text-xl text-warning">{formatCurrency(totalPendienteClientes)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Stock crítico</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {stockCritico.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
              <span className="font-medium">{item.name}</span>
              <span className="font-bold text-destructive">{item.current_stock} {item.unit}</span>
            </div>
          ))}
          {stockCritico.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No hay items críticos.</p>
          )}
        </CardContent>
      </Card>
      
      {/* Ingresos vs Gastos */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Ingresos vs Gastos</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Ingresos</span>
                <span className="font-bold text-success">{formatCurrency(ingresosMes)}</span>
              </div>
              <div className="h-4 rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full bg-success rounded-full"
                  style={{ width: ratio(ingresosMes, ingresosMes + egresosMes) }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Gastos</span>
                <span className="font-bold text-destructive">{formatCurrency(egresosMes)}</span>
              </div>
              <div className="h-4 rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full bg-destructive rounded-full"
                  style={{ width: ratio(egresosMes, ingresosMes + egresosMes) }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
