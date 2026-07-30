import type { LeagueKey } from '@/types/domain'

function safeParse(key: string): any {
  try {
    return JSON.parse(localStorage.getItem(key) || '{}')
  } catch {
    return {}
  }
}

function safeWrite(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getDeletedTeams(leagueKey: LeagueKey): string[] {
  const data = safeParse('windigo:deletedTeams')
  return Array.isArray(data[leagueKey]) ? data[leagueKey] : []
}

export function isTeamDeleted(leagueKey: LeagueKey, teamId: string): boolean {
  return getDeletedTeams(leagueKey).includes(teamId)
}

export function deleteTeam(leagueKey: LeagueKey, teamId: string) {
  const data = safeParse('windigo:deletedTeams')
  const current = Array.isArray(data[leagueKey]) ? data[leagueKey] : []
  if (!current.includes(teamId)) {
    current.push(teamId)
    data[leagueKey] = current
    safeWrite('windigo:deletedTeams', data)
  }
}

export function clearDeletedTeams(leagueKey: LeagueKey) {
  const data = safeParse('windigo:deletedTeams')
  if (data[leagueKey]) {
    delete data[leagueKey]
    safeWrite('windigo:deletedTeams', data)
  }
}

export function getPlayersForTeam(teamId: string): Record<string, any>[] {
  const data = safeParse('windigo:players')
  return Array.isArray(data[teamId]) ? data[teamId] : []
}

export function savePlayersForTeam(teamId: string, rows: Record<string, any>[]) {
  const data = safeParse('windigo:players')
  data[teamId] = rows
  safeWrite('windigo:players', data)
}

export function deletePlayerRow(teamId: string, index: number) {
  const rows = getPlayersForTeam(teamId)
  if (index < 0 || index >= rows.length) return
  rows.splice(index, 1)
  savePlayersForTeam(teamId, rows)
}
