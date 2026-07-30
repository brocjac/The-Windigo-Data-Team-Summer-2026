import React from 'react'
import { NavLink } from 'react-router-dom'
import type { LeagueKey } from '@/types/domain'
import { LEAGUES } from '@/data/leagueConfig'

export default function Sidebar({
  activeLeagueKey,
  onNavigate,
}: {
  activeLeagueKey?: LeagueKey
  onNavigate?: () => void
}) {
  return (
    <aside
      style={{
        position: 'sticky',
        top: 0,
        height: 'fit-content',
        padding: 14,
      }}
    >
      <div
        className="card"
        style={{
          padding: 14,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          minWidth: 220,
        }}
      >
        <NavLink
          to="/"
          style={({ isActive }) => ({
            padding: '10px 12px',
            borderRadius: 14,
            border: `1px solid ${isActive ? 'rgba(242,201,76,.55)' : 'rgba(255,255,255,.10)'}`,
            background: isActive ? 'rgba(242,201,76,.10)' : 'rgba(255,255,255,.03)',
            color: 'var(--text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            fontWeight: 700,
          })}
        >
          <span>Home</span>
          <span
            aria-hidden
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: 'rgba(76,201,240,.85)',
            }}
          />
        </NavLink>

        <div
          style={{
            fontWeight: 800,
            letterSpacing: '.02em',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span
            aria-hidden
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: 'linear-gradient(180deg, var(--windigo-red), var(--windigo-gold))',
              boxShadow: '0 0 0 3px rgba(242,201,76,.15)',
            }}
          />
          <span>Leagues</span>
        </div>

        {LEAGUES.map((l) => {
          const to = `/league/${l.key}`
          return (
            <NavLink
              key={l.key}
              to={to}
              onClick={onNavigate}
              style={({ isActive }) => ({
                padding: '10px 12px',
                borderRadius: 14,
                border: `1px solid ${isActive ? 'rgba(242,201,76,.55)' : 'rgba(255,255,255,.10)'}`,
                background: isActive ? 'rgba(242,201,76,.10)' : 'rgba(255,255,255,.03)',
                color: 'var(--text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              })}
            >
              <span style={{ fontWeight: 700 }}>{l.displayName}</span>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: 'rgba(76,201,240,.85)',
                  opacity: l.key === activeLeagueKey ? 1 : 0.35,
                }}
              />
            </NavLink>
          )
        })}
      </div>
    </aside>
  )
}

