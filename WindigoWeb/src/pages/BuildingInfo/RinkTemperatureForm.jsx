import { useState } from 'react'
import { FiSave, FiRotateCcw, FiX } from 'react-icons/fi'
import FormCard from '../../components/FormCard'

function RinkTemperatureForm() {
  const [form, setForm] = useState({ date: '', time: '', airTemp: '', iceTemp: '', humidity: '', comments: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')

  const validate = () => {
    const nextErrors = {}
    if (!form.date) nextErrors.date = 'Date is required.'
    if (!form.time) nextErrors.time = 'Time is required.'
    if (!form.airTemp) nextErrors.airTemp = 'Air temperature is required.'
    if (!form.iceTemp) nextErrors.iceTemp = 'Ice temperature is required.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!validate()) {
      setStatus('Please correct the required fields.')
      return
    }
    setStatus('Reading saved successfully.')
  }

  const handleReset = () => {
    setForm({ date: '', time: '', airTemp: '', iceTemp: '', humidity: '', comments: '' })
    setErrors({})
    setStatus('Form reset.')
  }

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <p className="eyebrow">Forms</p>
          <h2>Rink Temperature Form</h2>
        </div>
      </div>
      <FormCard title="Track rink conditions" description="Log environmental conditions to maintain consistent ice quality.">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Date</span>
            <input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} />
            {errors.date && <small>{errors.date}</small>}
          </label>
          <label className="field">
            <span>Time</span>
            <input type="time" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} />
            {errors.time && <small>{errors.time}</small>}
          </label>
          <label className="field">
            <span>Air Temperature</span>
            <input value={form.airTemp} onChange={(event) => setForm({ ...form, airTemp: event.target.value })} />
            {errors.airTemp && <small>{errors.airTemp}</small>}
          </label>
          <label className="field">
            <span>Ice Temperature</span>
            <input value={form.iceTemp} onChange={(event) => setForm({ ...form, iceTemp: event.target.value })} />
            {errors.iceTemp && <small>{errors.iceTemp}</small>}
          </label>
          <label className="field">
            <span>Humidity</span>
            <input value={form.humidity} onChange={(event) => setForm({ ...form, humidity: event.target.value })} />
          </label>
          <label className="field field--full">
            <span>Comments</span>
            <textarea rows="4" value={form.comments} onChange={(event) => setForm({ ...form, comments: event.target.value })} />
          </label>
          {status && <p className={`status ${status.includes('success') ? 'status--success' : 'status--error'}`}>{status}</p>}
          <div className="form-actions">
            <button className="button button--primary" type="submit"><FiSave /> Save</button>
            <button className="button button--secondary" type="button" onClick={handleReset}><FiRotateCcw /> Reset</button>
            <button className="button button--danger" type="button"><FiX /> Cancel</button>
          </div>
        </form>
      </FormCard>

      <section className="card">
        <h3>Recent Readings</h3>
        <div className="maintenance-list">
          <div className="maintenance-item">
            <div><strong>2026-01-29 • 06:30</strong><p>Air 22°F • Ice 19°F • Humidity 54%</p></div>
            <span className="badge">Stable</span>
          </div>
          <div className="maintenance-item">
            <div><strong>2026-01-28 • 06:00</strong><p>Air 20°F • Ice 18°F • Humidity 51%</p></div>
            <span className="badge">Stable</span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default RinkTemperatureForm
