"use client"

import { 
  DollarSign, 
  Droplets, 
  TrendingUp, 
  AlertTriangle,
  Package,
  Receipt,
  Plus,
  Factory,
  BarChart3,
  ArrowRight,
  Clock
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/data"
import type { DashboardData } from "@/lib/actions/dashboard"

export function Dashboard({ dashboard }: { dashboard: DashboardData }) {
  const ultimosLlenados = dashboard.ultimosLlenados.slice(0, 3)
  const hasPending = dashboard.pendientesMarcas + dashboard.pendientesClientes > 0
  
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">18 de mayo de 2026</p>
      </div>
      
      {/* Alerta de cuentas por servicio */}
      {hasPending && (
        <Card className="border-warning/50 bg-warning/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-foreground">Llenados pendientes de cobro</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Hay saldos pendientes por llenados o repartos propios.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <StatCard 
          title="Llenados hoy"
          value={dashboard.bidonesLlenadosHoy.toString()}
          icon={Droplets}
          variant="accent"
        />
        <StatCard 
          title="Pendiente llenados"
          value={formatCurrency(dashboard.pendientesMarcas)}
          icon={Receipt}
          variant="warning"
        />
        <StatCard 
          title="Revendedores"
          value="--"
          icon={Factory}
          variant="primary"
        />
        <StatCard 
          title="Producción día"
          value={dashboard.bidonesLlenadosHoy.toString()}
          icon={BarChart3}
          variant="success"
        />
        <StatCard 
          title="Ingresos llenado"
          value={formatCurrency(dashboard.ingresosHoy)}
          icon={DollarSign}
          variant="primary"
        />
        <StatCard 
          title="Gastos mes"
          value={formatCurrency(dashboard.gastosMes)}
          icon={TrendingUp}
          variant="destructive"
        />
        <StatCard 
          title="Stock crítico"
          value={dashboard.stockCritico.toString()}
          icon={Package}
          variant={dashboard.stockCritico > 0 ? "destructive" : "success"}
        />
        <StatCard 
          title="Ctas. a cobrar"
          value={formatCurrency(dashboard.pendientesClientes)}
          icon={Receipt}
          variant="warning"
        />
      </div>
      
      {/* Accesos rápidos */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Link href="/llenados/nuevo">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
            <CardContent className="p-4 flex flex-col items-center justify-center gap-2 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <span className="font-medium text-sm">Nuevo llenado</span>
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
        <Link href="/repartos/nuevo">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
            <CardContent className="p-4 flex flex-col items-center justify-center gap-2 text-center">
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                <Factory className="h-6 w-6 text-success" />
              </div>
              <span className="font-medium text-sm">Nuevo reparto</span>
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
            <CardTitle className="text-base font-semibold">Últimos llenados</CardTitle>
            <Link href="/llenados">
              <Button variant="ghost" size="sm" className="text-xs">
                Ver todos <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {ultimosLlenados.map((llenado) => (
            <div 
              key={llenado.id} 
              className="flex flex-col gap-3 p-3 bg-muted/30 rounded-lg min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Droplets className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm break-words">{llenado.brands?.name || "Sin marca"}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{llenado.filling_date}</span>
                    <span>•</span>
                    <span>{llenado.filled_qty} llenados</span>
                  </div>
                </div>
              </div>
              <div className="text-left min-[420px]:text-right">
                <p className="font-semibold text-sm">{formatCurrency(Number(llenado.total_amount))}</p>
                <Badge 
                  variant={
                    llenado.payment_status === 'PAGADO' ? 'default' : 
                    llenado.payment_status === 'PARCIAL' ? 'secondary' : 'outline'
                  }
                  className="text-[10px] mt-1"
                >
                  {llenado.payment_status === 'PAGADO' ? 'Pagado' : 
                   llenado.payment_status === 'PARCIAL' ? 'Parcial' : 'Pendiente'}
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
            <CardTitle className="text-base font-semibold">Últimos movimientos</CardTitle>
            <Link href="/marcas">
              <Button variant="ghost" size="sm" className="text-xs">
                Ver todos <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {dashboard.ultimosMovimientos.map((movimiento) => (
              <Link key={movimiento.id} href="/caja">
                <div className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{movimiento.description}</span>
                    <Badge variant={movimiento.type === "INGRESO" ? "default" : "outline"} className="text-[10px]">{movimiento.type}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Categoría</p>
                      <p className="font-semibold">{movimiento.category}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Monto</p>
                      <p className="font-semibold">{formatCurrency(Number(movimiento.amount))}</p>
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
