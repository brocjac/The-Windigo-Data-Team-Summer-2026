type Cell = string | number | boolean | null | undefined

export interface GenericSheetRow {
  [column: string]: Cell
}

export interface ParsedTeamRow {
  teamName?: string
  rank?: number | null
  league?: string
  [other: string]: unknown
}

function toNumberOrNull(v: unknown): number | null {
  if (v === null || v === undefined) return null
  if (typeof v === 'number') return Number.isFinite(v) ? v : null
  const s = String(v).trim()
  if (!s) return null
  const n = Number(s.replace(/,/g, ''))
  return Number.isFinite(n) ? n : null
}

function normalizeHeaderName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9]/gi, '')
    .toLowerCase()
}

function makeLookup(row: GenericSheetRow): Record<string, Cell> {
  const normalized: Record<string, Cell> = {}
  for (const [key, value] of Object.entries(row)) {
    normalized[normalizeHeaderName(key)] = value
  }
  return normalized
}

function guessTeamName(row: GenericSheetRow): string | undefined {
  const lookup = makeLookup(row)
  const candidates = ['teamname', 'team', 'school', 'club', 'organization', 'name']
  for (const c of candidates) {
    const v = lookup[c]
    if (v !== undefined && v !== null && String(v).trim()) return String(v).trim()
  }
  return undefined
}

function guessRank(row: GenericSheetRow): number | null {
  const lookup = makeLookup(row)
  const candidates = ['rank', 'overallrank', 'seed', 'place']
  for (const c of candidates) {
    const v = lookup[c]
    const n = toNumberOrNull(v)
    if (n !== null) return n
  }
  return null
}

export function parseTeamsFromSheet(
  sheetRows: GenericSheetRow[],
  opts: { leagueName: string },
): ParsedTeamRow[] {
  return sheetRows
    .map((row) => {
      const teamName = guessTeamName(row)
      const rank = guessRank(row)
      return {
        ...row,
        teamName,
        rank,
        league: opts.leagueName,
      }
    })
    .filter((r) => !!r.teamName)
}

