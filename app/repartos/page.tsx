import { AppLayout } from "@/components/app-layout"
import { DeliveriesList } from "@/components/deliveries-list"
import { listDeliveries } from "@/lib/actions/deliveries"

export default async function RepartosPage() {
  const deliveries = await listDeliveries()
  return (
    <AppLayout>
      <DeliveriesList deliveries={deliveries} />
    </AppLayout>
  )
}
