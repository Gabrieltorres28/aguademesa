"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Search, Truck, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { repartos, formatCurrency, repartidores } from "@/lib/data"

export function RepartosList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRepartidor, setFilterRepartidor] = useState<string>("todos")
  const [filterEstado, setFilterEstado] = useState<string>("todos")
  
  const filteredRepartos = repartos.filter(reparto => {
    const matchesSearch = reparto.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          reparto.repartidor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRepartidor = filterRepartidor === "todos" || reparto.repartidor === filterRepartidor
    const matchesEstado = filterEstado === "todos" || reparto.estado === filterEstado
    return matchesSearch && matchesRepartidor && matchesEstado
  })
  
  const repartosHoy = repartos.filter(r => r.fecha === '18/05/2026')
  const totalCobradoHoy = repartosHoy.reduce((acc, r) => acc + r.montoCobrado, 0)
  const totalPendienteHoy = repartosHoy.reduce((acc, r) => acc + (r.montoTotal - r.montoCobrado), 0)
  
  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Repartos</h1>
          <p className="text-sm text-muted-foreground">Gestión de entregas diarias</p>
        </div>
        <Link href="/repartos/nuevo">
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden md:inline">Nuevo</span>
          </Button>
        </Link>
      </div>
      
      {/* Resumen del día */}
      <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 md:grid-cols-3">
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Repartos hoy</p>
            <p className="text-xl font-bold break-words">{repartosHoy.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Cobrado</p>
            <p className="text-lg font-bold text-success break-words min-[380px]:text-xl">{formatCurrency(totalCobradoHoy)}</p>
          </CardContent>
        </Card>
        <Card className="min-[380px]:col-span-2 md:col-span-1">
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Pendiente</p>
            <p className="text-lg font-bold text-warning break-words min-[380px]:text-xl">{formatCurrency(totalPendienteHoy)}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Búsqueda y filtros */}
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar cliente o repartidor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 md:flex">
          <Select value={filterRepartidor} onValueChange={setFilterRepartidor}>
            <SelectTrigger className="w-full md:w-[140px]">
              <SelectValue placeholder="Repartidor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {repartidores.map(r => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterEstado} onValueChange={setFilterEstado}>
            <SelectTrigger className="w-full md:w-[140px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="cobrado">Cobrado</SelectItem>
              <SelectItem value="parcial">Parcial</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Lista de repartos */}
      <div className="space-y-3">
        {filteredRepartos.map((reparto) => (
          <Link key={reparto.id} href={`/repartos/${reparto.id}`}>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardContent className="p-3 min-[380px]:p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-4">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Truck className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="min-w-0 flex-1 font-semibold break-words">{reparto.cliente}</p>
                        <Badge 
                          variant={
                            reparto.estado === 'cobrado' ? 'default' : 
                            reparto.estado === 'parcial' ? 'secondary' : 'outline'
                          }
                          className="text-[10px] shrink-0"
                        >
                          {reparto.estado === 'cobrado' ? 'Cobrado' : 
                           reparto.estado === 'parcial' ? 'Parcial' : 'Pendiente'}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {reparto.fecha}
                        </span>
                        <span>{reparto.repartidor}</span>
                        <span>{reparto.producto}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm">
                        <span className="text-muted-foreground">
                          Entregados: <span className="text-foreground font-medium">{reparto.bidonesEntregados}</span>
                        </span>
                        <span className="text-muted-foreground">
                          Devueltos: <span className="text-foreground font-medium">{reparto.vaciosDevueltos}</span>
                        </span>
                        {reparto.bidonesPendientes > 0 && (
                          <span className="text-warning">
                            Pendientes: <span className="font-medium">{reparto.bidonesPendientes}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 rounded-lg bg-muted/40 p-3 text-left md:bg-transparent md:p-0 md:text-right md:shrink-0">
                    <p className="font-bold text-base break-words min-[380px]:text-lg">{formatCurrency(reparto.montoTotal)}</p>
                    {reparto.montoCobrado > 0 && reparto.montoCobrado < reparto.montoTotal && (
                      <p className="text-xs text-muted-foreground break-words">
                        Cobrado: {formatCurrency(reparto.montoCobrado)}
                      </p>
                    )}
                  </div>
                </div>
                {reparto.observaciones && (
                  <p className="mt-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                    {reparto.observaciones}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
