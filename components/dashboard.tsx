"use client"

import {
  ArrowRight,
  BarChart3,
  DollarSign,
  Droplets,
  Factory,
  Package,
  Plus,
  Receipt,
  Truck,
  Users,
  Wallet,
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/data"
import type { DashboardData } from "@/lib/actions/dashboard"

export function Dashboard({ dashboard }: { dashboard: DashboardData }) {
  const today = new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date())

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="space-y-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inicio</h1>
          <p className="text-sm capitalize text-muted-foreground">{today}</p>
        </div>
        <PeriodSelector dashboard={dashboard} />
      </div>

      <DashboardSection title="Resumen general">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard title="Ingresos" value={formatCurrency(dashboard.ingresosPeriodo)} icon={DollarSign} variant="success" />
          <StatCard title="Gastos" value={formatCurrency(dashboard.gastosPeriodo)} icon={Wallet} variant="destructive" />
          <StatCard title="Balance" value={formatCurrency(dashboard.balancePeriodo)} icon={BarChart3} variant={dashboard.balancePeriodo >= 0 ? "success" : "destructive"} />
          <StatCard title="Pendiente" value={formatCurrency(dashboard.pendienteCobroPeriodo)} icon={Receipt} variant="warning" />
        </div>
      </DashboardSection>

      <DashboardSection title="Reparto propio">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard title="Repartos" value={dashboard.repartosRegistrados.toString()} icon={Truck} variant="primary" />
          <StatCard title="Entregados" value={dashboard.bidonesEntregados.toString()} icon={Package} variant="accent" />
          <StatCard title="Bidones en calle" value={dashboard.bidonesEnCalle.toString()} icon={Package} variant="primary" />
          <StatCard title="Clientes con deuda" value={dashboard.clientesConDeuda.toString()} icon={Receipt} variant="warning" />
        </div>
        <RecentDeliveries dashboard={dashboard} />
      </DashboardSection>

      <DashboardSection title="Llenado para marcas">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard title="Llenados" value={dashboard.llenadosRegistrados.toString()} icon={Droplets} variant="accent" />
          <StatCard title="Bidones llenados" value={dashboard.bidonesLlenadosPeriodo.toString()} icon={Droplets} variant="primary" />
          <StatCard title="Marcas con saldo" value={dashboard.marcasConSaldo.toString()} icon={Receipt} variant="warning" />
          <StatCard title="Pendiente llenados" value={formatCurrency(dashboard.pendientesMarcas)} icon={Receipt} variant="warning" />
        </div>
        <RecentFillings dashboard={dashboard} />
      </DashboardSection>

      <DashboardSection title="Acciones rápidas">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <ActionCard href="/clientes/nuevo" label="Nuevo cliente" icon={Users} />
          <ActionCard href="/repartos/nuevo" label="Nuevo reparto" icon={Truck} />
          <ActionCard href="/marcas/nueva" label="Nueva marca" icon={Factory} />
          <ActionCard href="/llenados/nuevo" label="Nuevo llenado" icon={Droplets} />
        </div>
      </DashboardSection>

      <DashboardSection title="Actividad reciente">
        <RecentMovements dashboard={dashboard} />
      </DashboardSection>
    </div>
  )
}

function PeriodSelector({ dashboard }: { dashboard: DashboardData }) {
  const periodLinks = [
    { href: "/?period=today", label: "Hoy", active: dashboard.period === "today" },
    { href: "/?period=week", label: "Semana", active: dashboard.period === "week" },
    { href: "/?period=month", label: "Mes", active: dashboard.period === "month" },
  ]

  return (
    <Card>
      <CardContent className="space-y-3 p-3">
        <div className="flex flex-wrap gap-2">
          {periodLinks.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button variant={item.active ? "default" : "outline"} size="sm">{item.label}</Button>
            </Link>
          ))}
          <Link href="/">
            <Button variant="ghost" size="sm">Limpiar</Button>
          </Link>
        </div>
        <form action="/" className="grid gap-2 min-[520px]:grid-cols-[1fr_1fr_auto]">
          <input type="hidden" name="period" value="custom" />
          <input name="from" type="date" defaultValue={dashboard.rangeFrom} className="h-9 rounded-md border border-input bg-background px-3 text-sm" />
          <input name="to" type="date" defaultValue={dashboard.rangeTo} className="h-9 rounded-md border border-input bg-background px-3 text-sm" />
          <Button type="submit" variant={dashboard.period === "custom" ? "default" : "outline"} size="sm">Aplicar</Button>
        </form>
        <p className="text-xs text-muted-foreground">Período activo: {dashboard.periodLabel}</p>
      </CardContent>
    </Card>
  )
}

function DashboardSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  )
}

function ActionCard({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) {
  return (
    <Link href={href}>
      <Card className="h-full transition-colors hover:bg-muted/50">
        <CardContent className="flex min-h-20 flex-col items-center justify-center gap-2 p-3 text-center">
          <div className="flex size-9 items-center justify-center rounded-full bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xs font-medium min-[380px]:text-sm">{label}</span>
        </CardContent>
      </Card>
    </Link>
  )
}

function RecentDeliveries({ dashboard }: { dashboard: DashboardData }) {
  return (
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
        {dashboard.ultimosRepartos.map((delivery) => (
          <Link key={delivery.id} href={`/repartos/${delivery.id}`}>
            <div className="rounded-lg bg-muted/30 p-3 transition-colors hover:bg-muted/60">
              <div className="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
                <div className="min-w-0">
                  <p className="break-words text-sm font-medium">{delivery.own_clients?.name || "Cliente propio"}</p>
                  <p className="text-xs text-muted-foreground">
                    {delivery.delivery_date} · {delivery.delivered_qty} entregados · {delivery.returned_empty_qty} vacíos
                  </p>
                </div>
                <PaymentBadge status={delivery.payment_status} />
              </div>
            </div>
          </Link>
        ))}
        {dashboard.ultimosRepartos.length === 0 && <EmptyLine text="No hay repartos propios cargados." />}
      </CardContent>
    </Card>
  )
}

function RecentFillings({ dashboard }: { dashboard: DashboardData }) {
  return (
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
        {dashboard.ultimosLlenados.map((filling) => (
          <Link key={filling.id} href={`/llenados/${filling.id}`}>
            <div className="rounded-lg bg-muted/30 p-3 transition-colors hover:bg-muted/60">
              <div className="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
                <div className="min-w-0">
                  <p className="break-words text-sm font-medium">{filling.brands?.name || "Marca / revendedor"}</p>
                  <p className="text-xs text-muted-foreground">
                    {filling.filling_date} · {filling.filled_qty} bidones llenados
                  </p>
                </div>
                <PaymentBadge status={filling.payment_status} />
              </div>
            </div>
          </Link>
        ))}
        {dashboard.ultimosLlenados.length === 0 && <EmptyLine text="No hay llenados para marcas cargados." />}
      </CardContent>
    </Card>
  )
}

function RecentMovements({ dashboard }: { dashboard: DashboardData }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Últimos movimientos de caja</CardTitle>
          <Link href="/caja">
            <Button variant="ghost" size="sm" className="text-xs">
              Ver todos <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {dashboard.ultimosMovimientos.map((movement) => (
          <Link key={movement.id} href="/caja">
            <div className="rounded-lg bg-muted/30 p-3 transition-colors hover:bg-muted/60">
              <div className="flex flex-col gap-2 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
                <div className="min-w-0">
                  <p className="break-words text-sm font-medium">{movement.description}</p>
                  <p className="text-xs text-muted-foreground">{movement.movement_date} · {movement.category}</p>
                </div>
                <p className={`safe-number text-sm font-bold ${movement.type === "INGRESO" ? "text-success" : "text-destructive"}`}>
                  {movement.type === "INGRESO" ? "+" : "-"}{formatCurrency(Number(movement.amount || 0))}
                </p>
              </div>
            </div>
          </Link>
        ))}
        {dashboard.ultimosMovimientos.length === 0 && <EmptyLine text="No hay movimientos de caja cargados." />}
      </CardContent>
    </Card>
  )
}

function PaymentBadge({ status }: { status: string }) {
  return (
    <Badge variant={status === "PAGADO" ? "default" : status === "PARCIAL" ? "secondary" : "outline"} className="w-fit text-[10px]">
      {status === "PAGADO" ? "Pagado" : status === "PARCIAL" ? "Parcial" : "Pendiente"}
    </Badge>
  )
}

function EmptyLine({ text }: { text: string }) {
  return <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">{text}</div>
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
        <p className="safe-number text-lg font-bold text-foreground md:text-xl">{value}</p>
      </CardContent>
    </Card>
  )
}
