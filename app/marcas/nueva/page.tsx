import { AppLayout } from "@/components/app-layout"
import { BrandForm } from "@/components/brands/brand-form"

export default async function NuevaMarcaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <AppLayout>
      <BrandForm error={error} />
    </AppLayout>
  )
}
