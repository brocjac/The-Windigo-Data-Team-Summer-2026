import { useState } from 'react'
import { FiSave, FiRotateCcw, FiX } from 'react-icons/fi'
import FormCard from '../../components/FormCard'

function RinkMaintenance() {
  const [form, setForm] = useState({ boards: 'Yes', glass: 'No', doors: 'No', lockerRooms: 'No', lighting: 'Yes', safetyInspection: 'Yes', notes: '' })
  const [status, setStatus] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    setStatus('Rink maintenance saved.')
  }

  const handleReset = () => {
    setForm({ boards: 'Yes', glass: 'No', doors: 'No', lockerRooms: 'No', lighting: 'Yes', safetyInspection: 'Yes', notes: '' })
    setStatus('Form reset.')
  }

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <p className="eyebrow">Maintenance</p>
          <h2>Rink Maintenance</h2>
        </div>
      </div>
      <FormCard title="Facility condition review" description="Log the state of boards, glass, doors, and safety areas.">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Boards</span>
            <select value={form.boards} onChange={(event) => setForm({ ...form, boards: event.target.value })}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>
          <label className="field">
            <span>Glass</span>
            <select value={form.glass} onChange={(event) => setForm({ ...form, glass: event.target.value })}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>
          <label className="field">
            <span>Doors</span>
            <select value={form.doors} onChange={(event) => setForm({ ...form, doors: event.target.value })}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>
          <label className="field">
            <span>Locker Rooms</span>
            <select value={form.lockerRooms} onChange={(event) => setForm({ ...form, lockerRooms: event.target.value })}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>
          <label className="field">
            <span>Lighting</span>
            <select value={form.lighting} onChange={(event) => setForm({ ...form, lighting: event.target.value })}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>
          <label className="field">
            <span>Safety Inspection</span>
            <select value={form.safetyInspection} onChange={(event) => setForm({ ...form, safetyInspection: event.target.value })}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>
          <label className="field field--full">
            <span>Notes</span>
            <textarea rows="4" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
          </label>
          {status && <p className="status status--success">{status}</p>}
          <div className="form-actions">
            <button className="button button--primary" type="submit"><FiSave /> Save</button>
            <button className="button button--secondary" type="button" onClick={handleReset}><FiRotateCcw /> Reset</button>
            <button className="button button--danger" type="button"><FiX /> Cancel</button>
          </div>
        </form>
      </FormCard>
    </div>
  )
}

export default RinkMaintenance
