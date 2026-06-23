import React, { useRef, useState } from 'react'
import type { LeagueKey } from '@/types/domain'
import { LEAGUES } from '@/data/leagueConfig'
import { parseCSVFile, storeCSVData } from '@/data/csvParser'
import { clearDeletedTeams } from '@/data/localPersistence'

export default function ImportCSVPanel({
  onComplete,
}: {
  onComplete?: () => void
}) {
  const [loading, setLoading] = useState<LeagueKey | null>(null)
  const [message, setMessage] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pendingLeague, setPendingLeague] = useState<LeagueKey | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !pendingLeague) return

    try {
      setLoading(pendingLeague)
      setMessage('')
      const rows = await parseCSVFile(file, pendingLeague)
      await storeCSVData(pendingLeague, rows)
      clearDeletedTeams(pendingLeague)
      setMessage(`✓ Imported ${rows.length} teams for ${pendingLeague}`)
      onComplete?.()
    } catch (err) {
      setMessage(`✗ Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(null)
      setPendingLeague(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const triggerUpload = (leagueKey: LeagueKey) => {
    setPendingLeague(leagueKey)
    fileInputRef.current?.click()
  }

  return (
    <div
      style={{
        border: '1px solid rgba(76,201,240,.35)',
        borderRadius: 18,
        padding: 18,
        background: 'rgba(76,201,240,.05)',
        marginBottom: 18,
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 12 }}>
        Import CSV Data
      </div>
      <div style={{ color: 'var(--muted)', fontWeight: 700, fontSize: 13, marginBottom: 14 }}>
        Click a button to upload a CSV file for each league. Data is stored locally in your browser.
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: 10,
        }}
      >
        {LEAGUES.map((l) => (
          <button
            key={l.key}
            onClick={() => triggerUpload(l.key)}
            disabled={loading !== null}
            style={{
              padding: '12px 10px',
              borderRadius: 12,
              border: `1px solid ${loading === l.key ? 'rgba(242,201,76,.55)' : 'rgba(76,201,240,.35)'}`,
              background: loading === l.key ? 'rgba(242,201,76,.15)' : 'rgba(76,201,240,.08)',
              color: 'var(--text)',
              fontWeight: 900,
              cursor: loading === null ? 'pointer' : 'not-allowed',
              opacity: loading === null ? 1 : loading === l.key ? 1 : 0.5,
              fontSize: 12,
            }}
          >
            {loading === l.key ? '⏳' : '📤'} {l.displayName}
          </button>
        ))}
      </div>

      {message && (
        <div
          style={{
            marginTop: 12,
            padding: 10,
            borderRadius: 12,
            background: message.startsWith('✗') ? 'rgba(181,18,27,.15)' : 'rgba(46,229,157,.15)',
            color: message.startsWith('✗') ? 'var(--windigo-red)' : 'var(--windigo-mint)',
            fontWeight: 800,
            fontSize: 13,
          }}
        >
          {message}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  )
}
