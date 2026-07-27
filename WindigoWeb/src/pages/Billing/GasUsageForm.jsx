import { useState } from 'react'
import { FiSave, FiRotateCcw, FiX } from 'react-icons/fi'
import FormCard from '../../components/FormCard'

function GasUsageForm() {
  const [form, setForm] = useState({ billingMonth: '', meterReading: '', totalTherms: '', cost: '', supplier: '', notes: '' })
  const [status, setStatus] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    setStatus('Gas usage submitted successfully.')
  }

  const handleReset = () => {
    setForm({ billingMonth: '', meterReading: '', totalTherms: '', cost: '', supplier: '', notes: '' })
    setStatus('Form reset.')
  }

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <p className="eyebrow">Billing</p>
          <h2>Gas Usage Form</h2>
        </div>
      </div>
      <FormCard title="Gas usage entry" description="Record new monthly gas consumption for the facility.">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Billing Month</span>
            <input type="month" value={form.billingMonth} onChange={(event) => setForm({ ...form, billingMonth: event.target.value })} />
          </label>
          <label className="field">
            <span>Meter Reading</span>
            <input value={form.meterReading} onChange={(event) => setForm({ ...form, meterReading: event.target.value })} />
          </label>
          <label className="field">
            <span>Total Therms</span>
            <input value={form.totalTherms} onChange={(event) => setForm({ ...form, totalTherms: event.target.value })} />
          </label>
          <label className="field">
            <span>Cost</span>
            <input value={form.cost} onChange={(event) => setForm({ ...form, cost: event.target.value })} />
          </label>
          <label className="field">
            <span>Supplier</span>
            <input value={form.supplier} onChange={(event) => setForm({ ...form, supplier: event.target.value })} />
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

export default GasUsageForm
