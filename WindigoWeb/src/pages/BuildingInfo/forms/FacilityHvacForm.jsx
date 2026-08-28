import { useState } from 'react'
import { FiSave, FiRotateCcw, FiX } from 'react-icons/fi'
import FormCard from '../../../components/FormCard'
import {getFacilityHvacFilter, addFacilityHvacFilter} from '../../../data/api'

function FacilityHvacFilter() {
  const [form, setForm] = useState({
    ChangeDate: '',

    _20x25Changed: 'No',
    _20x25Mode: 'none',
    _20x25Amount: '',

    _20x20Changed: 'No',
    _20x20Mode: 'none',
    _20x20Amount: '',

    _16x22Changed: 'No',
    _16x22Mode: 'none',
    _16x22Amount: '',

    Notes: ''
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)

  const validate = () => {
    const nextErrors = {}
    if (!form.ChangeDate) nextErrors.ChangeDate = 'Date is required.'

    if (form._20x25Mode !== 'none' && form._20x25Amount === '') nextErrors._20x25Amount = 'Enter an inventory amount.'
    if (form._20x20Mode !== 'none' && form._20x20Amount === '') nextErrors._20x20Amount = 'Enter an inventory amount.'
    if (form._16x22Mode !== 'none' && form._16x22Amount === '') nextErrors._16x22Amount = 'Enter an inventory amount.'

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
        setSaving(true)
        setStatus('')
      const record = {
        facilityChangeDate: form.ChangeDate,
        changed20x20: form._20x20Changed,
        changed20x25: form._20x25Changed,
        changed16x22: form._16x22Changed,
        inventory20x20Amount: Number(form._20x20Amount || 0),
        inventory20x20Mode: form._20x20Mode,
        inventory20x25Amount: Number(form._20x25Amount || 0),
        inventory20x25Mode: form._20x25Mode,
        inventory16x22Amount: Number(form._16x22Amount || 0),
        inventory16x22Mode: form._16x22Mode,
        notes: form.Notes.trim() === '' ? null : form.Notes.trim()
      }

      console.log('Sending Facility HVAC:', record)

      const savedRecord = await addFacilityHvacFilter(record)

      console.log('Saved Facility HVAC:', savedRecord)
      
      // Reset after successful save
      setForm({
        ChangeDate: '',

        _20x20Changed: 'No',
        _20x20Mode: 'none',
        _20x20Amount: '',

        _20x25Changed: 'No',
        _20x25Mode: 'none',
        _20x25Amount: '',

        _16x22Changed: 'No',
        _16x22Mode: 'none',
        _16x22Amount: '',

        Notes: ''
      })

      setErrors({})
    }
    catch (error) {
      console.error('Failed to save record:', error)
      setStatus('Failed to save reading.')
    }
    finally {
      setSaving(false)
    }
  }
    const handleReset = () => {
        setForm({
            ChangeDate: '',

            _20x20Changed: 'No',
            _20x20Mode: 'none',
            _20x20Amount: '',

            _20x25Changed: 'No',
            _20x25Mode: 'none',
            _20x25Amount: '',

            _16x22Changed: 'No',
            _16x22Mode: 'none',
            _16x22Amount: '',

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
          <h2>Rink Temperature Form</h2>
        </div>
      </div>
      <FormCard title="Facility HVAC Filters" description="Record filter changes and update filter inventory.">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Date</span>
            <input type="date" value={form.ChangeDate} onChange={(event) => setForm({ ...form, ChangeDate: event.target.value })} />
            {errors.ChangeDate && (<small>{errors.ChangeDate}</small>)}
          </label>

          {/* ===================== */}
          {/* 20x25 */}
          {/* ===================== */}
          <div className='groupField'>
            <label className="field">
              <span>20x25 Filter Changed?</span>
              <select value={form._20x25Changed === 'Fixed + Changed' ? 'Fixed' : form._20x25Changed} onChange={(event) => setForm({ ...form, _20x25Changed: event.target.value })}>
                <option value='No'>No</option>
                <option value='Yes'>Yes</option>
                <option value='Down'>Down</option>
                <option value='Fixed'>Fixed</option>
              </select>
            </label>
            {(form._20x25Changed === 'Fixed' || form._20x25Changed === 'Fixed + Changed') && (
              <label className='field'>
                <span>Was Filter Changed?</span>
                <select value={form._20x25Changed === 'Fixed + Changed' ? 'Yes' : 'No'} onChange={
                  (event) => setForm({
                    ...form, _20x25Changed: event.target.value === 'Yes' ? 'Fixed + Changed' : 'Fixed'
                    })
                  }>
                  <option value='No'>No</option>
                  <option value='Yes'>Yes</option>
                </select>
              </label>
            )}
            <label className='field'>
              <label className='field'>
                <span>Inventory Action</span>
                <select value={form._20x25Mode} onChange={(event) => setForm({...form, _20x25Mode: event.target.value})}>
                    <option value="none">No Inventory Change</option>
                    <option value="add">Add to Current Inventory</option>
                    <option value="set">Set Exact Inventory</option>
                </select>
              </label>
              {form._20x25Mode !== 'none' && (
                <label className='field'>
                    <span>
                      {form._20x25Mode === 'add'
                        ? 'Amount Received'
                        : 'Exact Inventory Amount'
                      }
                    </span>
                    <input type='number' min='0' value={form._20x25Amount} onChange={(event) => setForm({...form, _20x25Amount: event.target.value})}/>
                </label>
              )}
            </label>
          </div>

          {/* ===================== */}
          {/* 20x20 */}
          {/* ===================== */}
          <div className='groupField'>
            <label className="field">
              <span>20x20 Filter Changed?</span>
              <select value={form._20x20Changed === 'Fixed + Changed' ? 'Fixed' : form._20x20Changed} onChange={(event) => setForm({ ...form, _20x20Changed: event.target.value })}>
                <option value='No'>No</option>
                <option value='Yes'>Yes</option>
                <option value='Down'>Down</option>
                <option value='Fixed'>Fixed</option>
              </select>
            </label>
            {(form._20x20Changed === 'Fixed' || form._20x20Changed === 'Fixed + Changed') && (
              <label className='field'>
                <span>Was Filter Changed?</span>
                <select value={form._20x20Changed === 'Fixed + Changed' ? 'Yes' : 'No'} onChange={
                  (event) => setForm({
                    ...form, _20x20Changed: event.target.value === 'Yes' ? 'Fixed + Changed' : 'Fixed'
                    })
                  }>
                  <option value='No'>No</option>
                  <option value='Yes'>Yes</option>
                </select>
              </label>
            )}
            <label className='field'>
              <label className='field'>
                <span>Inventory Action</span>
                <select value={form._20x20Mode} onChange={(event) => setForm({...form, _20x20Mode: event.target.value})}>
                    <option value="none">No Inventory Change</option>
                    <option value="add">Add to Current Inventory</option>
                    <option value="set">Set Exact Inventory</option>
                </select>
              </label>
              {form._20x20Mode !== 'none' && (
                <label className='field'>
                    <span>
                      {form._20x20Mode === 'add'
                        ? 'Amount Received'
                        : 'Exact Inventory Amount'
                      }
                    </span>
                    <input type='number' min='0' value={form._20x20Amount} onChange={(event) => setForm({...form, _20x20Amount: event.target.value})}/>
                </label>
              )}
            </label>
          </div>

          {/* ===================== */}
          {/* 16x22 */}
          {/* ===================== */}
          <div className='groupField'>
            <label className="field">
              <span>16x22 Filter Changed?</span>
              <select value={form._16x22Changed === 'Fixed + Changed' ? 'Fixed' : form._16x22Changed} onChange={(event) => setForm({ ...form, _16x22Changed: event.target.value })}>
                <option value='No'>No</option>
                <option value='Yes'>Yes</option>
                <option value='Down'>Down</option>
                <option value='Fixed'>Fixed</option>
              </select>
            </label>
            {(form._16x22Changed === 'Fixed' || form._16x22Changed === 'Fixed + Changed') && (
              <label className='field'>
                <span>Was Filter Changed?</span>
                <select value={form._16x22Changed === 'Fixed + Changed' ? 'Yes' : 'No'} onChange={
                  (event) => setForm({
                    ...form, _16x22Changed: event.target.value === 'Yes' ? 'Fixed + Changed' : 'Fixed'
                    })
                  }>
                  <option value='No'>No</option>
                  <option value='Yes'>Yes</option>
                </select>
              </label>
            )}
            <label className='field'>
              <label className='field'>
                <span>Inventory Action</span>
                <select value={form._16x22Mode} onChange={(event) => setForm({...form, _16x22Mode: event.target.value})}>
                    <option value="none">No Inventory Change</option>
                    <option value="add">Add to Current Inventory</option>
                    <option value="set">Set Exact Inventory</option>
                </select>
              </label>
              {form._16x22Mode !== 'none' && (
                <label className='field'>
                    <span>
                      {form._16x22Mode === 'add'
                        ? 'Amount Received'
                        : 'Exact Inventory Amount'
                      }
                    </span>
                    <input type='number' min='0' value={form._16x22Amount} onChange={(event) => setForm({...form, _16x22Amount: event.target.value})}/>
                </label>
              )}
            </label>
          </div>
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

export default FacilityHvacFilter
