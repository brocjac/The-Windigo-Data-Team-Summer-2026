import { useState } from 'react'
import { FiSave, FiRotateCcw, FiX } from 'react-icons/fi'
import FormCard from '../../components/FormCard'

function IceMaintenance() {
  const [form, setForm] = useState({ flooding: 'Yes', edging: 'No', painting: 'No', iceRepairs: 'No', notes: '' })
  const [status, setStatus] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    setStatus('Ice maintenance record saved.')
  }

  const handleReset = () => {
    setForm({ flooding: 'Yes', edging: 'No', painting: 'No', iceRepairs: 'No', notes: '' })
    setStatus('Form reset.')
  }

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <p className="eyebrow">Maintenance</p>
          <h2>Ice Maintenance</h2>
        </div>
      </div>
      <FormCard title="Rink surface tasks" description="Record the latest ice upkeep activities.">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Flooding</span>
            <select value={form.flooding} onChange={(event) => setForm({ ...form, flooding: event.target.value })}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>
          <label className="field">
            <span>Edging</span>
            <select value={form.edging} onChange={(event) => setForm({ ...form, edging: event.target.value })}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>
          <label className="field">
            <span>Painting</span>
            <select value={form.painting} onChange={(event) => setForm({ ...form, painting: event.target.value })}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>
          <label className="field">
            <span>Ice Repairs</span>
            <select value={form.iceRepairs} onChange={(event) => setForm({ ...form, iceRepairs: event.target.value })}>
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

export default IceMaintenance
