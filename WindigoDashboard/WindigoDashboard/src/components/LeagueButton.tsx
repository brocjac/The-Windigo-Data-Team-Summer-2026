import React from 'react'
import type { LeagueKey } from '@/types/domain'

export default function LeagueButton({
  label,
  onClick,
}: {
  label: string
  leagueKey: LeagueKey
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        border: '1px solid rgba(255,255,255,.12)',
        borderRadius: 22,
        padding: '20px 16px',
        background:
          'linear-gradient(180deg, rgba(181,18,27,.16), rgba(14,22,43,.8))',
        color: 'var(--text)',
        boxShadow: '0 14px 40px rgba(0,0,0,.45)',
        cursor: 'pointer',
        textAlign: 'left',
      }}
      aria-label={label}
    >
      <div style={{ fontWeight: 900, fontSize: 20, letterSpacing: '.01em' }}>{label}</div>
      <div style={{ color: 'var(--muted)', marginTop: 6, fontSize: 13, fontWeight: 600 }}>
        View teams & scouting
      </div>
      <div
        aria-hidden
        style={{
          marginTop: 12,
          height: 8,
          borderRadius: 999,
          background: 'linear-gradient(90deg, var(--windigo-red), var(--windigo-gold), var(--windigo-ice))',
          opacity: 0.9,
        }}
      />
    </button>
  )
}

