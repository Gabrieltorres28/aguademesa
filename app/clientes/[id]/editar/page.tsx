import { notFound } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { ClientForm } from "@/components/clients/client-form"
import { getOwnClient } from "@/lib/actions/deliveries"

export default async function EditarClientePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const [{ id }, query] = await Promise.all([params, searchParams])
  const client = await getOwnClient(id)

  if (!client) notFound()

  return (
    <AppLayout>
      <ClientForm client={client} error={query.error} />
    </AppLayout>
  )
}
