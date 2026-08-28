import { useEffect, useState } from 'react'
import { FiSave, FiRotateCcw, FiX } from 'react-icons/fi'
import FormCard from '../../../components/FormCard'
import {getIceMaintenance, addIceMaintenance} from '../../../data/api'

function IceMaintenanceForm() {
  const [form, setForm] = useState({ date: '', Edged: 'No', Chipped: 'No', CrossCut: 'No', HandFlood: 'No', Notes: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')

  const [readings, setReadings] = useState([])

  useEffect(() => {
    getIceMaintenance()
      .then((data) => {
        console.log('Rink data:', data)
        setReadings(data)
      })
    .catch((error) => {
        console.error('Failed to retrieve rink readings:', error)
      })
  }, [])

  const validate = () => {
    const nextErrors = {}
    if (!form.date) nextErrors.date = 'Date is required.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) {
      setStatus('Please correct the required fields.')
      return
    }
    try {
      const newReading = {
        iceMaintenanceDate: form.date,
        edged: form.Edged,
        chipped: form.Chipped,
        crossCut: form.CrossCut,
        handFlood: form.HandFlood,
        notes: form.Notes.trim() === '' ? null : form.Notes.trim(),
      }

      const saveReading = await addIceMaintenance(newReading)

      setReadings((Current) => [
        saveReading, ...Current
      ])
      setStatus('Reading saved successfully.')
    }
    catch (error) {
      console.error('Failed to save reading:', error)
      setStatus('Failed to save reading.')
    }
  }

  const handleReset = () => {
    setForm({ date: '', Edged: 'No', Chipped: 'No', CrossCut: 'No', HandFlood: 'No', Notes: '' })
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
          <label className='field'>
            <span>Edged</span>
            <select value={form.Edged} onChange={(event) => setForm({...form, Edged: event.target.value})}>
              <option value='Yes'>Yes</option>
              <option value='No'>No</option>
              <option value='Corners'>Corners</option>
              <option value='Other'>Other</option>
            </select>
          </label>
          <label className='field'>
            <span>Chipped</span>
            <select value={form.Chipped} onChange={(event) => setForm({...form, Chipped: event.target.value})}>
              <option value='Yes'>Yes</option>
              <option value='No'>No</option>
              <option value='Other'>Other</option>
            </select>
          </label>
          <label className='field'>
            <span>Cross Cut</span>
            <select value={form.CrossCut} onChange={(event) => setForm({...form, CrossCut: event.target.value})}>
              <option value='Yes'>Yes</option>
              <option value='No'>No</option>
              <option value='Other'>Other</option>
            </select>
          </label>
          <label className='field'>
            <span>Hand Flood</span>
            <select value={form.HandFlood} onChange={(event) => setForm({...form, HandFlood: event.target.value})}>
              <option value='Yes'>Yes</option>
              <option value='No'>No</option>
              <option value='Other'>Other</option>
            </select>
          </label>
          <label className='field'>
              <span>Notes</span>
              <textarea value={form.Notes} onChange={(event) => setForm({...form, Notes: event.target.value})}/>
          </label>
          {status && <p className={`status ${status.includes('success') ? 'status--success' : 'status--error'}`}>{status}</p>}
          <div className="form-actions">
            <button className="button button--primary" type="submit"><FiSave /> Save</button>
            <button className="button button--secondary" type="button" onClick={handleReset}><FiRotateCcw /> Reset</button>
            <button className="button button--danger" type="button"><FiX /> Cancel</button>
          </div>
        </form>
      </FormCard>

      {/* <section className="card">
        <h3>Recent Readings</h3>
        <div className="maintenance-list">
          {readings.map((reading) => (
            <div className="maintenance-item" key={reading.rinkTempHumidityId}>
              <div><strong>{reading.rinkTempHumidityDate}</strong><p>Air {reading.temperature}°F • Ice ?????°F • Humidity {reading.humidity}%</p></div>
              <span className="badge">Stable</span>
            </div>
          ))}
          <div className="maintenance-item">
            <div><strong>2026-01-28 • 06:00</strong><p>Air 20°F • Ice 18°F • Humidity 51%</p></div>
            <span className="badge">Stable</span>
          </div>
        </div>
      </section> */}
    </div>
  )
}

export default IceMaintenanceForm
