import { AppLayout } from "@/components/app-layout"
import { NuevoRepartoForm } from "@/components/nuevo-reparto-form"
import { listBrands } from "@/lib/actions/brands"

export default async function NuevoLlenadoPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; brand?: string }>
}) {
  const [brands, query] = await Promise.all([listBrands(), searchParams])
  return (
    <AppLayout>
      <NuevoRepartoForm brands={brands.filter((brand) => brand.is_active)} error={query.error} selectedBrandId={query.brand} />
    </AppLayout>
  )
}
