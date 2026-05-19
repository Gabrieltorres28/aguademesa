"use client"

import { useState } from "react"
import { 
  Plus, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpCircle, 
  ArrowDownCircle,
  Edit
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/data"
import { createCashMovementAction, deleteCashMovementAction, updateCashMovementAction } from "@/lib/actions/cash"
import { DeleteSubmitButton } from "@/components/delete-submit-button"
import type { CashMovement } from "@/lib/types"

export function CajaModule({ movements = [] }: { movements?: CashMovement[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [manualMovement, setManualMovement] = useState({ type: "INGRESO", amount: "" })
  
  const today = new Date().toISOString().slice(0, 10)
  const monthStart = today.slice(0, 8) + "01"
  const ingresosDia = movements.filter(m => m.type === "INGRESO" && m.movement_date === today).reduce((acc, m) => acc + Number(m.amount), 0)
  const egresosDia = movements.filter(m => m.type === "EGRESO" && m.movement_date === today).reduce((acc, m) => acc + Number(m.amount), 0)
  const ingresosMes = movements.filter(m => m.type === "INGRESO" && m.movement_date >= monthStart).reduce((acc, m) => acc + Number(m.amount), 0)
  const egresosMes = movements.filter(m => m.type === "EGRESO" && m.movement_date >= monthStart).reduce((acc, m) => acc + Number(m.amount), 0)
  
  const ingresos = movements.filter(m => m.type === 'INGRESO')
  const egresos = movements.filter(m => m.type === 'EGRESO')
  
  const filterMovimientos = (lista: CashMovement[]) => {
    return lista.filter(m => {
      return m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.category.toLowerCase().includes(searchTerm.toLowerCase())
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
        <a href="#nuevo-movimiento">
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden md:inline">Registrar</span>
          </Button>
        </a>
      </div>
      
      {/* Resumen financiero */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-success/5 border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-xs text-muted-foreground">Ingresos del día</span>
            </div>
            <p className="safe-number text-xl font-bold text-success">{formatCurrency(ingresosDia)}</p>
          </CardContent>
        </Card>
        <Card className="bg-destructive/5 border-destructive/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="h-4 w-4 text-destructive" />
              <span className="text-xs text-muted-foreground">Gastos del día</span>
            </div>
            <p className="safe-number text-xl font-bold text-destructive">{formatCurrency(egresosDia)}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Resumen mensual */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Ingresos mes</p>
              <p className="safe-number text-lg font-bold text-success">{formatCurrency(ingresosMes)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Gastos mes</p>
              <p className="safe-number text-lg font-bold text-destructive">{formatCurrency(egresosMes)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Balance</p>
              <p className={`safe-number text-lg font-bold ${ingresosMes - egresosMes >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatCurrency(ingresosMes - egresosMes)}
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
            Todos ({movements.length})
          </TabsTrigger>
          <TabsTrigger value="ingresos" className="text-success data-[state=active]:text-success">
            Ingresos ({ingresos.length})
          </TabsTrigger>
          <TabsTrigger value="egresos" className="text-destructive data-[state=active]:text-destructive">
            Gastos ({egresos.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="todos" className="mt-4 space-y-3">
          {filterMovimientos(movements).map((mov) => (
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

      <Card id="nuevo-movimiento">
        <CardHeader><CardTitle className="text-base">Nuevo movimiento manual</CardTitle></CardHeader>
        <CardContent>
          <form action={createCashMovementAction} className="grid gap-3 md:grid-cols-6">
            <Input name="movement_date" type="date" defaultValue={today} required />
            <select
              name="type"
              value={manualMovement.type}
              onChange={(event) => setManualMovement({ ...manualMovement, type: event.target.value })}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="INGRESO">Ingreso</option>
              <option value="EGRESO">Egreso</option>
            </select>
            <Input name="category" placeholder="Categoría" required />
            <Input name="description" placeholder="Descripción" required className="md:col-span-2" />
            <Input
              name="amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="Monto"
              value={manualMovement.amount}
              onChange={(event) => setManualMovement({ ...manualMovement, amount: event.target.value })}
              required
            />
            <div className="rounded-lg bg-muted/50 p-3 md:col-span-6">
              <p className="text-xs text-muted-foreground">Movimiento calculado</p>
              <p className={`safe-number text-xl font-bold ${manualMovement.type === "INGRESO" ? "text-success" : "text-destructive"}`}>
                {manualMovement.type === "INGRESO" ? "+" : "-"}{formatCurrency(Number(manualMovement.amount || 0))}
              </p>
            </div>
            <Button type="submit" className="md:col-span-6">Guardar movimiento</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

interface MovimientoCardProps {
  movimiento: CashMovement
}

function MovimientoCard({ movimiento }: MovimientoCardProps) {
  const isIngreso = movimiento.type === 'INGRESO'
  const [editing, setEditing] = useState(false)
  
  return (
    <Card>
      <CardContent className="space-y-3 p-4">
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
              <p className="font-medium truncate">{movimiento.description}</p>
              <Badge variant="outline" className="text-[10px] shrink-0">
                {movimiento.category}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{movimiento.movement_date}</p>
          </div>
          
          <p className={`safe-number max-w-[42%] text-right text-lg font-bold shrink-0 ${
            isIngreso ? 'text-success' : 'text-destructive'
          }`}>
            {isIngreso ? '+' : '-'}{formatCurrency(Number(movimiento.amount))}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 border-t pt-3">
          <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => setEditing(!editing)}>
            <Edit className="h-4 w-4" />
            Editar
          </Button>
          <form action={deleteCashMovementAction}>
            <input type="hidden" name="id" value={movimiento.id} />
            <DeleteSubmitButton />
          </form>
        </div>
        {editing && (
          <form action={updateCashMovementAction} className="grid gap-2 rounded-lg bg-muted/40 p-3 min-[520px]:grid-cols-2">
            <input type="hidden" name="id" value={movimiento.id} />
            <Input name="movement_date" type="date" defaultValue={movimiento.movement_date} required />
            <select name="type" defaultValue={movimiento.type} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
              <option value="INGRESO">Ingreso</option>
              <option value="EGRESO">Egreso</option>
            </select>
            <Input name="category" defaultValue={movimiento.category} placeholder="Categoría" required />
            <Input name="amount" type="number" min="0" step="0.01" defaultValue={Number(movimiento.amount)} placeholder="Monto" required />
            <Input name="description" defaultValue={movimiento.description} placeholder="Descripción" required className="min-[520px]:col-span-2" />
            <Button type="submit" className="min-[520px]:col-span-2">Guardar cambios</Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
