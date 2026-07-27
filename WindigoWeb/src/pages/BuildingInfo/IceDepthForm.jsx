import { useState } from 'react'
import { FiSave, FiRotateCcw, FiX } from 'react-icons/fi'
import FormCard from '../../components/FormCard'

function IceDepthForm() {
  const [form, setForm] = useState({ date: '', time: '', employee: '', location: '', thickness: '', comments: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')

  const validate = () => {
    const nextErrors = {}
    if (!form.date) nextErrors.date = 'Date is required.'
    if (!form.time) nextErrors.time = 'Time is required.'
    if (!form.employee) nextErrors.employee = 'Employee is required.'
    if (!form.location) nextErrors.location = 'Location is required.'
    if (!form.thickness) nextErrors.thickness = 'Ice thickness is required.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!validate()) {
      setStatus('Please correct the highlighted fields.')
      return
    }
    setStatus('Ice depth saved successfully.')
  }

  const handleReset = () => {
    setForm({ date: '', time: '', employee: '', location: '', thickness: '', comments: '' })
    setErrors({})
    setStatus('Form reset.')
  }

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <p className="eyebrow">Forms</p>
          <h2>Ice Depth Form</h2>
        </div>
      </div>
      <FormCard title="Record surface depth" description="Capture the latest ice measurements for rink operations.">
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
            <span>Employee</span>
            <input value={form.employee} onChange={(event) => setForm({ ...form, employee: event.target.value })} />
            {errors.employee && <small>{errors.employee}</small>}
          </label>
          <label className="field">
            <span>Location</span>
            <input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} />
            {errors.location && <small>{errors.location}</small>}
          </label>
          <label className="field">
            <span>Ice Thickness</span>
            <input value={form.thickness} onChange={(event) => setForm({ ...form, thickness: event.target.value })} />
            {errors.thickness && <small>{errors.thickness}</small>}
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
    </div>
  )
}

export default IceDepthForm
