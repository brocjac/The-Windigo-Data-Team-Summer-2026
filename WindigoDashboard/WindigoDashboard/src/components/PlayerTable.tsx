import React from 'react'

export default function PlayerTable({
  rows,
  onDeleteRow,
}: {
  rows: Array<Record<string, any>>
  onDeleteRow?: (rowIndex: number) => void
}) {
  if (rows.length === 0) {
    return (
      <div style={{ padding: 18, borderRadius: 14, border: '1px dashed rgba(255,255,255,.16)', color: 'var(--muted)' }}>
        No player data uploaded yet.
      </div>
    )
  }

  const headers = Array.from(
    rows.reduce((set, row) => {
      Object.keys(row).forEach((key) => set.add(key))
      return set
    }, new Set<string>()),
  )

  if (onDeleteRow) {
    headers.push('Actions')
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 650 }}>
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                style={{
                  textAlign: 'left',
                  padding: '12px 14px',
                  borderBottom: '1px solid rgba(255,255,255,.12)',
                  fontWeight: 800,
                  color: 'var(--windigo-ice)',
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} style={{ borderBottom: '1px solid rgba(255,255,255,.08)' }}>
              {headers.map((header) => (
                <td key={header} style={{ padding: '12px 14px', fontSize: 13, color: 'var(--text)', verticalAlign: 'top' }}>
                  {header === 'Actions' ? (
                    onDeleteRow ? (
                      <button
                        onClick={() => onDeleteRow(rowIndex)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: 999,
                          border: '1px solid rgba(181,18,27,.45)',
                          background: 'rgba(181,18,27,.12)',
                          color: 'var(--windigo-red)',
                          fontWeight: 800,
                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
                    ) : (
                      '-'
                    )
                  ) : (
                    row[header] ?? '-'
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
