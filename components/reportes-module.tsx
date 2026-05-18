"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  ArrowLeft, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Droplets,
  DollarSign,
  Users,
  Calendar
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  clientes, 
  repartos, 
  movimientos,
  formatCurrency, 
  getEstadisticasDiarias,
  getEstadisticasFinanzas,
  getEstadisticasBidones
} from "@/lib/data"

export function ReportesModule() {
  const statsDiarias = getEstadisticasDiarias()
  const statsFinanzas = getEstadisticasFinanzas()
  const statsBidones = getEstadisticasBidones()
  
  // Calcular datos para reportes
  const entregasPorMarca = clientes
    .filter(c => c.tipo === 'marca')
    .map(c => ({
      nombre: c.nombre,
      entregas: repartos.filter(r => r.cliente === c.nombre).reduce((acc, r) => acc + r.bidonesEntregados, 0),
      pendiente: c.saldoPendiente,
      bidonesEnCalle: c.bidonesEnCalle
    }))
    .sort((a, b) => b.entregas - a.entregas)
  
  const repartosDelMes = repartos.length
  const totalEntregado = repartos.reduce((acc, r) => acc + r.bidonesEntregados, 0)
  const totalDevuelto = repartos.reduce((acc, r) => acc + r.vaciosDevueltos, 0)
  
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
          <p className="text-sm text-muted-foreground">Análisis y estadísticas</p>
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
                <CardTitle className="text-base">Reporte del 18/05/2026</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Repartos realizados</p>
                  <p className="text-2xl font-bold">{statsDiarias.repartosDelDia}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Bidones entregados</p>
                  <p className="text-2xl font-bold">{statsDiarias.bidonesEntregadosHoy}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Ingresos del día</p>
                  <p className="text-2xl font-bold text-success">{formatCurrency(statsFinanzas.ingresosDelDia)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Gastos del día</p>
                  <p className="text-2xl font-bold text-destructive">{formatCurrency(statsFinanzas.egresosDelDia)}</p>
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
              <p className="text-sm text-muted-foreground">Semana del 13 al 18 de mayo</p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Repartos</p>
                  <p className="text-2xl font-bold">{repartosDelMes}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Bidones entregados</p>
                  <p className="text-2xl font-bold">{totalEntregado}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="mensual" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Resumen mensual - Mayo 2026</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Ingresos totales</p>
                  <p className="text-2xl font-bold text-success">{formatCurrency(statsFinanzas.ingresosDelMes)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Gastos totales</p>
                  <p className="text-2xl font-bold text-destructive">{formatCurrency(statsFinanzas.egresosDelMes)}</p>
                </div>
                <div className="col-span-2 pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Balance del mes</p>
                    <p className={`text-2xl font-bold ${statsFinanzas.balanceMensual >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {formatCurrency(statsFinanzas.balanceMensual)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Entregas por marca */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Entregas por marca</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {entregasPorMarca.map((marca, index) => (
            <div key={marca.nombre} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-4">{index + 1}.</span>
                  <span className="font-medium">{marca.nombre}</span>
                </div>
                <span className="font-bold">{marca.entregas} bidones</span>
              </div>
              <div className="flex h-2 rounded-full overflow-hidden bg-muted">
                <div 
                  className="bg-primary transition-all"
                  style={{ width: `${(marca.entregas / Math.max(...entregasPorMarca.map(m => m.entregas))) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Bidones pendientes por marca */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-warning" />
            <CardTitle className="text-base">Bidones pendientes por marca</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {entregasPorMarca
            .filter(m => m.bidonesEnCalle > 0)
            .sort((a, b) => b.bidonesEnCalle - a.bidonesEnCalle)
            .map((marca) => (
            <div key={marca.nombre} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <span className="font-medium">{marca.nombre}</span>
              <div className="text-right">
                <p className="font-bold text-warning">{marca.bidonesEnCalle} bidones</p>
              </div>
            </div>
          ))}
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
            {entregasPorMarca
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
                {formatCurrency(entregasPorMarca.reduce((acc, m) => acc + m.pendiente, 0))}
              </p>
            </div>
          </div>
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
                <span className="font-bold text-success">{formatCurrency(statsFinanzas.ingresosDelMes)}</span>
              </div>
              <div className="h-4 rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full bg-success rounded-full"
                  style={{ width: `${(statsFinanzas.ingresosDelMes / (statsFinanzas.ingresosDelMes + statsFinanzas.egresosDelMes)) * 100}%` }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Gastos</span>
                <span className="font-bold text-destructive">{formatCurrency(statsFinanzas.egresosDelMes)}</span>
              </div>
              <div className="h-4 rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full bg-destructive rounded-full"
                  style={{ width: `${(statsFinanzas.egresosDelMes / (statsFinanzas.ingresosDelMes + statsFinanzas.egresosDelMes)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
