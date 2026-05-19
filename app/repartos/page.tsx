import { AppLayout } from "@/components/app-layout"
import { DeliveriesList } from "@/components/deliveries-list"
import { listDeliveries } from "@/lib/actions/deliveries"

export const dynamic = "force-dynamic"

export default async function RepartosPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string; error?: string }>
}) {
  const [deliveries, query] = await Promise.all([listDeliveries(), searchParams])
  return (
    <AppLayout>
      <DeliveriesList
        deliveries={deliveries}
        status={query.deleted ? "Reparto eliminado correctamente." : undefined}
        error={query.error ? decodeURIComponent(query.error) : undefined}
      />
    </AppLayout>
  )
}
