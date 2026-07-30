import { useMemo, useState } from 'react'
import { FiSearch, FiFilter, FiUsers, FiCalendar, FiTarget } from 'react-icons/fi'
import StatCard from '../../components/StatCard'
import Table from '../../components/Table'
import { teams } from '../../data/dummyData'

function TeamsDashboard() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')

  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      const matchQuery = [team.name, team.division, team.coach].join(' ').toLowerCase().includes(query.toLowerCase())
      const matchFilter = filter === 'All' || team.division === filter
      return matchQuery && matchFilter
    })
  }, [filter, query])

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <p className="eyebrow">Teams</p>
          <h2>Teams Dashboard</h2>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard title="Current Teams" value="3" detail="Active rosters" />
        <StatCard title="Practice Schedule" value="3 Sessions" detail="This week" />
        <StatCard title="Games" value="21" detail="Season total" />
        <StatCard title="Ice Assignments" value="2 Rinks" detail="Assigned today" />
      </div>

      <section className="card controls-card">
        <div className="search-group">
          <FiSearch />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search teams" />
        </div>
        <div className="search-group">
          <FiFilter />
          <select value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="All">All Divisions</option>
            <option value="North">North</option>
            <option value="Central">Central</option>
            <option value="South">South</option>
          </select>
        </div>
      </section>

      <section className="card-grid">
        <article className="card table-card">
          <h3>Current Teams</h3>
          <Table columns={['Team', 'Division', 'Coach', 'Practice', 'Games', 'Ice Slot']} rows={filteredTeams.map((team) => [team.name, team.division, team.coach, team.practice, team.games, team.iceSlot])} />
        </article>
        <div className="stack">
          <article className="card dashboard-card compact-card">
            <div className="dashboard-card__header">
              <div className="dashboard-card__icon"><FiCalendar /></div>
              <span className="dashboard-card__trend">+2</span>
            </div>
            <h3>Practice Schedule</h3>
            <p className="dashboard-card__value">Tue / Wed / Thu</p>
            <p className="dashboard-card__subtitle">Updated nightly</p>
          </article>
          <article className="card dashboard-card compact-card">
            <div className="dashboard-card__header">
              <div className="dashboard-card__icon"><FiTarget /></div>
              <span className="dashboard-card__trend">+4%</span>
            </div>
            <h3>Games</h3>
            <p className="dashboard-card__value">21 upcoming</p>
            <p className="dashboard-card__subtitle">Strong attendance</p>
          </article>
          <article className="card dashboard-card compact-card">
            <div className="dashboard-card__header">
              <div className="dashboard-card__icon"><FiUsers /></div>
              <span className="dashboard-card__trend">Stable</span>
            </div>
            <h3>Ice Assignments</h3>
            <p className="dashboard-card__value">3 slots held</p>
            <p className="dashboard-card__subtitle">Balanced usage</p>
          </article>
        </div>
      </section>
    </div>
  )
}

export default TeamsDashboard
