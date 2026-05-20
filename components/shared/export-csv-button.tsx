"use client"

import { useMemo, useState, type MouseEvent } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { buildCsvDataUrl, type CsvColumn } from "@/lib/client/csv"

export function ExportCsvButton<T>({ filename, columns, rows }: { filename: string; columns: CsvColumn<T>[]; rows: T[] }) {
  const [message, setMessage] = useState("")
  const csvHref = useMemo(() => buildCsvDataUrl({ columns, rows }), [columns, rows])

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (rows.length === 0) {
      event.preventDefault()
      setMessage("No hay datos para exportar.")
      return
    }
    setMessage("")
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <Button asChild type="button" variant="outline" size="sm" className="gap-2">
        <a href={csvHref} download={filename} onClick={handleClick}>
          <Download className="h-4 w-4" />
          Exportar CSV
        </a>
      </Button>
      {message && <p className="text-xs text-warning">{message}</p>}
    </div>
  )
}
