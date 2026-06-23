export type LeagueKey =
  | 'USHL'
  | 'MaxPrep'
  | '16U'
  | '18U'
  | 'CanadaWHL'
  | 'CanadaOHL'
  | 'CanadaOHJML'
  | 'WiPH'

export type SortKey = 'rank' | 'teamName' | 'league'

export interface TeamRecord {
  id: string
  teamName: string
  league: string
  rank?: number | null
  raw: Record<string, string | number | boolean | null | undefined>
}

export interface PlayerRecord {
  id: string
  fullName: string
  teamId: string
}

export interface ScoutingNote {
  id: string
  playerId: string
  author: string
  createdAt: string
  text: string
}

export interface WatchlistEntry {
  id: string
  teamId?: string
  playerId?: string
  createdAt: string
}

