import { AppLayout } from "@/components/app-layout"
import { ClientForm } from "@/components/clients/client-form"

export default async function NuevoClientePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const query = await searchParams

  return (
    <AppLayout>
      <ClientForm error={query.error} />
    </AppLayout>
  )
}
