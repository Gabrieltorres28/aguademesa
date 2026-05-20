"use client"

import Link from "next/link"
import { ArrowLeft, BarChart3, DollarSign, Droplets, Package, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/data"
import { ExportCsvButton } from "@/components/shared/export-csv-button"
import { datedFilename } from "@/lib/client/format"
import type { CsvColumn } from "@/lib/client/csv"
import type { Brand, CashMovement, Delivery, Filling, OwnClient, StockItem } from "@/lib/types"

type ReportRow = { seccion: string; indicador: string; valor: string }

const reportColumns: CsvColumn<ReportRow>[] = [
  { header: "Sección", value: (row) => row.seccion },
  { header: "Indicador", value: (row) => row.indicador },
  { header: "Valor", value: (row) => row.valor },
]

export function ReportesRealModule({
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
  const movementsToday = cashMovements.filter((item) => item.movement_date === today)
  const movementsMonth = cashMovements.filter((item) => item.movement_date >= monthStart)

  const deliveredQty = deliveries.reduce((acc, item) => acc + Number(item.delivered_qty || 0), 0)
  const streetBottles = ownClients.reduce((acc, item) => acc + Number(item.bottles_in_street || 0), 0)
  const clientDebt = ownClients.reduce((acc, item) => acc + Number(item.balance || 0), 0)
  const filledQty = fillings.reduce((acc, item) => acc + Number(item.filled_qty || 0), 0)
  const brandDebt = fillings.reduce((acc, item) => acc + Math.max(Number(item.total_amount || 0) - Number(item.paid_amount || 0), 0), 0)
  const ingresosDia = movementsToday.filter((item) => item.type === "INGRESO").reduce((acc, item) => acc + Number(item.amount || 0), 0)
  const egresosDia = movementsToday.filter((item) => item.type === "EGRESO").reduce((acc, item) => acc + Number(item.amount || 0), 0)
  const ingresosMes = movementsMonth.filter((item) => item.type === "INGRESO").reduce((acc, item) => acc + Number(item.amount || 0), 0)
  const egresosMes = movementsMonth.filter((item) => item.type === "EGRESO").reduce((acc, item) => acc + Number(item.amount || 0), 0)
  const stockCritico = stockItems.filter((item) => Number(item.current_stock) <= Number(item.min_stock))
  const reportRows: ReportRow[] = [
    { seccion: "Reparto propio", indicador: "Repartos cargados", valor: deliveries.length.toString() },
    { seccion: "Reparto propio", indicador: "Bidones entregados", valor: deliveredQty.toString() },
    { seccion: "Reparto propio", indicador: "Bidones en calle", valor: streetBottles.toString() },
    { seccion: "Reparto propio", indicador: "Saldo de clientes", valor: formatCurrency(clientDebt) },
    { seccion: "Llenados", indicador: "Llenados cargados", valor: fillings.length.toString() },
    { seccion: "Llenados", indicador: "Bidones llenados", valor: filledQty.toString() },
    { seccion: "Llenados", indicador: "Saldo de marcas", valor: formatCurrency(brandDebt) },
    { seccion: "Caja", indicador: "Ingresos del día", valor: formatCurrency(ingresosDia) },
    { seccion: "Caja", indicador: "Gastos del día", valor: formatCurrency(egresosDia) },
    { seccion: "Caja", indicador: "Balance del mes", valor: formatCurrency(ingresosMes - egresosMes) },
    { seccion: "Stock", indicador: "Items cargados", valor: stockItems.length.toString() },
    { seccion: "Stock", indicador: "Stock crítico", valor: stockCritico.length.toString() },
  ]

  const fillingsByBrand = brands
    .map((brand) => {
      const brandFillings = fillings.filter((item) => item.brand_id === brand.id)
      return {
        id: brand.id,
        name: brand.name,
        qty: brandFillings.reduce((acc, item) => acc + Number(item.filled_qty || 0), 0),
        pending: brandFillings.reduce((acc, item) => acc + Math.max(Number(item.total_amount || 0) - Number(item.paid_amount || 0), 0), 0),
      }
    })
    .filter((item) => item.qty > 0 || item.pending > 0)
    .sort((a, b) => b.qty - a.qty)

  return (
    <div className="space-y-5 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <Link href="/mas">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reportes</h1>
          <p className="text-sm text-muted-foreground">Reparto propio, llenados, caja y stock.</p>
        </div>
      </div>

      <div className="flex justify-end">
        <ExportCsvButton filename={datedFilename("dos-hermanas-reporte-general")} columns={reportColumns} rows={reportRows} />
      </div>

      <ReportSection title="Reportes de reparto propio" icon={Truck}>
        <MetricGrid>
          <Metric label="Repartos cargados" value={deliveries.length.toString()} />
          <Metric label="Bidones entregados" value={deliveredQty.toString()} />
          <Metric label="Bidones en calle" value={streetBottles.toString()} />
          <Metric label="Saldo de clientes" value={formatCurrency(clientDebt)} />
        </MetricGrid>
        {deliveries.length === 0 && <EmptyState text="Todavía no hay repartos propios cargados." />}
      </ReportSection>

      <ReportSection title="Reportes de llenados por marca" icon={Droplets}>
        <MetricGrid>
          <Metric label="Llenados cargados" value={fillings.length.toString()} />
          <Metric label="Bidones llenados" value={filledQty.toString()} />
          <Metric label="Marcas con actividad" value={fillingsByBrand.length.toString()} />
          <Metric label="Saldo de marcas" value={formatCurrency(brandDebt)} />
        </MetricGrid>
        <div className="space-y-3">
          {fillingsByBrand.map((brand) => (
            <div key={brand.id} className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
              <span className="font-medium">{brand.name}</span>
              <div className="text-right">
                <p className="font-bold">{brand.qty} bidones</p>
                {brand.pending > 0 && <p className="text-xs text-warning">{formatCurrency(brand.pending)} pendiente</p>}
              </div>
            </div>
          ))}
          {fillingsByBrand.length === 0 && <EmptyState text="Todavía no hay llenados para marcas cargados." />}
        </div>
      </ReportSection>

      <ReportSection title="Reportes de caja" icon={DollarSign}>
        <MetricGrid>
          <Metric label="Ingresos del día" value={formatCurrency(ingresosDia)} />
          <Metric label="Gastos del día" value={formatCurrency(egresosDia)} />
          <Metric label="Ingresos del mes" value={formatCurrency(ingresosMes)} />
          <Metric label="Balance del mes" value={formatCurrency(ingresosMes - egresosMes)} />
        </MetricGrid>
        {cashMovements.length === 0 && <EmptyState text="Todavía no hay movimientos de caja cargados." />}
      </ReportSection>

      <ReportSection title="Reportes de stock" icon={Package}>
        <MetricGrid>
          <Metric label="Items cargados" value={stockItems.length.toString()} />
          <Metric label="Stock crítico" value={stockCritico.length.toString()} />
        </MetricGrid>
        <div className="space-y-3">
          {stockCritico.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg bg-destructive/5 p-3">
              <span className="font-medium">{item.name}</span>
              <span className="font-bold text-destructive">{item.current_stock} {item.unit}</span>
            </div>
          ))}
          {stockItems.length === 0 && <EmptyState text="Todavía no hay stock cargado." />}
          {stockItems.length > 0 && stockCritico.length === 0 && <EmptyState text="No hay items en estado crítico." />}
        </div>
      </ReportSection>
    </div>
  )
}

function ReportSection({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  )
}

function MetricGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{children}</div>
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="safe-number text-xl font-bold">{value}</p>
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return <div className="rounded-lg border border-dashed p-5 text-center text-sm text-muted-foreground">{text}</div>
}
