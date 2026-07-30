export const teams = [
  { id: 1, name: 'Windigo Hawks', division: 'North', coach: 'M. Larson', practice: 'Tue 6:00 PM', games: 8, iceSlot: 'Rink A' },
  { id: 2, name: 'Lakefront Flyers', division: 'Central', coach: 'J. Patel', practice: 'Wed 7:30 PM', games: 6, iceSlot: 'Rink B' },
  { id: 3, name: 'Northshore Tigers', division: 'South', coach: 'S. Adams', practice: 'Thu 5:30 PM', games: 7, iceSlot: 'Rink C' },
]

export const iceThicknessData = [
  { date: 'Jan 01', value: 2.6 },
  { date: 'Jan 08', value: 2.8 },
  { date: 'Jan 15', value: 2.7 },
  { date: 'Jan 22', value: 2.9 },
  { date: 'Jan 29', value: 2.8 },
]

export const temperatureData = [
  { date: 'Jan 01', value: 20 },
  { date: 'Jan 08', value: 18 },
  { date: 'Jan 15', value: 21 },
  { date: 'Jan 22', value: 19 },
  { date: 'Jan 29', value: 17 },
]

export const maintenanceRecords = [
  { id: 1, title: 'HVAC filter replacement', status: 'Completed', priority: 'High' },
  { id: 2, title: 'Zamboni blade inspection', status: 'In Progress', priority: 'Medium' },
  { id: 3, title: 'Locker room lighting', status: 'Open', priority: 'Low' },
]

export const rinkReadings = [
  { id: 1, date: '2026-01-29', time: '06:30', employee: 'A. Brooks', location: 'Rink A', thickness: '2.8 in', notes: 'Stable surface' },
  { id: 2, date: '2026-01-28', time: '06:00', employee: 'T. Nguyen', location: 'Rink B', thickness: '2.7 in', notes: 'Light resurfacing' },
]
