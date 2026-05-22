import { AppLayout } from "@/components/app-layout"
import { TodayRoute } from "@/components/route/today-route"
import { listOwnClients } from "@/lib/actions/deliveries"
import { listOrdersForDate } from "@/lib/actions/orders"
import { todayIso } from "@/lib/client/format"

export const dynamic = "force-dynamic"

export default async function RecorridoPage({ searchParams }: { searchParams: Promise<{ created?: string; updated?: string; error?: string }> }) {
  const date = todayIso()
  const [clients, orders, query] = await Promise.all([listOwnClients(), listOrdersForDate(date), searchParams])
  const status = query.created ? "Pedido agregado al recorrido." : query.updated ? "Pedido actualizado." : undefined
  const rawError = query.error ? decodeURIComponent(query.error) : undefined
  const error = rawError === "pedido"
    ? "Seleccioná cliente y fecha para crear el pedido."
    : rawError === "cantidad"
      ? "La cantidad debe ser mayor a cero."
      : rawError === "estado"
        ? "No se pudo cambiar el estado del pedido."
        : rawError

  return <AppLayout><TodayRoute clients={clients} orders={orders} date={date} status={status} error={error} /></AppLayout>
}
