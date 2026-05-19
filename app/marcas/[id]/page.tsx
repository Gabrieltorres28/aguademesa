import { notFound } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { BrandDetail } from "@/components/brands/brand-detail"
import { getBrand } from "@/lib/actions/brands"
import { listFillings } from "@/lib/actions/fillings"

export default async function MarcaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [brand, fillings] = await Promise.all([getBrand(id), listFillings()])

  if (!brand) notFound()

  return (
    <AppLayout>
      <BrandDetail brand={brand} fillings={fillings} />
    </AppLayout>
  )
}
