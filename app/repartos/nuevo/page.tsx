import { AppLayout } from "@/components/app-layout"
import { NewDeliveryForm } from "@/components/new-delivery-form"
import { listOwnClients } from "@/lib/actions/deliveries"

export default async function NuevoRepartoPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; client?: string }>
}) {
  const [clients, query] = await Promise.all([listOwnClients(), searchParams])
  return (
    <AppLayout>
      <NewDeliveryForm clients={clients.filter((client) => client.is_active !== false)} error={query.error} selectedClientId={query.client} />
    </AppLayout>
  )
}
