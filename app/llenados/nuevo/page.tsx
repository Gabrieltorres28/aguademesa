import { AppLayout } from "@/components/app-layout"
import { NuevoRepartoForm } from "@/components/nuevo-reparto-form"
import { listBrands } from "@/lib/actions/brands"

export default async function NuevoLlenadoPage() {
  const brands = (await listBrands()).filter((brand) => brand.is_active)
  return (
    <AppLayout>
      <NuevoRepartoForm brands={brands} />
    </AppLayout>
  )
}
