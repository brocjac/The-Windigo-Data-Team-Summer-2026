#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const xlsx = require('xlsx')

function usage() {
  console.log('Usage: node scripts/convert-xlsx.cjs <path-to-xlsx>')
  process.exit(1)
}

const arg = process.argv[2] || process.env.XLSX_PATH
if (!arg) usage()

const abs = path.resolve(arg)
if (!fs.existsSync(abs)) {
  console.error('File not found:', abs)
  process.exit(2)
}

const wb = xlsx.readFile(abs, { cellDates: true })
const out = {}
for (const name of wb.SheetNames) {
  const sheet = wb.Sheets[name]
  const rows = xlsx.utils.sheet_to_json(sheet, { defval: null })
  out[name] = rows
}

const outPath = path.resolve(__dirname, '..', 'src', 'data', 'localSheets.json')
fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8')
console.log('Wrote', outPath)
console.log('Sheets:', Object.keys(out).join(', '))
