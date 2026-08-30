import { useEffect, useState } from 'react'
import { FiSave, FiRotateCcw, FiX } from 'react-icons/fi'
import FormCard from '../../../components/FormCard'
import {getGlycolMachine, addGlycolMachine} from '../../../data/api'

function GlycolMachineForm() {
  const [form, setForm] = useState({ 
    date: '',
    BeforePressureReturnPsi: '',
    BeforePressureOutPsi: '',
    BeforeMeasureLine: '',
    AfterPressureReturnPsi: '',
    AfterPressureOutPsi: '',
    AfterMeasureLine: '',
    GallonsAdded: '',
    Notes: '' 
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')

  const [readings, setReadings] = useState([])

  useEffect(() => {
    getGlycolMachine()
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
    if (form.BeforeMeasureLine == '') nextErrors.BeforeMeasureLine = 'Please Select a Line Measure.'
    if (form.AfterMeasureLine == '') nextErrors.AfterMeasureLine = 'Please Select a Line Measure.'
    if (!form.BeforeMeasureLine) nextErrors.BeforeMeasureLine = 'Value is Required.'
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
        glycolMachineDate: form.date,
        beforePressureReturnPsi: Number(form.BeforePressureReturnPsi),
        beforePressureOutPsi: Number(form.BeforePressureOutPsi),
        beforeMeasureLine: form.BeforeMeasureLine,
        afterPressureReturnPsi: Number(form.AfterPressureReturnPsi),
        afterPressureOutPsi: Number(form.AfterPressureOutPsi),
        afterMeasureLine: form.AfterMeasureLine,
        gallonsAdded: Number(form.GallonsAdded),
        notes: form.Notes.trim() === '' ? null : form.Notes.trim(),
      }

      const saveReading = await addGlycolMachine(newReading)

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
    setForm({
      date: '',
      BeforePressureReturnPsi: '',
      BeforePressureOutPsi: '',
      BeforeMeasureLine: '',
      AfterPressureReturnPsi: '',
      AfterPressureOutPsi: '',
      AfterMeasureLine: '',
      GallonsAdded: '',
      Notes: ''
    })
    setErrors({})
    setStatus('Form reset.')
  }

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <p className="eyebrow">Forms</p>
          <h2>Glycol machine entry</h2>
        </div>
      </div>
      <FormCard title="Glycol machine entry" description="Record glycol system pressures, line level, and glycol added.">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Date</span>
            <input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} />
            {errors.date && <small>{errors.date}</small>}
          </label>
          <label className='field'>
            <span>Before Pressure Return Psi</span>
            <input type='number' value={form.BeforePressureReturnPsi} onChange={(event) => setForm({...form, BeforePressureReturnPsi: event.target.value})}/>
          </label>
          <label className='field'>
            <span>Before Pressure Out Psi</span>
            <input type='number' value={form.BeforePressureOutPsi} onChange={(event) => setForm({...form, BeforePressureOutPsi: event.target.value})}/>
          </label>
          <label className='field'>
            <span>Before Measure Line</span>
            <select value={form.BeforeMeasureLine} onChange={(event) => setForm({...form, BeforeMeasureLine: event.target.value})}>
              <option value="">Select position</option>
              <option value="Above">Above</option>
              <option value="At">At</option>
              <option value="Below">Below</option>
            </select>
            {errors.BeforeMeasureLine && <small>{errors.BeforeMeasureLine}</small>}
          </label>
          <label className='field'>
            <span>After Pressure Return Psi</span>
            <input type='number' value={form.AfterPressureReturnPsi} onChange={(event) => setForm({...form, AfterPressureReturnPsi: event.target.value})}/>
          </label>
          <label className='field'>
            <span>After Pressure Out Psi</span>
            <input type='number' value={form.AfterPressureOutPsi} onChange={(event) => setForm({...form, AfterPressureOutPsi: event.target.value})}/>
          </label>
          <label className='field'>
            <span>After Measure Line</span>
            <select value={form.AfterMeasureLine} onChange={(event) => setForm({...form, AfterMeasureLine: event.target.value})}>
              <option value="">Select position</option>
              <option value="Above">Above</option>
              <option value="At">At</option>
              <option value="Below">Below</option>
            </select>
          </label>
          <label className='field'>
            <span>Gallons Added</span>
            <input type='number' value={form.GallonsAdded} onChange={(event) => setForm({...form, GallonsAdded: event.target.value})}/>
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
    </div>
  )
}

export default GlycolMachineForm
