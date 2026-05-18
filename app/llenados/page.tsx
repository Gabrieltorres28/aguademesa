import { AppLayout } from "@/components/app-layout"
import { RepartosList } from "@/components/repartos-list"
import { listFillings } from "@/lib/actions/fillings"
import { listBrands } from "@/lib/actions/brands"

export default async function LlenadosPage() {
  const [fillings, brands] = await Promise.all([listFillings(), listBrands()])
  return (
    <AppLayout>
      <RepartosList fillings={fillings} brands={brands.filter((brand) => brand.is_active)} />
    </AppLayout>
  )
}
