import type { LeagueKey } from '@/types/domain'

function parseCSVText(text: string): string[][] {
  const rows: string[][] = []
  let current: string[] = []
  let field = ''
  let inQuotes = false
  let i = 0
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  while (i < normalized.length) {
    const char = normalized[i]

    if (inQuotes) {
      if (char === '"') {
        if (normalized[i + 1] === '"') {
          field += '"'
          i += 2
          continue
        }
        inQuotes = false
        i += 1
        continue
      }
      field += char
      i += 1
      continue
    }

    if (char === '"') {
      inQuotes = true
      i += 1
      continue
    }

    if (char === ',') {
      current.push(field)
      field = ''
      i += 1
      continue
    }

    if (char === '\n') {
      current.push(field)
      rows.push(current)
      current = []
      field = ''
      i += 1
      continue
    }

    field += char
    i += 1
  }

  if (field !== '' || current.length > 0) {
    current.push(field)
    rows.push(current)
  }

  return rows.filter((row) => row.some((cell) => cell !== ''))
}

function normalizeHeader(header: string): string {
  return header.trim().replace(/^\uFEFF/, '').replace(/\s+/g, ' ').replace(/\r|\n/g, '').trim()
}

export async function parseCSVFile(file: File, leagueKey: LeagueKey): Promise<Record<string, any>[]> {
  const text = await file.text()
  const rows = parseCSVText(text)
  if (rows.length < 2) return []

  const headers = rows[0].map(normalizeHeader)
  const data: Record<string, any>[] = []

  for (let i = 1; i < rows.length; i++) {
    const rowValues = rows[i]
    const row: Record<string, any> = {}
    for (let j = 0; j < headers.length; j++) {
      const header = headers[j] || `column_${j}`
      const value = rowValues[j] ?? ''
      row[header] = value === '' ? null : value
    }
    data.push(row)
  }

  return data
}

export async function storeCSVData(leagueKey: LeagueKey, rows: Record<string, any>[]) {
  const stored = (() => {
    try {
      return JSON.parse(localStorage.getItem('windigo:sheets') || '{}')
    } catch {
      return {}
    }
  })()

  stored[leagueKey] = rows
  localStorage.setItem('windigo:sheets', JSON.stringify(stored))
}

export function getStoredCSVData(leagueKey: LeagueKey): Record<string, any>[] | null {
  try {
    const stored = JSON.parse(localStorage.getItem('windigo:sheets') || '{}')
    return stored[leagueKey] ?? null
  } catch {
    return null
  }
}
