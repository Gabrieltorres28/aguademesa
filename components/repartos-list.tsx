"use client"

import { useState } from "react"
import Link from "next/link"
import { Edit, Plus, Search, Droplets, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/data"
import { deleteFillingAction } from "@/lib/actions/fillings"
import { DeleteSubmitButton } from "@/components/delete-submit-button"
import type { Brand, Filling } from "@/lib/types"

export function RepartosList({ fillings = [], brands = [], status, error }: { fillings?: Filling[]; brands?: Brand[]; status?: string; error?: string }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterMarca, setFilterMarca] = useState<string>("todos")
  const [filterEstado, setFilterEstado] = useState<string>("todos")
  
  const filteredLlenados = fillings.filter(llenado => {
    const brandName = llenado.brands?.name || "Sin marca"
    const matchesSearch = brandName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMarca = filterMarca === "todos" || llenado.brand_id === filterMarca
    const matchesEstado = filterEstado === "todos" || llenado.payment_status === filterEstado
    return matchesSearch && matchesMarca && matchesEstado
  })
  
  const today = new Date().toISOString().slice(0, 10)
  const llenadosHoy = fillings.filter(r => r.filling_date === today)
  const totalPendienteHoy = fillings.reduce((acc, r) => acc + Math.max(Number(r.total_amount) - Number(r.paid_amount), 0), 0)
  const bidonesLlenadosHoy = llenadosHoy.reduce((acc, r) => acc + r.filled_qty, 0)
  
  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Llenados</h1>
          <p className="text-sm text-muted-foreground">Control de llenados por marca</p>
        </div>
        <Link href="/llenados/nuevo">
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden md:inline">Nuevo</span>
          </Button>
        </Link>
      </div>

      {status && <StatusMessage text={status} />}
      {error && <ErrorMessage text={error} />}
      
      {/* Resumen del día */}
      <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 md:grid-cols-3">
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Llenados hoy</p>
            <p className="safe-number text-xl font-bold">{llenadosHoy.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Bidones llenados hoy</p>
            <p className="safe-number text-lg font-bold text-success min-[380px]:text-xl">{bidonesLlenadosHoy}</p>
          </CardContent>
        </Card>
        <Card className="min-[380px]:col-span-2 md:col-span-1">
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Pendiente de cobro</p>
            <p className="safe-number text-lg font-bold text-warning min-[380px]:text-xl">{formatCurrency(totalPendienteHoy)}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Búsqueda y filtros */}
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar marca o revendedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 md:flex">
          <Select value={filterMarca} onValueChange={setFilterMarca}>
            <SelectTrigger className="w-full md:w-[140px]">
              <SelectValue placeholder="Marca" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {brands.map(r => (
                <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterEstado} onValueChange={setFilterEstado}>
            <SelectTrigger className="w-full md:w-[140px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="PAGADO">Pagado</SelectItem>
              <SelectItem value="PARCIAL">Parcial</SelectItem>
              <SelectItem value="PENDIENTE">Pendiente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Lista de llenados */}
      <div className="space-y-3">
        {filteredLlenados.map((llenado) => (
            <Card key={llenado.id} className="hover:bg-muted/50 transition-colors">
              <CardContent className="p-3 min-[380px]:p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-4">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Droplets className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="min-w-0 flex-1 font-semibold break-words">{llenado.brands?.name || "Sin marca"}</p>
                        <Badge 
                          variant={
                            llenado.payment_status === 'PAGADO' ? 'default' : 
                            llenado.payment_status === 'PARCIAL' ? 'secondary' : 'outline'
                          }
                          className="text-[10px] shrink-0"
                        >
                          {llenado.payment_status === 'PAGADO' ? 'Pagado' : 
                           llenado.payment_status === 'PARCIAL' ? 'Parcial' : 'Pendiente'}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {llenado.filling_date}
                        </span>
                        <span>Servicio de llenado</span>
                        <span>{formatCurrency(Number(llenado.unit_price))} c/u</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm">
                        <span className="text-muted-foreground">
                          Recibidos: <span className="text-foreground font-medium">{llenado.received_qty}</span>
                        </span>
                        <span className="text-muted-foreground">
                          Llenados: <span className="text-foreground font-medium">{llenado.filled_qty}</span>
                        </span>
                        <span className="text-muted-foreground">
                          Retirados: <span className="text-foreground font-medium">{llenado.withdrawn_qty}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 rounded-lg bg-muted/40 p-3 text-left md:bg-transparent md:p-0 md:text-right md:shrink-0">
                    <p className="safe-number text-base font-bold min-[380px]:text-lg">{formatCurrency(Number(llenado.total_amount))}</p>
                    {Number(llenado.paid_amount) > 0 && Number(llenado.paid_amount) < Number(llenado.total_amount) && (
                      <p className="text-xs text-muted-foreground break-words">
                        Cobrado: {formatCurrency(Number(llenado.paid_amount))}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 border-t pt-3">
                  <Link href={`/llenados/${llenado.id}`}>
                    <Button variant="outline" size="sm">Ver</Button>
                  </Link>
                  <Link href={`/llenados/${llenado.id}/editar`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit className="h-4 w-4" />
                      Editar
                    </Button>
                  </Link>
                  <form action={deleteFillingAction} onClick={(event) => event.stopPropagation()}>
                    <input type="hidden" name="id" value={llenado.id} />
                    <DeleteSubmitButton />
                  </form>
                </div>
                {llenado.notes && (
                  <p className="mt-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                    {llenado.notes}
                  </p>
                )}
              </CardContent>
            </Card>
        ))}
        {filteredLlenados.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center text-sm text-muted-foreground">
              No hay llenados cargados todavía.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}


function StatusMessage({ text }: { text: string }) {
  return <div className="rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success">{text}</div>
}

function ErrorMessage({ text }: { text: string }) {
  return <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{text}</div>
}
