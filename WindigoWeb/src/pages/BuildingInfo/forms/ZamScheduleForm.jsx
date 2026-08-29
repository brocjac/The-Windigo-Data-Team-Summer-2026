import { useEffect, useState } from 'react'
import { FiSave, FiRotateCcw } from 'react-icons/fi'
import FormCard from '../../../components/FormCard'
import {
  getZambonis,
  getZamSchedule,
  addZamSchedule
} from '../../../data/api'

function ZamScheduleForm() {
  const [zambonis, setZambonis] = useState([])
  const [schedules, setSchedules] = useState([])
  const [status, setStatus] = useState('')
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    date: '',
    zamboniId: '',
    workerId: '',
    notes: ''
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          zamboniData,
          scheduleData
        ] = await Promise.all([
          getZambonis(),
          getZamSchedule()
        ])

        setZambonis(zamboniData)
        setSchedules(scheduleData)
      }
      catch (error) {
        console.error(
          'Failed to load Zamboni schedule data:',
          error
        )

        setStatus('Failed to load schedule data.')
      }
    }

    loadData()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value
    }))
  }

  const validate = () => {
    const newErrors = {}

    if (!form.date) {
      newErrors.date = 'Schedule date is required.'
    }

    if (!form.zamboniId) {
      newErrors.zamboniId = 'Please select a Zamboni.'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validate()) {
      setStatus('Please enter the required information.')
      return
    }

    try {
      const newSchedule = {
        zamScheduleDate: form.date,

        notes:
          form.notes.trim() === ''
            ? null
            : form.notes.trim(),

        zamboniId: Number(form.zamboniId),

        workerId:
          form.workerId === ''
            ? null
            : Number(form.workerId)
      }

      const savedSchedule =
        await addZamSchedule(newSchedule)

      setSchedules((current) => [
        savedSchedule,
        ...current
      ])

      setStatus('Zamboni schedule saved successfully.')

      resetForm()
    }
    catch (error) {
      console.error(
        'Failed to save Zamboni schedule:',
        error
      )

      setStatus('Failed to save Zamboni schedule.')
    }
  }

  const resetForm = () => {
    setForm({
      date: '',
      zamboniId: '',
      workerId: '',
      notes: ''
    })

    setErrors({})
    setStatus('')
  }

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <p className="eyebrow">Forms</p>
          <h2>Zamboni Schedule Form</h2>
        </div>
      </div>

      <FormCard
        title="Zamboni Schedule"
        description="Assign a Zamboni and worker to a schedule date."
      >
        <form
          className="form-grid"
          onSubmit={handleSubmit}
        >
          <label className="field">
            <span>Date</span>

            <input type="date" name="date" value={form.date} onChange={handleChange}/>

            {errors.date && (
              <small>{errors.date}</small>
            )}
          </label>

          <label className="field">
            <span>Zamboni</span>

            <select
              name="zamboniId"
              value={form.zamboniId}
              onChange={handleChange}
            >
              <option value="">
                Select Zamboni
              </option>

              {zambonis.map((zam) => (
                <option
                  key={zam.zamboniId}
                  value={zam.zamboniId}
                >
                  {zam.zamboni1}
                </option>
              ))}
            </select>

            {errors.zamboniId && (
              <small>{errors.zamboniId}</small>
            )}
          </label>

          <label className="field">
            <span>Notes</span>

            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
            />
          </label>

          {status && (
            <p
              className={`status ${
                status.includes('success')
                  ? 'status--success'
                  : 'status--error'
              }`}
            >
              {status}
            </p>
          )}

          <div className="form-actions">
            <button
              className="button button--primary"
              type="submit"
            >
              <FiSave /> Save
            </button>

            <button
              className="button button--secondary"
              type="button"
              onClick={resetForm}
            >
              <FiRotateCcw /> Reset
            </button>
          </div>
        </form>
      </FormCard>
    </div>
  )
}

export default ZamScheduleForm