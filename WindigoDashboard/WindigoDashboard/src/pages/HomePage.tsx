import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LeagueButton from '@/components/LeagueButton'
import ImportCSVPanel from '@/components/ImportCSVPanel'
import { LEAGUES } from '@/data/leagueConfig'

export default function HomePage() {
  const navigate = useNavigate()
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="container">
      <div
        className="card"
        style={{
          padding: 18,
          marginBottom: 18,
          background:
            'linear-gradient(180deg, rgba(181,18,27,.18), rgba(14,22,43,.75))',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 30, fontWeight: 1000, letterSpacing: '.01em' }}>
            Wisconsin Windigo Dashboard
          </div>
          <div style={{ color: 'var(--muted)', fontWeight: 800 }}>
            Dark analytics • scouting-ready UI
          </div>
        </div>
      </div>

      <ImportCSVPanel
        key={refreshKey}
        onComplete={() => setRefreshKey((k) => k + 1)}
      />

      <div
        className="grid"
        style={{
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        }}
      >
        {LEAGUES.map((l) => (
          <LeagueButton
            key={l.key}
            leagueKey={l.key}
            label={l.displayName}
            onClick={() => navigate(`/league/${l.key}`)}
          />
        ))}
      </div>

      <div style={{ color: 'var(--muted)', fontWeight: 750, marginTop: 16 }}>
        Tip: import CSV files using the upload buttons above, or each league view supports live search + sorting. Player tables are designed to
        be added later.
      </div>
    </div>
  )
}

