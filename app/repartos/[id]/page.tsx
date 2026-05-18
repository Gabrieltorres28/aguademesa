import { redirect } from "next/navigation"

interface RepartoPageProps {
  params: Promise<{ id: string }>
}

export default async function RepartoPage({ params }: RepartoPageProps) {
  const { id } = await params
  redirect(`/llenados/${id}`)
}
