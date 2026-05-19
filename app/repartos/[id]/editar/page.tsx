import { notFound } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { DeliveryEditForm } from "@/components/delivery-edit-form"
import { getDelivery, listOwnClients } from "@/lib/actions/deliveries"

export default async function EditarRepartoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const [{ id }, query] = await Promise.all([params, searchParams])
  const [delivery, clients] = await Promise.all([getDelivery(id), listOwnClients()])

  if (!delivery) notFound()

  return (
    <AppLayout>
      <DeliveryEditForm delivery={delivery} clients={clients.filter((client) => client.is_active !== false || client.id === delivery.client_id)} error={query.error} />
    </AppLayout>
  )
}
