import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { LeagueKey, SortKey } from '@/types/domain'
import Sidebar from '@/components/layout/Sidebar'
import SearchBar from '@/components/SearchBar'
import TeamCard from '@/components/TeamCard'
import { loadTeamsForLeague } from '@/data/mockSheetLoader'
import { deleteTeam, isTeamDeleted } from '@/data/localPersistence'
function compareRank(a?: number | null, b?: number | null) {
  const an = a ?? null
  const bn = b ?? null
  if (an === null && bn === null) return 0
  if (an === null) return 1
  if (bn === null) return -1
  return an - bn
}

export default function LeaguePage() {
  const params = useParams()
  const leagueKey = params.leagueKey as LeagueKey

  const [teams, setTeams] = useState<Awaited<ReturnType<typeof loadTeamsForLeague>>>([])
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('rank')
  const [refresh, setRefresh] = useState(0)
  const [loadError, setLoadError] = useState<string | null>(null)

  const navigate = useNavigate()

  const handleDeleteTeam = (teamId: string) => {
    if (!leagueKey) return
    deleteTeam(leagueKey, teamId)
    setTeams((prevTeams) => prevTeams.filter((team) => team.id !== teamId))
    setRefresh((value) => value + 1)
  }

  useEffect(() => {
    let active = true
    if (!leagueKey) return
    setLoadError(null)
    loadTeamsForLeague(leagueKey)
      .then((t) => {
        if (active) {
          const visibleTeams = t.filter((team) => !isTeamDeleted(leagueKey, team.id))
          setTeams(visibleTeams)
          if (visibleTeams.length === 0) {
            setLoadError('No teams were loaded for this league. Check your CSV import or sheet mapping.')
          }
        }
      })
      .catch((err) => {
        if (active) {
          setTeams([])
          setLoadError(String(err) || 'Failed to load teams.')
        }
      })
    return () => {
      active = false
    }
  }, [leagueKey, refresh])

  const filteredAndSorted = useMemo(() => {
    const q = search.trim().toLowerCase()
    const filtered = q
      ? teams.filter((t) => {
          const base = `${t.teamName} ${t.league}`.toLowerCase()
          const rank = t.rank !== null && t.rank !== undefined ? String(t.rank) : ''
          return base.includes(q) || rank.includes(q)
        })
      : teams.slice()

    const sorted = filtered.sort((a, b) => {
      if (sortKey === 'rank') return compareRank(a.rank, b.rank) || a.teamName.localeCompare(b.teamName)
      if (sortKey === 'teamName') return a.teamName.localeCompare(b.teamName)
      return a.league.localeCompare(b.league)
    })

    return sorted
  }, [teams, search, sortKey])

  return (
    <div className="container">
      <div
        className="card"
        style={{
          padding: 18,
          marginBottom: 14,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 14,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={{ fontSize: 22, fontWeight: 1000 }}>{String(leagueKey)}</div>
          <div style={{ color: 'var(--muted)', fontWeight: 800, marginTop: 4 }}>
            Teams list • searchable + sortable
          </div>
          <div style={{ marginTop: 8, color: 'var(--muted)', fontWeight: 800 }}>
            Loaded {teams.length} team{teams.length === 1 ? '' : 's'}.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '10px 14px',
              borderRadius: 14,
              border: '1px solid rgba(255,255,255,.12)',
              background: 'rgba(255,255,255,.06)',
              color: 'var(--text)',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Home
          </button>
          <div style={{ color: 'var(--muted)', fontWeight: 900 }}>Sort</div>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            style={{
              borderRadius: 14,
              border: '1px solid rgba(255,255,255,.12)',
              background: 'rgba(255,255,255,.03)',
              color: 'var(--text)',
              padding: '10px 12px',
              fontWeight: 800,
              outline: 'none',
            }}
          >
            <option value="rank">Rank</option>
            <option value="teamName">Team Name</option>
            <option value="league">League</option>
          </select>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: 14,
          alignItems: 'start',
        }}
      >
        <div className="hideOnMobile">
          <Sidebar activeLeagueKey={leagueKey} />
        </div>

        <div style={{ minWidth: 0 }}>
          <div className="grid" style={{ gridTemplateColumns: '1fr', marginBottom: 12 }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Search by team name or rank" />
          </div>

          <div
            className="grid grid-cards-3"
            style={{ alignItems: 'stretch' }}
          >
            {filteredAndSorted.map((team) => (
              <div key={team.id} style={{ position: 'relative' }}>
                <TeamCard
                  team={team}
                  onViewPlayers={() => navigate(`/team/${leagueKey}/${team.id}`)}
                />
                <button
                  onClick={() => handleDeleteTeam(team.id)}
                  style={{
                    position: 'absolute',
                    top: 14,
                    right: 14,
                    border: 'none',
                    background: 'rgba(181,18,27,.85)',
                    color: '#fff',
                    borderRadius: 999,
                    width: 28,
                    height: 28,
                    cursor: 'pointer',
                    fontWeight: 900,
                  }}
                  title="Delete team"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {filteredAndSorted.length === 0 ? (
            <div
              className="card"
              style={{
                padding: 18,
                marginTop: 14,
                color: 'var(--muted)',
                fontWeight: 850,
              }}
            >
              {loadError ?? 'No teams match your search.'}
            </div>
          ) : null}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px){
          .hideOnMobile{ display:none; }
          .container{ padding: 14px; }
        }
      `}</style>
    </div>
  )
}

