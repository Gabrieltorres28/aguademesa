import { AppLayout } from "@/components/app-layout"
import { BrandsList } from "@/components/brands/brands-list"
import { listBrands } from "@/lib/actions/brands"
import { listFillings } from "@/lib/actions/fillings"

export const dynamic = "force-dynamic"

function brandStatus(query: { deactivated?: string; reactivated?: string; deleted?: string }) {
  if (query.deactivated) return "Marca desactivada correctamente."
  if (query.reactivated) return "Marca reactivada correctamente."
  if (query.deleted) return "Marca eliminada definitivamente."
  return undefined
}

export default async function MarcasPage({
  searchParams,
}: {
  searchParams: Promise<{ deactivated?: string; reactivated?: string; deleted?: string; error?: string }>
}) {
  const [brands, fillings, query] = await Promise.all([listBrands(), listFillings(), searchParams])

  return (
    <AppLayout>
      <BrandsList brands={brands} fillings={fillings} status={brandStatus(query)} error={query.error ? decodeURIComponent(query.error) : undefined} />
    </AppLayout>
  )
}
