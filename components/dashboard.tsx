"use client"

import { 
  DollarSign, 
  Droplets, 
  TrendingUp, 
  AlertTriangle,
  Package,
  Receipt,
  Plus,
  Truck,
  BarChart3,
  ArrowRight,
  Clock
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getEstadisticasDiarias, formatCurrency, repartos, clientes } from "@/lib/data"

export function Dashboard() {
  const stats = getEstadisticasDiarias()
  const ultimosRepartos = repartos.slice(0, 3)
  const clientesConPendientes = clientes.filter(c => c.bidonesEnCalle > 20)
  
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">18 de mayo de 2026</p>
      </div>
      
      {/* Alerta de bidones pendientes */}
      {clientesConPendientes.length > 0 && (
        <Card className="border-warning/50 bg-warning/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-foreground">Bidones pendientes de devolución</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {clientesConPendientes.map(c => c.nombre).join(', ')} tienen más de 20 bidones en calle
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <StatCard 
          title="Ventas del día"
          value={formatCurrency(stats.ventasDelDia)}
          icon={DollarSign}
          variant="primary"
        />
        <StatCard 
          title="Bidones hoy"
          value={stats.bidonesEntregadosHoy.toString()}
          icon={Droplets}
          variant="accent"
        />
        <StatCard 
          title="En calle"
          value={stats.bidonesEnCalle.toString()}
          icon={Truck}
          variant="warning"
        />
        <StatCard 
          title="Por cobrar"
          value={formatCurrency(stats.cuentasACobrar)}
          icon={Receipt}
          variant="default"
        />
        <StatCard 
          title="Gastos mes"
          value={formatCurrency(stats.gastosDelMes)}
          icon={TrendingUp}
          variant="destructive"
        />
        <StatCard 
          title="Stock bidones"
          value={stats.stockDisponible.toString()}
          icon={Package}
          variant="success"
        />
      </div>
      
      {/* Accesos rápidos */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Link href="/repartos/nuevo">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
            <CardContent className="p-4 flex flex-col items-center justify-center gap-2 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <span className="font-medium text-sm">Nuevo reparto</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/caja/nuevo">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
            <CardContent className="p-4 flex flex-col items-center justify-center gap-2 text-center">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Receipt className="h-6 w-6 text-accent" />
              </div>
              <span className="font-medium text-sm">Registrar gasto</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/reportes">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
            <CardContent className="p-4 flex flex-col items-center justify-center gap-2 text-center">
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-success" />
              </div>
              <span className="font-medium text-sm">Ver reportes</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/bidones">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
            <CardContent className="p-4 flex flex-col items-center justify-center gap-2 text-center">
              <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                <Droplets className="h-6 w-6 text-warning" />
              </div>
              <span className="font-medium text-sm">Bidones</span>
            </CardContent>
          </Card>
        </Link>
      </div>
      
      {/* Últimos movimientos */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Últimos repartos</CardTitle>
            <Link href="/repartos">
              <Button variant="ghost" size="sm" className="text-xs">
                Ver todos <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {ultimosRepartos.map((reparto) => (
            <div 
              key={reparto.id} 
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{reparto.cliente}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{reparto.repartidor}</span>
                    <span>•</span>
                    <span>{reparto.bidonesEntregados} bidones</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">{formatCurrency(reparto.montoTotal)}</p>
                <Badge 
                  variant={
                    reparto.estado === 'cobrado' ? 'default' : 
                    reparto.estado === 'parcial' ? 'secondary' : 'outline'
                  }
                  className="text-[10px] mt-1"
                >
                  {reparto.estado === 'cobrado' ? 'Cobrado' : 
                   reparto.estado === 'parcial' ? 'Parcial' : 'Pendiente'}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Estado de clientes principales */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Estado de marcas</CardTitle>
            <Link href="/clientes">
              <Button variant="ghost" size="sm" className="text-xs">
                Ver todos <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {clientes.filter(c => c.tipo === 'marca').map((cliente) => (
              <Link key={cliente.id} href={`/clientes/${cliente.id}`}>
                <div className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{cliente.nombre}</span>
                    {cliente.stockPropio && (
                      <Badge variant="outline" className="text-[10px]">Stock propio</Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">En calle</p>
                      <p className="font-semibold">{cliente.bidonesEnCalle || cliente.bidonesActivos} bidones</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Pendiente</p>
                      <p className="font-semibold">{formatCurrency(cliente.saldoPendiente)}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  icon: React.ElementType
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'destructive'
}

function StatCard({ title, value, icon: Icon, variant = 'default' }: StatCardProps) {
  const variantStyles = {
    default: 'bg-card',
    primary: 'bg-primary/5 border-primary/20',
    accent: 'bg-accent/5 border-accent/20',
    success: 'bg-success/5 border-success/20',
    warning: 'bg-warning/5 border-warning/20',
    destructive: 'bg-destructive/5 border-destructive/20'
  }
  
  const iconStyles = {
    default: 'text-muted-foreground',
    primary: 'text-primary',
    accent: 'text-accent',
    success: 'text-success',
    warning: 'text-warning',
    destructive: 'text-destructive'
  }
  
  return (
    <Card className={variantStyles[variant]}>
      <CardContent className="p-3 md:p-4">
        <div className="flex items-center gap-2 mb-1">
          <Icon className={`h-4 w-4 ${iconStyles[variant]}`} />
          <span className="text-[11px] text-muted-foreground font-medium truncate">{title}</span>
        </div>
        <p className="text-lg md:text-xl font-bold text-foreground">{value}</p>
      </CardContent>
    </Card>
  )
}
