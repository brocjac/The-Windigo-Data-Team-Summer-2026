import React, { useRef, useState } from 'react'
import type { LeagueKey } from '@/types/domain'
import { parseCSVFile, storeCSVData } from '@/data/csvParser'

export default function PlayerUploadPanel({
  leagueKey,
  teamId,
  onComplete,
}: {
  leagueKey: LeagueKey
  teamId: string
  onComplete?: () => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string>('')

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)
      setMessage('')
      const rows = await parseCSVFile(file, leagueKey)
      const stored = (() => {
        try {
          return JSON.parse(localStorage.getItem('windigo:players') || '{}')
        } catch {
          return {}
        }
      })()
      stored[teamId] = rows
      localStorage.setItem('windigo:players', JSON.stringify(stored))
      setMessage(`✓ Uploaded ${rows.length} player rows for ${teamId}`)
      onComplete?.()
    } catch (err) {
      setMessage(`✗ ${err instanceof Error ? err.message : 'Upload failed'}`)
    } finally {
      setLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div style={{ marginBottom: 18, padding: 16, borderRadius: 18, border: '1px solid rgba(76,201,240,.25)', background: 'rgba(76,201,240,.06)' }}>
      <div style={{ fontWeight: 900, marginBottom: 10 }}>Upload Player CSV</div>
      <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 14 }}>
        Upload a CSV file with player rankings. Headers are read from the CSV file.
      </div>

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        style={{
          padding: '10px 14px',
          borderRadius: 14,
          border: '1px solid rgba(76,201,240,.35)',
          background: 'rgba(76,201,240,.12)',
          color: 'var(--text)',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: 800,
        }}
      >
        {loading ? 'Uploading…' : 'Upload Player CSV'}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleUpload}
        style={{ display: 'none' }}
      />

      {message && (
        <div style={{ marginTop: 12, color: message.startsWith('✓') ? 'var(--windigo-mint)' : 'var(--windigo-red)', fontWeight: 800 }}>
          {message}
        </div>
      )}
    </div>
  )
}
