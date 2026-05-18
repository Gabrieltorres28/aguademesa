import { AppLayout } from "@/components/app-layout"
import { CajaModule } from "@/components/caja-module"
import { listCashMovements } from "@/lib/actions/cash"

export default async function CajaPage() {
  const movements = await listCashMovements()
  return (
    <AppLayout>
      <CajaModule movements={movements} />
    </AppLayout>
  )
}
