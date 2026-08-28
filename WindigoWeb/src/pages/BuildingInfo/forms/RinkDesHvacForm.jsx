import { useState } from 'react'
import { FiSave, FiRotateCcw, FiX } from 'react-icons/fi'
import FormCard from '../../../components/FormCard'
import {getRinkDesHvacFilter, addRinkDesHvacFilter} from '../../../data/api'

function RinkHvacFilter() {
  const [form, setForm] = useState({
    ChangeDate: '',

    _24x24Changed: 'No',
    _24x24Mode: 'none',
    _24x24Amount: '',

    _20x20Changed: 'No',
    _20x20Mode: 'none',
    _20x20Amount: '',

    _18x24Changed: 'No',
    _18x24Mode: 'none',
    _18x24Amount: '',

    Notes: ''
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)

  const validate = () => {
    const nextErrors = {}
    if (!form.ChangeDate) nextErrors.ChangeDate = 'Date is required.'

    if (form._24x24Mode !== 'none' && form._24x24Amount === '') nextErrors._24x24Amount = 'Enter an inventory amount.'
    if (form._20x20Mode !== 'none' && form._20x20Amount === '') nextErrors._20x20Amount = 'Enter an inventory amount.'
    if (form._18x24Mode !== 'none' && form._18x24Amount === '') nextErrors._18x24Amount = 'Enter an inventory amount.'

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
        rinkChangeDate: form.ChangeDate,
        changed20x20: form._20x20Changed,
        changed24x24: form._24x24Changed,
        changed18x24: form._18x24Changed,
        inventory20x20Amount: Number(form._20x20Amount || 0),
        inventory20x20Mode: form._20x20Mode,
        inventory24x24Amount: Number(form._24x24Amount || 0),
        inventory24x24Mode: form._24x24Mode,
        inventory18x24Amount: Number(form._18x24Amount || 0),
        inventory18x24Mode: form._18x24Mode,
        notes: form.Notes.trim() === '' ? null : form.Notes.trim()
      }

      console.log('Sending Rink HVAC:', record)

      const savedRecord = await addRinkDesHvacFilter(record)

      console.log('Saved Rink HVAC:', savedRecord)
      
      // Reset after successful save
      setForm({
        ChangeDate: '',

        _20x20Changed: 'No',
        _20x20Mode: 'none',
        _20x20Amount: '',

        _24x24Changed: 'No',
        _24x24Mode: 'none',
        _24x24Amount: '',

        _18x24Changed: 'No',
        _18x24Mode: 'none',
        _18x24Amount: '',

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

            _24x24Changed: 'No',
            _24x24Mode: 'none',
            _24x24Amount: '',

            _18x24Changed: 'No',
            _18x24Mode: 'none',
            _18x24Amount: '',

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
      <FormCard title="Rink HVAC Filters" description="Record filter changes and update filter inventory.">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Date</span>
            <input type="date" value={form.ChangeDate} onChange={(event) => setForm({ ...form, ChangeDate: event.target.value })} />
            {errors.ChangeDate && (<small>{errors.ChangeDate}</small>)}
          </label>

          {/* ===================== */}
          {/* 24x24 */}
          {/* ===================== */}
          <div className='groupField'>
            <label className="field">
              <span>24x24 Filter Changed?</span>
              <select value={form._24x24Changed === 'Fixed + Changed' ? 'Fixed' : form._24x24Changed} onChange={(event) => setForm({ ...form, _24x24Changed: event.target.value })}>
                <option value='No'>No</option>
                <option value='Yes'>Yes</option>
                <option value='Down'>Down</option>
                <option value='Fixed'>Fixed</option>
              </select>
            </label>
            {(form._24x24Changed === 'Fixed' || form._24x24Changed === 'Fixed + Changed') && (
              <label className='field'>
                <span>Was Filter Changed?</span>
                <select value={form._24x24Changed === 'Fixed + Changed' ? 'Yes' : 'No'} onChange={
                  (event) => setForm({
                    ...form, _24x24Changed: event.target.value === 'Yes' ? 'Fixed + Changed' : 'Fixed'
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
                <select value={form._24x24Mode} onChange={(event) => setForm({...form, _24x24Mode: event.target.value})}>
                    <option value="none">No Inventory Change</option>
                    <option value="add">Add to Current Inventory</option>
                    <option value="set">Set Exact Inventory</option>
                </select>
              </label>
              {form._24x24Mode !== 'none' && (
                <label className='field'>
                    <span>
                      {form._24x24Mode === 'add'
                        ? 'Amount Received'
                        : 'Exact Inventory Amount'
                      }
                    </span>
                    <input type='number' min='0' value={form._24x24Amount} onChange={(event) => setForm({...form, _24x24Amount: event.target.value})}/>
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
          {/* 18x24 */}
          {/* ===================== */}
          <div className='groupField'>
            <label className="field">
              <span>18x24 Filter Changed?</span>
              <select value={form._18x24Changed === 'Fixed + Changed' ? 'Fixed' : form._18x24Changed} onChange={(event) => setForm({ ...form, _18x24Changed: event.target.value })}>
                <option value='No'>No</option>
                <option value='Yes'>Yes</option>
                <option value='Down'>Down</option>
                <option value='Fixed'>Fixed</option>
              </select>
            </label>
            {(form._18x24Changed === 'Fixed' || form._18x24Changed === 'Fixed + Changed') && (
              <label className='field'>
                <span>Was Filter Changed?</span>
                <select value={form._18x24Changed === 'Fixed + Changed' ? 'Yes' : 'No'} onChange={
                  (event) => setForm({
                    ...form, _18x24Changed: event.target.value === 'Yes' ? 'Fixed + Changed' : 'Fixed'
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
                <select value={form._18x24Mode} onChange={(event) => setForm({...form, _18x24Mode: event.target.value})}>
                    <option value="none">No Inventory Change</option>
                    <option value="add">Add to Current Inventory</option>
                    <option value="set">Set Exact Inventory</option>
                </select>
              </label>
              {form._18x24Mode !== 'none' && (
                <label className='field'>
                    <span>
                      {form._18x24Mode === 'add'
                        ? 'Amount Received'
                        : 'Exact Inventory Amount'
                      }
                    </span>
                    <input type='number' min='0' value={form._18x24Amount} onChange={(event) => setForm({...form, _18x24Amount: event.target.value})}/>
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

export default RinkHvacFilter
