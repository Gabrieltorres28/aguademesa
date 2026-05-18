import { AppLayout } from "@/components/app-layout"
import { RepartoDetail } from "@/components/reparto-detail"
import { getFilling } from "@/lib/actions/fillings"

interface LlenadoPageProps {
  params: Promise<{ id: string }>
}

export default async function LlenadoPage({ params }: LlenadoPageProps) {
  const { id } = await params
  const filling = await getFilling(id)
  return (
    <AppLayout>
      <RepartoDetail repartoId={id} filling={filling} />
    </AppLayout>
  )
}
