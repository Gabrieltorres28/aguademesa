export type CsvColumn<T> = {
  header: string
  value: (row: T) => string | number | null | undefined
}

function sanitizeCsvValue(value: string | number | null | undefined) {
  const raw = value === null || value === undefined ? "" : String(value)
  const escaped = raw.replace(/"/g, '""')
  if (/[";\n\r]/.test(escaped)) return `"${escaped}"`
  return escaped
}

export function buildCsvContent<T>({ columns, rows }: { columns: CsvColumn<T>[]; rows: T[] }) {
  const header = columns.map((column) => sanitizeCsvValue(column.header)).join(";")
  const body = rows.map((row) => columns.map((column) => sanitizeCsvValue(column.value(row))).join(";")).join("\r\n")
  return `\uFEFF${header}\r\n${body}`
}

export function buildCsvDataUrl<T>({ columns, rows }: { columns: CsvColumn<T>[]; rows: T[] }) {
  return `data:text/csv;charset=utf-8,${encodeURIComponent(buildCsvContent({ columns, rows }))}`
}
