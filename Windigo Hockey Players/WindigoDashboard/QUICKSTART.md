# Quick Start Guide

## How to Run the Code

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Start the Development Server**
```bash
npm run dev
```

The app will open at **http://localhost:5173/** (automatically opens in your default browser).

---

## Import CSV Data

You have two options:

### **Option A: GUI Import (Easiest)**
1. Go to **http://localhost:5173/**
2. Scroll to the **"Import CSV Data"** section at the top
3. Click a league button (e.g., "📤 USHL") to upload a CSV file
4. Select the corresponding CSV from your computer:
   - `Windigo - USHL.csv`
   - `Windigo - HS.csv`
   - `Windigo - U18.csv`
   - `Windigo - U16.csv`
   - `Windigo - CanadaWHL.csv`
   - `Windigo - CanadaOHL.csv`
   - `Windigo - CanadaQHJML.csv`
   - `Windigo - WiPH.csv`
5. Repeat for each league
6. Click a league button to view the imported teams

**Data is stored locally in your browser** (no server required).

### **Option B: CLI Import (For All Files at Once)**
If you want to import all CSV files via command line:

```bash
npm run import:xlsx "C:\Users\paladugup\Downloads\Windigo.xlsx"
```

---

## Build for Production
```bash
npm run build
```

---

## Project Structure
- **`src/components/`** – Reusable UI components (LeagueButton, SearchBar, TeamCard, ImportCSVPanel, Sidebar)
- **`src/pages/`** – Page components (HomePage, LeaguePage, TeamDetails)
- **`src/data/`** – Data utilities (sheet parser, CSV parser, mock loader)
- **`src/styles/`** – Global styles and dark theme
- **`src/types/`** – TypeScript domain models
- **`scripts/`** – Helper scripts (xlsx to JSON converter)

---

## Features
✅ **Home Page** – 8 league navigation buttons  
✅ **League View** – Search, sort, and view teams  
✅ **CSV Import** – Upload league data via GUI or CLI  
✅ **Responsive** – Desktop, tablet, and mobile friendly  
✅ **Dark Theme** – Wisconsin Windigo branding colors  
✅ **Extensible** – Ready for player profiles, scouting notes, watchlists  

---

## Future Enhancements
- Player profiles and statistics
- Scouting notes and annotations
- Watchlists and favorites
- Recruiting pipeline tracking
- Backend persistence (Firebase, Node.js, etc.)
