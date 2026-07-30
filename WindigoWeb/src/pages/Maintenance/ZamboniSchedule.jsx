import { FiCalendar } from 'react-icons/fi'

const schedule = [
  { day: 'Mon', operator: 'R. Cruz', rink: 'Rink A', start: '05:00', end: '07:30' },
  { day: 'Tue', operator: 'M. Lee', rink: 'Rink B', start: '07:00', end: '09:00' },
  { day: 'Wed', operator: 'R. Cruz', rink: 'Rink C', start: '05:30', end: '08:00' },
  { day: 'Thu', operator: 'N. Diaz', rink: 'Rink A', start: '06:00', end: '08:30' },
]

function ZamboniSchedule() {
  return (
    <div className="page">
      <div className="page__header">
        <div>
          <p className="eyebrow">Maintenance</p>
          <h2>Zamboni Schedule</h2>
        </div>
      </div>
      <section className="card">
        <div className="calendar-header">
          <div><h3>Weekly schedule</h3><p>Daily zamboni readiness and assignments.</p></div>
          <div className="calendar-badge"><FiCalendar /> Week 5</div>
        </div>
        <div className="calendar-grid">
          {schedule.map((slot) => (
            <article key={slot.day} className="calendar-card">
              <h4>{slot.day}</h4>
              <p><strong>Operator</strong> {slot.operator}</p>
              <p><strong>Rink</strong> {slot.rink}</p>
              <p><strong>Start</strong> {slot.start}</p>
              <p><strong>End</strong> {slot.end}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default ZamboniSchedule
