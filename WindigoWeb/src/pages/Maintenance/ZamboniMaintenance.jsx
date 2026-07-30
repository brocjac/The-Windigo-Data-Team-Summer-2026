import { useState } from 'react'
import { FiSave, FiRotateCcw, FiX } from 'react-icons/fi'
import FormCard from '../../components/FormCard'

function ZamboniMaintenance() {
  const [form, setForm] = useState({ oilChange: 'Yes', tireCheck: 'No', bladeReplacement: 'No', hydraulicInspection: 'Yes', engineHours: '' })
  const [status, setStatus] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    setStatus('Zamboni maintenance record saved.')
  }

  const handleReset = () => {
    setForm({ oilChange: 'Yes', tireCheck: 'No', bladeReplacement: 'No', hydraulicInspection: 'Yes', engineHours: '' })
    setStatus('Form reset.')
  }

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <p className="eyebrow">Maintenance</p>
          <h2>Zamboni Maintenance</h2>
        </div>
      </div>
      <FormCard title="Machine upkeep log" description="Track service intervals for the zamboni fleet.">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Oil Change</span>
            <select value={form.oilChange} onChange={(event) => setForm({ ...form, oilChange: event.target.value })}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>
          <label className="field">
            <span>Tire Check</span>
            <select value={form.tireCheck} onChange={(event) => setForm({ ...form, tireCheck: event.target.value })}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>
          <label className="field">
            <span>Blade Replacement</span>
            <select value={form.bladeReplacement} onChange={(event) => setForm({ ...form, bladeReplacement: event.target.value })}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>
          <label className="field">
            <span>Hydraulic Inspection</span>
            <select value={form.hydraulicInspection} onChange={(event) => setForm({ ...form, hydraulicInspection: event.target.value })}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>
          <label className="field">
            <span>Engine Hours</span>
            <input value={form.engineHours} onChange={(event) => setForm({ ...form, engineHours: event.target.value })} />
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

export default ZamboniMaintenance
