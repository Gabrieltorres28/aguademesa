import { AppLayout } from "@/components/app-layout"
import { RepartoDetail } from "@/components/reparto-detail"

interface RepartoPageProps {
  params: Promise<{ id: string }>
}

export default async function RepartoPage({ params }: RepartoPageProps) {
  const { id } = await params
  
  return (
    <AppLayout>
      <RepartoDetail repartoId={id} />
    </AppLayout>
  )
}
