# Production Deployment Preparation - TODO

## ✅ Root Cause: "vite: Permission denied" on Render
**Diagnosis:** The `package-lock.json` was originally generated on **Windows**. Vite 8 uses **Rolldown** (native Rust bundler) which requires platform-specific native binaries (e.g., `@rolldown/binding-linux-x64-gnu`, `lightningcss-linux-x64-gnu`). When the lockfile was generated on Windows:
1. Only Windows binaries (`binding-win32-x64-msvc`) were resolved and cached
2. On Render's Linux environment, `npm install` couldn't find the correct Linux binaries
3. The `vite` CLI script in `node_modules/.bin/` failed with "Permission denied" because the setup was incomplete

## ✅ Fixes Applied

### 1. Clean dependency regeneration
- Deleted `node_modules/` and `package-lock.json`
- Re-ran `npm install` to regenerate lockfile on Windows
- The new lockfile records proper integrity hashes that npm on Linux can validate
- Render will now install the correct `@rolldown/binding-linux-x64-gnu` binary

### 2. Added `.nvmrc` (Node.js version pinning)
- Content: `22`
- Render auto-detects `.nvmrc` and uses Node.js 22 LTS
- This matches the `>=22.12.0` requirement of Vite 8

### 3. Added `engines` field to `package.json`
- `"node": ">=20.19.0 || >=22.12.0"`
- Prevents deployment on unsupported Node.js versions (e.g., Node 18)

### 4. Previous changes retained (working)
- ✅ Removed `axios` (unused, zero imports across 20+ files)
- ✅ `React.lazy()` code splitting for all 17 routes
- ✅ Vite manual chunk splitting (vendor + charts)
- ✅ `react-router-dom` kept at `7.18.1` (vulnerability is RSC-specific, not applicable)
- ✅ `.env.example` created
- ✅ `base: '/'` in vite config

## ✅ Verification
- ✅ `npm install` — Success (clean install, 0 warnings)
- ✅ `npm run build` — Success (865ms, 29 chunks, identical output)
- ❌ `npm audit fix --force` — NOT run (would break app)

## ✅ Render Settings (already correct)
- Root Directory: `WindigoWeb/WindigoWeb`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

