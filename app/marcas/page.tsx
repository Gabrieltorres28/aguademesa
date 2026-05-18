import { AppLayout } from "@/components/app-layout"
import { BrandsList } from "@/components/brands/brands-list"
import { listBrands } from "@/lib/actions/brands"

export default async function MarcasPage() {
  const brands = await listBrands()

  return (
    <AppLayout>
      <BrandsList brands={brands} />
    </AppLayout>
  )
}
