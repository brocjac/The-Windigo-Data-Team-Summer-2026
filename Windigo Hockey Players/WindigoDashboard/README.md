# Wisconsin Windigo Dashboard

A responsive, dark-theme hockey scouting dashboard built with React + TypeScript. Prepared for easy expansion to player profiles, scouting notes, watchlists and recruiting pipeline features.

**Quick Start**
- Install: `npm install`
- Run dev server: `npm run dev`

**Folder Structure**
- **src/**: application source
  - **components/**: reusable UI components
    - `LeagueButton.tsx` — large league navigation buttons
    - `SearchBar.tsx` — instant filtering input
    - `TeamCard.tsx` — compact team summary cards
    - **layout/**
      - `Sidebar.tsx` — league navigation sidebar
      - `ResponsiveAppShell.css` — layout helpers
  - **data/**
    - `leagueConfig.ts` — league list & mapping
    - `mockSheetLoader.ts` — placeholder sheet loader
    - `sheetParser.ts` — generic sheet parser (add sheets without code changes)
  - **pages/**
    - `HomePage.tsx` — main landing with league buttons
    - `LeaguePage.tsx` — teams list, search, sort, cards
    - `TeamDetails.tsx` — player area (placeholder)
  - **styles/**
    - `global.css` — dark theme + Windigo branding
  - **types/**
    - `domain.ts` — domain models and types

**Component Architecture**
- `LeagueButton` — large clickable cards on the home page
- `Sidebar` — persistent league navigation (collapsible on mobile)
- `TeamCard` — displays `teamName`, `league`, `rank`, and sample columns
- `SearchBar` — controlled input for instant filtering
- `TeamDetails` — placeholder page scaffolded for future player tables

**Data Layer & Models**
- All sheet rows are parsed with `parseTeamsFromSheet` ([src/data/sheetParser.ts](src/data/sheetParser.ts)).
- Domain models: see [src/types/domain.ts](src/types/domain.ts)
  - `TeamRecord` includes `id`, `teamName`, `league`, `rank`, and `raw` (sheet columns)
  - `PlayerRecord`, `ScoutingNote`, `WatchlistEntry` defined for future use
- Loader: `loadTeamsForLeague` in [src/data/mockSheetLoader.ts](src/data/mockSheetLoader.ts) demonstrates converting sheet rows to `TeamRecord`.

**Routing Structure**
- `/` → Home page with eight league buttons
- `/league/:leagueKey` → League teams list (search + sort)
- `/team/:leagueKey/:teamId` → Team details / players placeholder

**UI / Mockup**
Mermaid mockup of the main navigation and pages:

```mermaid
flowchart LR
  A[Home Page\n"Wisconsin Windigo Dashboard"] -->|Click| B(League Page\nSearch • Sort • Team Cards)
  B -->|View Players| C(Team Details\n"Player database coming soon")
  B --- D[Sidebar\nLeague list]
  style A fill:#0b1020,stroke:#B5121B,color:#E9EEF9
  style B fill:#0b1020,stroke:#4CC9F0,color:#E9EEF9
  style C fill:#0b1020,stroke:#F2C94C,color:#E9EEF9
```

**Design & UX Notes**
- Dark theme with Wisconsin Windigo colors defined in [src/styles/global.css](src/styles/global.css).
- Responsive grid (`.grid-cards-3`) adapts from 3 → 2 → 1 columns for desktop → tablet → mobile.
- Sidebar hides on small screens to prioritize content.

**Future Player Integration Plan**
1. Data model: create `PlayerRecord` with richer fields (position, DOB, height, weight, stats object).
2. Sheet loader: add `loadPlayersForTeam(leagueKey, teamId)` and a players sheet parser mirroring `sheetParser` patterns.
3. Player table: implement a `PlayerTable` component with virtualized rows (react-window) and sortable columns.
4. Scouting features: `ScoutingNote` CRUD, per-player notes UI, and lightweight local persistence (IndexedDB) or server API.
5. Watchlists & favorites: per-user lists stored in backend; UI components in `TeamDetails` and player profiles.
6. Authentication & backend: small Express/Node or Firebase backend for persistence, with endpoints for players, notes, watchlists.
