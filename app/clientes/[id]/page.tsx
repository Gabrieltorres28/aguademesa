import { AppLayout } from "@/components/app-layout"
import { ClienteDetail } from "@/components/cliente-detail"

interface ClientePageProps {
  params: Promise<{ id: string }>
}

export default async function ClientePage({ params }: ClientePageProps) {
  const { id } = await params
  
  return (
    <AppLayout>
      <ClienteDetail clienteId={id} />
    </AppLayout>
  )
}
