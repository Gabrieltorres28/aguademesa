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
      <div>
        <h1 className="text-2xl font-bold text-foreground">Inicio</h1>
        <p className="text-sm capitalize text-muted-foreground">{today}</p>
      </div>

      <DashboardSection title="Reparto propio">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <ActionCard href="/clientes/nuevo" label="Nuevo cliente" icon={Users} />
          <ActionCard href="/repartos/nuevo" label="Nuevo reparto" icon={Truck} />
          <StatCard title="Clientes con deuda" value={dashboard.clientesConDeuda.toString()} icon={Receipt} variant="warning" />
          <StatCard title="Bidones en calle" value={dashboard.bidonesEnCalle.toString()} icon={Package} variant="primary" />
        </div>
        <RecentDeliveries dashboard={dashboard} />
      </DashboardSection>

      <DashboardSection title="Llenado para marcas">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <ActionCard href="/marcas/nueva" label="Nueva marca" icon={Factory} />
          <ActionCard href="/llenados/nuevo" label="Nuevo llenado" icon={Droplets} />
          <StatCard title="Marcas con saldo" value={dashboard.marcasConSaldo.toString()} icon={Receipt} variant="warning" />
          <StatCard title="Llenados hoy" value={dashboard.bidonesLlenadosHoy.toString()} icon={Droplets} variant="accent" />
        </div>
        <RecentFillings dashboard={dashboard} />
      </DashboardSection>

      <DashboardSection title="Control general">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <StatCard title="Ingresos del día" value={formatCurrency(dashboard.ingresosHoy)} icon={DollarSign} variant="success" />
          <StatCard title="Gastos del día" value={formatCurrency(dashboard.gastosHoy)} icon={Wallet} variant="destructive" />
          <StatCard title="Balance" value={formatCurrency(dashboard.balanceHoy)} icon={BarChart3} variant={dashboard.balanceHoy >= 0 ? "success" : "destructive"} />
          <StatCard title="Stock crítico" value={dashboard.stockCritico.toString()} icon={Package} variant={dashboard.stockCritico > 0 ? "destructive" : "success"} />
          <ActionCard href="/reportes" label="Reportes" icon={BarChart3} />
        </div>
      </DashboardSection>
    </div>
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
        <CardContent className="flex min-h-28 flex-col items-center justify-center gap-2 p-4 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <span className="text-sm font-medium">{label}</span>
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
