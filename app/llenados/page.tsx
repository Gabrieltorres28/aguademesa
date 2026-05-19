import { AppLayout } from "@/components/app-layout"
import { RepartosList } from "@/components/repartos-list"
import { listFillings } from "@/lib/actions/fillings"
import { listBrands } from "@/lib/actions/brands"

export const dynamic = "force-dynamic"

export default async function LlenadosPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string; error?: string }>
}) {
  const [fillings, brands, query] = await Promise.all([listFillings(), listBrands(), searchParams])
  return (
    <AppLayout>
      <RepartosList
        fillings={fillings}
        brands={brands.filter((brand) => brand.is_active)}
        status={query.deleted ? "Llenado eliminado correctamente." : undefined}
        error={query.error ? decodeURIComponent(query.error) : undefined}
      />
    </AppLayout>
  )
}
