import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import PlayerUploadPanel from '@/components/PlayerUploadPanel'
import PlayerTable from '@/components/PlayerTable'
import { deletePlayerRow, getPlayersForTeam, savePlayersForTeam } from '@/data/localPersistence'
import type { LeagueKey } from '@/types/domain'

function loadPlayersForTeam(teamId: string) {
  return getPlayersForTeam(teamId)
}

export default function TeamDetails() {
  const params = useParams()
  const navigate = useNavigate()
  const leagueKey = params.leagueKey as LeagueKey
  const teamId = params.teamId ?? 'unknown-team'

  const [playerRows, setPlayerRows] = useState<Array<Record<string, any>>>([])
  const [teamName, setTeamName] = useState('Team')

  useEffect(() => {
    setPlayerRows(loadPlayersForTeam(teamId))
  }, [teamId])

  const sortedPlayers = useMemo(() => {
    if (!playerRows.length) return playerRows
    const rankKey = Object.keys(playerRows[0]).find((key) => key.toLowerCase().includes('rank'))
    if (!rankKey) return playerRows
    return [...playerRows].sort((a, b) => {
      const aValue = Number(a[rankKey])
      const bValue = Number(b[rankKey])
      if (!Number.isFinite(aValue) || !Number.isFinite(bValue)) return 0
      return aValue - bValue
    })
  }, [playerRows])

  const handleDeletePlayer = (rowIndex: number) => {
    deletePlayerRow(teamId, rowIndex)
    setPlayerRows(loadPlayersForTeam(teamId))
  }

  return (
    <div className="container">
      <div className="card" style={{ padding: 18, marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 1000 }}>{teamName}</div>
            <div style={{ color: 'var(--muted)', fontWeight: 800, marginTop: 4 }}>
              Upload player data and view rankings for this team.
            </div>
          </div>
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

        <div>
          <div className="card" style={{ padding: 18, marginBottom: 18 }}>
            <PlayerUploadPanel
              leagueKey={leagueKey}
              teamId={teamId}
              onComplete={() => setPlayerRows(loadPlayersForTeam(teamId))}
            />

            <div style={{ fontSize: 18, fontWeight: 950, color: 'var(--windigo-gold)', marginBottom: 8 }}>
              Player Rankings
            </div>
            <div style={{ color: 'var(--muted)', fontWeight: 800, marginBottom: 14 }}>
              Upload a CSV to list players by rank. The table will show all fields from the uploaded file.
            </div>

            <PlayerTable rows={sortedPlayers} onDeleteRow={handleDeletePlayer} />
          </div>
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

