import { notFound } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { ClientDetail } from "@/components/clients/client-detail"
import { getOwnClient, listDeliveries } from "@/lib/actions/deliveries"

interface ClientePageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ created?: string; updated?: string }>
}

export default async function ClientePage({ params, searchParams }: ClientePageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams])
  const [client, deliveries] = await Promise.all([getOwnClient(id), listDeliveries()])

  if (!client) notFound()

  return (
    <AppLayout>
      <ClientDetail client={client} deliveries={deliveries} created={query.created} updated={query.updated} />
    </AppLayout>
  )
}
