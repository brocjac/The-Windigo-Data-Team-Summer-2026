import { useState } from 'react'
import { FiSave, FiRotateCcw, FiX } from 'react-icons/fi'
import FormCard from '../../components/FormCard'

function HVACMaintenance() {
  const [form, setForm] = useState({ equipment: '', inspectionDate: '', filterReplacement: 'Yes', repairNeeded: 'No', notes: '' })
  const [status, setStatus] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    setStatus('HVAC inspection saved.')
  }

  const handleReset = () => {
    setForm({ equipment: '', inspectionDate: '', filterReplacement: 'Yes', repairNeeded: 'No', notes: '' })
    setStatus('Form reset.')
  }

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <p className="eyebrow">Maintenance</p>
          <h2>HVAC Maintenance</h2>
        </div>
      </div>
      <FormCard title="HVAC service record" description="Track inspections, filter work, and repair needs.">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Equipment</span>
            <input value={form.equipment} onChange={(event) => setForm({ ...form, equipment: event.target.value })} />
          </label>
          <label className="field">
            <span>Inspection Date</span>
            <input type="date" value={form.inspectionDate} onChange={(event) => setForm({ ...form, inspectionDate: event.target.value })} />
          </label>
          <label className="field">
            <span>Filter Replacement</span>
            <select value={form.filterReplacement} onChange={(event) => setForm({ ...form, filterReplacement: event.target.value })}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>
          <label className="field">
            <span>Repair Needed</span>
            <select value={form.repairNeeded} onChange={(event) => setForm({ ...form, repairNeeded: event.target.value })}>
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

export default HVACMaintenance
