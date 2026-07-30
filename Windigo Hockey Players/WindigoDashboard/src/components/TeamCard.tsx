import React from 'react'
import type { TeamRecord } from '@/types/domain'

export default function TeamCard({
  team,
  onViewPlayers,
}: {
  team: TeamRecord
  onViewPlayers: () => void
}) {
  return (
    <div
      className="card"
      style={{
        padding: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ fontWeight: 950, letterSpacing: '.01em', fontSize: 16 }}>
          {team.teamName}
        </div>
        {team.rank !== null && team.rank !== undefined ? (
          <div
            style={{
              fontWeight: 950,
              padding: '6px 10px',
              borderRadius: 999,
              border: '1px solid rgba(242,201,76,.35)',
              background: 'rgba(242,201,76,.10)',
              color: 'var(--windigo-gold)',
            }}
          >
            #{team.rank}
          </div>
        ) : (
          <div
            style={{
              fontWeight: 850,
              padding: '6px 10px',
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,.10)',
              background: 'rgba(255,255,255,.03)',
              color: 'var(--muted)',
            }}
          >
            Unranked
          </div>
        )}
      </div>

      <div style={{ color: 'var(--muted)', fontWeight: 750, fontSize: 13 }}>{team.league}</div>

      <div style={{
        display:'flex',
        flexWrap:'wrap',
        gap: 8,
        marginTop: 2,
      }}>
        {Object.entries(team.raw)
          .slice(0, 4)
          .map(([k, v]) => (
            <span
              key={k}
              style={{
                border: '1px solid rgba(255,255,255,.10)',
                background: 'rgba(255,255,255,.03)',
                color: 'var(--muted)',
                padding: '6px 10px',
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              {k}: {String(v)}
            </span>
          ))}
      </div>

      <button
        onClick={onViewPlayers}
        style={{
          marginTop: 'auto',
          border: '1px solid rgba(76,201,240,.35)',
          background: 'linear-gradient(180deg, rgba(76,201,240,.16), rgba(11,19,38,.8))',
          color: 'var(--text)',
          borderRadius: 14,
          padding: '10px 12px',
          cursor: 'pointer',
          fontWeight: 900,
        }}
      >
        View Players
      </button>
    </div>
  )
}

