import { AppLayout } from "@/components/app-layout"
import { NewDeliveryForm } from "@/components/new-delivery-form"
import { listOwnClients } from "@/lib/actions/deliveries"

export default async function NuevoRepartoPage() {
  const clients = await listOwnClients()
  return (
    <AppLayout>
      <NewDeliveryForm clients={clients} />
    </AppLayout>
  )
}
