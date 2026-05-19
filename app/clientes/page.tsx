import { AppLayout } from "@/components/app-layout"
import { ClientsList } from "@/components/clients/clients-list"
import { listOwnClients } from "@/lib/actions/deliveries"

export const dynamic = "force-dynamic"

function clientStatus(query: { deactivated?: string; reactivated?: string; deleted?: string }) {
  if (query.deactivated) return "Cliente desactivado correctamente."
  if (query.reactivated) return "Cliente reactivado correctamente."
  if (query.deleted) return "Cliente eliminado definitivamente."
  return undefined
}

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ deactivated?: string; reactivated?: string; deleted?: string; error?: string }>
}) {
  const [clients, query] = await Promise.all([listOwnClients(), searchParams])

  return (
    <AppLayout>
      <ClientsList clients={clients} status={clientStatus(query)} error={query.error ? decodeURIComponent(query.error) : undefined} />
    </AppLayout>
  )
}
