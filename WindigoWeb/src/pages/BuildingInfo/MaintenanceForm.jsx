import { useState } from 'react'
import { FiSave, FiRotateCcw, FiX } from 'react-icons/fi'
import FormCard from '../../components/FormCard'

function MaintenanceForm() {
  const [form, setForm] = useState({ equipment: '', category: 'HVAC', priority: 'Medium', issue: '', assignedTo: '', status: 'Open', completionDate: '', notes: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')

  const validate = () => {
    const nextErrors = {}
    if (!form.equipment) nextErrors.equipment = 'Equipment is required.'
    if (!form.issue) nextErrors.issue = 'Issue description is required.'
    if (!form.assignedTo) nextErrors.assignedTo = 'Assigned to is required.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!validate()) {
      setStatus('Please correct the missing information.')
      return
    }
    setStatus('Maintenance request saved successfully.')
  }

  const handleReset = () => {
    setForm({ equipment: '', category: 'HVAC', priority: 'Medium', issue: '', assignedTo: '', status: 'Open', completionDate: '', notes: '' })
    setErrors({})
    setStatus('Form reset.')
  }

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <p className="eyebrow">Forms</p>
          <h2>Maintenance Form</h2>
        </div>
      </div>
      <FormCard title="Report maintenance work" description="Capture maintenance needs across the rink facility.">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Equipment</span>
            <input value={form.equipment} onChange={(event) => setForm({ ...form, equipment: event.target.value })} />
            {errors.equipment && <small>{errors.equipment}</small>}
          </label>
          <label className="field">
            <span>Category</span>
            <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
              <option value="HVAC">HVAC</option>
              <option value="Ice Maintenance">Ice Maintenance</option>
              <option value="Rink Maintenance">Rink Maintenance</option>
              <option value="Zamboni">Zamboni</option>
            </select>
          </label>
          <label className="field">
            <span>Priority</span>
            <select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </label>
          <label className="field">
            <span>Status</span>
            <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </label>
          <label className="field">
            <span>Assigned To</span>
            <input value={form.assignedTo} onChange={(event) => setForm({ ...form, assignedTo: event.target.value })} />
            {errors.assignedTo && <small>{errors.assignedTo}</small>}
          </label>
          <label className="field">
            <span>Completion Date</span>
            <input type="date" value={form.completionDate} onChange={(event) => setForm({ ...form, completionDate: event.target.value })} />
          </label>
          <label className="field field--full">
            <span>Issue Description</span>
            <textarea rows="4" value={form.issue} onChange={(event) => setForm({ ...form, issue: event.target.value })} />
            {errors.issue && <small>{errors.issue}</small>}
          </label>
          <label className="field field--full">
            <span>Notes</span>
            <textarea rows="4" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
          </label>
          {status && <p className={`status ${status.includes('success') ? 'status--success' : 'status--error'}`}>{status}</p>}
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

export default MaintenanceForm
