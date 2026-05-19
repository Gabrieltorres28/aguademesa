import { AppLayout } from "@/components/app-layout"
import { CajaModule } from "@/components/caja-module"
import { listCashMovements } from "@/lib/actions/cash"

export const dynamic = "force-dynamic"

export default async function CajaPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; deleted?: string; updated?: string; error?: string }>
}) {
  const [movements, query] = await Promise.all([listCashMovements(), searchParams])
  const status = query.deleted ? "Movimiento eliminado correctamente." : query.updated ? "Movimiento actualizado correctamente." : query.created ? "Movimiento creado correctamente." : undefined
  return (
    <AppLayout>
      <CajaModule movements={movements} status={status} error={query.error ? decodeURIComponent(query.error) : undefined} />
    </AppLayout>
  )
}
