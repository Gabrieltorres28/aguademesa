import { notFound } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { BrandForm } from "@/components/brands/brand-form"
import { getBrand } from "@/lib/actions/brands"

export default async function EditarMarcaPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string; created?: string; updated?: string }>
}) {
  const [{ id }, query] = await Promise.all([params, searchParams])
  const brand = await getBrand(id)

  if (!brand) notFound()

  return (
    <AppLayout>
      <BrandForm brand={brand} error={query.error} created={query.created} updated={query.updated} />
    </AppLayout>
  )
}
