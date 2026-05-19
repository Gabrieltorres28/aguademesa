import Link from "next/link"
import { ArrowLeft, Edit, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DeleteSubmitButton } from "@/components/delete-submit-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/data"
import { deactivateBrandAction } from "@/lib/actions/brands"
import type { Brand, Filling } from "@/lib/types"

export function BrandDetail({ brand, fillings }: { brand: Brand; fillings: Filling[] }) {
  const brandFillings = fillings.filter((filling) => filling.brand_id === brand.id)
  const filledQty = brandFillings.reduce((acc, filling) => acc + Number(filling.filled_qty || 0), 0)
  const pending = brandFillings.reduce(
    (acc, filling) => acc + Math.max(Number(filling.total_amount || 0) - Number(filling.paid_amount || 0), 0),
    0
  )
  const paidTotal = brandFillings.reduce((acc, filling) => acc + Number(filling.paid_amount || 0), 0)

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/marcas">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="min-w-0">
            <h1 className="break-words text-2xl font-bold text-foreground">{brand.name}</h1>
            <p className="text-sm text-muted-foreground">Marca / revendedor de llenado</p>
          </div>
        </div>
        <Link href={`/marcas/${brand.id}/editar`}>
          <Button variant="outline" size="sm" className="gap-2">
            <Edit className="h-4 w-4" />
            Editar
          </Button>
        </Link>
      </div>
      {brand.is_active && (
        <form action={deactivateBrandAction}>
          <input type="hidden" name="id" value={brand.id} />
          <DeleteSubmitButton
            label="Desactivar marca"
            title="Desactivar marca"
            description="La marca no aparecerá para nuevos llenados, pero se conserva su historial."
            confirmLabel="Desactivar"
          />
        </form>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Metric label="Bidones llenados" value={filledQty.toString()} />
        <Metric label="Saldo pendiente" value={formatCurrency(pending)} />
        <Metric label="Llenados" value={brandFillings.length.toString()} />
        <Metric label="Pagos registrados" value={formatCurrency(paidTotal)} />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Datos de la marca</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm min-[520px]:grid-cols-2">
          <Info label="Teléfono" value={brand.phone || "Sin teléfono"} />
          <Info label="Estado" value={brand.is_active ? "Activa" : "Inactiva"} />
          <Info label="Notas" value={brand.notes || "Sin notas"} />
        </CardContent>
      </Card>

      <Link href={`/llenados/nuevo?brand=${brand.id}`}>
        <Button className="h-12 w-full gap-2">
          <Plus className="h-4 w-4" />
          Registrar llenado para esta marca
        </Button>
      </Link>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Historial de llenados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {brandFillings.map((filling) => (
            <Link key={filling.id} href={`/llenados/${filling.id}`}>
              <div className="rounded-lg border p-3 transition-colors hover:bg-muted/50">
                <div className="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
                  <div className="min-w-0">
                    <p className="font-medium">{filling.filling_date}</p>
                    <p className="text-xs text-muted-foreground">
                      {filling.received_qty} recibidos · {filling.filled_qty} llenados · {filling.withdrawn_qty} retirados
                    </p>
                  </div>
                  <div className="text-left min-[420px]:text-right">
                    <p className="font-semibold">{formatCurrency(Number(filling.total_amount || 0))}</p>
                    <Badge variant={filling.payment_status === "PAGADO" ? "default" : filling.payment_status === "PARCIAL" ? "secondary" : "outline"} className="text-[10px]">
                      {filling.payment_status === "PAGADO" ? "Pagado" : filling.payment_status === "PARCIAL" ? "Parcial" : "Pendiente"}
                    </Badge>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {brandFillings.length === 0 && (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              Esta marca todavía no tiene llenados cargados.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-3">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="safe-number text-xl font-bold">{value}</p>
      </CardContent>
    </Card>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="break-words font-medium">{value}</p>
    </div>
  )
}
