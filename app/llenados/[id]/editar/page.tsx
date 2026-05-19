import { notFound } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { FillingEditForm } from "@/components/filling-edit-form"
import { listBrands } from "@/lib/actions/brands"
import { getFilling } from "@/lib/actions/fillings"

export default async function EditarLlenadoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const [{ id }, query] = await Promise.all([params, searchParams])
  const [filling, brands] = await Promise.all([getFilling(id), listBrands()])

  if (!filling) notFound()

  return (
    <AppLayout>
      <FillingEditForm filling={filling} brands={brands} error={query.error} />
    </AppLayout>
  )
}
