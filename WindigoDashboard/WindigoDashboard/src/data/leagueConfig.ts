import type { LeagueKey } from '@/types/domain'

export const LEAGUES: Array<{ key: LeagueKey; sheetName: string; displayName: string }> = [
  { key: 'USHL', sheetName: 'USHL', displayName: 'USHL' },
  { key: 'MaxPrep', sheetName: 'MaxPrep', displayName: 'MaxPrep' },
  { key: '16U', sheetName: '16U', displayName: '16U' },
  { key: '18U', sheetName: '18U', displayName: '18U' },
  { key: 'CanadaWHL', sheetName: 'CanadaWHL', displayName: 'Canada WHL' },
  { key: 'CanadaOHL', sheetName: 'CanadaOHL', displayName: 'Canada OHL' },
  { key: 'CanadaOHJML', sheetName: 'CanadaOHJML', displayName: 'Canada OHJML' },
  { key: 'WiPH', sheetName: 'WiPH', displayName: 'WiPH' },
]

export function leagueKeyToSheetName(leagueKey: LeagueKey): string {
  return LEAGUES.find((l) => l.key === leagueKey)!.sheetName
}

