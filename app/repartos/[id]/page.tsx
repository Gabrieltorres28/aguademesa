import { AppLayout } from "@/components/app-layout"
import { DeliveryDetail } from "@/components/delivery-detail"
import { getDelivery } from "@/lib/actions/deliveries"

interface RepartoPageProps {
  params: Promise<{ id: string }>
}

export default async function RepartoPage({ params }: RepartoPageProps) {
  const { id } = await params
  const delivery = await getDelivery(id)

  return (
    <AppLayout>
      <DeliveryDetail delivery={delivery} />
    </AppLayout>
  )
}
