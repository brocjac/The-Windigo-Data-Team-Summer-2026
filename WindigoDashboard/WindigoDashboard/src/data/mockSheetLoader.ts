import type { LeagueKey, TeamRecord } from '@/types/domain'
import { parseTeamsFromSheet } from './sheetParser'
import { leagueKeyToSheetName } from './leagueConfig'
import LOCAL_SHEETS_RAW from './localSheets.json'

// IMPORTANT:
// This loader prefers a developer-provided local JSON export at `src/data/localSheets.json`.
// Use `node scripts/convert-xlsx.cjs <path-to-xlsx>` to generate that file from an .xlsx.

const LOCAL_SHEETS: Record<string, Array<Record<string, any>>> | null =
  (LOCAL_SHEETS_RAW as Record<string, Array<Record<string, any>>>) ?? null

function normalizeSheetName(s: string) {
  return s.replace(/[^a-z0-9]/gi, '').toLowerCase()
}

function findLocalSheet(local: Record<string, any>, desired: string): string | null {
  if (!local) return null
  if (local[desired]) return desired
  const normDesired = normalizeSheetName(desired)
  for (const k of Object.keys(local)) {
    if (normalizeSheetName(k) === normDesired) return k
  }
  // fallback: substring match
  for (const k of Object.keys(local)) {
    if (normalizeSheetName(k).includes(normDesired) || normDesired.includes(normalizeSheetName(k))) return k
  }
  // fallback: sorted character match (handles '16U' vs 'U16')
  const sorted = (s: string) => normalizeSheetName(s).split('').sort().join('')
  const targetSorted = sorted(normDesired)
  for (const k of Object.keys(local)) {
    if (sorted(k) === targetSorted) return k
  }
  return null
}

const MOCK_ROWS: Record<LeagueKey, Array<Record<string, string | number | null>>> = {
  USHL: [
    { 'Rank': 1, 'Team Name': 'Chicago Steel' },
    { 'Rank': 2, 'Team Name': 'Youngstown Phantoms' },
    { 'Rank': 3, 'Team Name': 'Lincoln Stars' },
  ],
  MaxPrep: [
    { 'Rank': 1, 'Team Name': 'Cedarburg Prep' },
    { 'Rank': 2, 'Team Name': 'Madison Capitals' },
  ],
  '16U': [
    { 'Rank': 1, 'Team Name': 'Green Bay 16U' },
    { 'Rank': 2, 'Team Name': 'Milwaukee 16U' },
  ],
  '18U': [
    { 'Rank': 1, 'Team Name': 'Appleton 18U' },
    { 'Rank': 2, 'Team Name': 'Waukesha 18U' },
  ],
  CanadaWHL: [
    { 'Rank': 1, 'Team Name': 'Edmonton WHL Prospects' },
  ],
  CanadaOHL: [
    { 'Rank': 1, 'Team Name': 'Kitchener Rangers (OHL)' },
  ],
  CanadaOHJML: [
    { 'Rank': 1, 'Team Name': 'OHJML Select' },
  ],
  WiPH: [
    { 'Rank': 1, 'Team Name': 'Wisconsin PH Lions' },
  ],
}

export async function loadTeamsForLeague(leagueKey: LeagueKey): Promise<TeamRecord[]> {
  const sheetName = leagueKeyToSheetName(leagueKey)
  let sheetRows: Array<Record<string, any>> | undefined

  // 1. Check localStorage first (from CSV uploads)
  try {
    const stored = JSON.parse(localStorage.getItem('windigo:sheets') || '{}')
    const candidate = stored[leagueKey]
    if (Array.isArray(candidate) && candidate.length > 0) {
      sheetRows = candidate
    }
  } catch {
    // ignore
  }

  // 2. Fall back to local JSON export (from convert-xlsx.cjs)
  if ((!sheetRows || sheetRows.length === 0) && LOCAL_SHEETS) {
    const found = findLocalSheet(LOCAL_SHEETS, sheetName)
    if (found) sheetRows = LOCAL_SHEETS[found] as any
  }

  const finalRows = sheetRows ?? (MOCK_ROWS[leagueKey] ?? [])
  const leagueName = String(leagueKey)

  const parsed = parseTeamsFromSheet(finalRows as any, { leagueName })

  return parsed.map((r, idx) => {
    const teamName = String(r.teamName ?? '').trim()
    const id = `${leagueKey}-${teamName}-${idx}`
    const rank = r.rank ?? null

    const raw: Record<string, string | number | boolean | null | undefined> = {}
    for (const [k, v] of Object.entries(r)) {
      if (v === undefined) continue
      if (v === null) raw[k] = null
      else if (typeof v === 'string') raw[k] = v
      else if (typeof v === 'number') raw[k] = v
      else if (typeof v === 'boolean') raw[k] = v
      else raw[k] = String(v)
    }
    delete raw.teamName
    delete raw.rank
    delete raw.league


    return {
      id,
      teamName,
      league: leagueName,
      rank: rank === null ? null : Number(rank),
      raw,
    }
  })
}

