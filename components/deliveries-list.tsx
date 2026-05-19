"use client"

import Link from "next/link"
import { Edit, Plus, Truck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/data"
import { deleteDeliveryAction } from "@/lib/actions/deliveries"
import { DeleteSubmitButton } from "@/components/delete-submit-button"
import type { Delivery } from "@/lib/types"

export function DeliveriesList({ deliveries = [], status, error }: { deliveries?: Delivery[]; status?: string; error?: string }) {
  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Repartos propios</h1>
          <p className="text-sm text-muted-foreground">Clientes propios, bidones en calle y cobros</p>
        </div>
        <Link href="/repartos/nuevo">
          <Button size="sm" className="gap-2"><Plus className="h-4 w-4" />Nuevo</Button>
        </Link>
      </div>

      {status && <StatusMessage text={status} />}
      {error && <ErrorMessage text={error} />}

      <div className="space-y-3">
        {deliveries.map((delivery) => (
          <Card key={delivery.id}>
            <CardContent className="p-4">
              <div className="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold break-words">{delivery.own_clients?.name || "Cliente"}</p>
                    <p className="text-xs text-muted-foreground">
                      {delivery.delivery_date} · {delivery.delivered_qty} entregados · {delivery.returned_empty_qty} vacíos
                    </p>
                  </div>
                </div>
                <div className="text-left min-[420px]:text-right">
                  <p className="safe-number font-bold">{formatCurrency(Number(delivery.total_amount))}</p>
                  <Badge variant={delivery.payment_status === "PAGADO" ? "default" : delivery.payment_status === "PARCIAL" ? "secondary" : "outline"} className="text-[10px]">
                    {delivery.payment_status === "PAGADO" ? "Pagado" : delivery.payment_status === "PARCIAL" ? "Parcial" : "Pendiente"}
                  </Badge>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 border-t pt-3">
                <Link href={`/repartos/${delivery.id}`}>
                  <Button variant="outline" size="sm">Ver</Button>
                </Link>
                <Link href={`/repartos/${delivery.id}/editar`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit className="h-4 w-4" />
                    Editar
                  </Button>
                </Link>
                <form action={deleteDeliveryAction}>
                  <input type="hidden" name="id" value={delivery.id} />
                  <DeleteSubmitButton />
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
        {deliveries.length === 0 && (
          <Card><CardContent className="p-6 text-center text-sm text-muted-foreground">No hay repartos propios cargados.</CardContent></Card>
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
