import { AppLayout } from "@/components/app-layout"
import { ClientsList } from "@/components/clients/clients-list"
import { listOwnClients } from "@/lib/actions/deliveries"

export default async function ClientesPage() {
  const clients = await listOwnClients()

  return (
    <AppLayout>
      <ClientsList clients={clients} />
    </AppLayout>
  )
}
