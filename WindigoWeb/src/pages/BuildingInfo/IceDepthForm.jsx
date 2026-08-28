import { useEffect, useState } from 'react'
import { FiSave, FiRotateCcw, FiX } from 'react-icons/fi'
import FormCard from '../../components/FormCard'
import { getIceDepthReadings, addIceDepthReadings } from '../../data/api'

function IceDepthForm() {
  const [form, setForm] = useState({date: ''})
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')

  const [readings, setReadings] = useState([])
  const [depths, setDepths] = useState(Array(16).fill(''))
  
    useEffect(() => {
      getIceDepthReadings()
        .then((data) => {
          console.log('Ice data:', data)
          setReadings(data)
        })
      .catch((error) => {
          console.error('Failed to retrieve rink readings:', error)
        })
    }, [])

  const validate = () => {
    const nextErrors = {}
    if (!form.date) nextErrors.date = 'Date is required.'
    depths.forEach((depth, index) => {
      if (!depth.trim()) {
        nextErrors[`zone${index + 1}`] = 'Ice depth is required.'
      }
      else if (fractionToDecimal(depth) === null) {
        nextErrors[`zone${index + 1}`] =
        'Enter a valid fraction or decimal.'
      }
    })
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) {
      setStatus('Please correct the highlighted fields.')
      return
    }
    try {
      const newReading = depths.map((depth, index) => ({
        readingDate: form.date,
        zoneId: index + 1,
        iceDepth: fractionToDecimal(depth)
      }))

      const saveReading = await addIceDepthReadings(newReading)

      setReadings((Current) => [
        ...saveReading, ...Current
      ])
      setStatus('Reading saved successfully.')
    }
    catch (error) {
      console.error('Failed to save reading:', error)
      setStatus('Failed to save reading.')
    }
  }

  function fractionToDecimal(value) {
    if (!value || !value.trim()){
      return null
    }

    const input = value.trim()

    // Mixed fraction: "1 1/2"
    if (input.includes(' ')){
      const parts = input.split(/\s+/)

      if (parts.length !== 2) {
        return null
      }

      const whole = Number(parts[0])

      const [numerator, denominator] = parts[1].split('/').map(Number)

      if (
        Number.isNaN(whole) ||
        Number.isNaN(numerator) ||
        Number.isNaN(denominator) ||
        denominator === 0) 
      {
        return null
      }

      return whole + (numerator / denominator)
    }

    // Simple fraction: "3/4"
    if (input.includes('/')) {
      const [numerator, denominator] = input.split('/').map(Number)

      if (
        Number.isNaN(numerator) ||
        Number.isNaN(denominator) ||
        denominator === 0) {
        return null
      }

      return numerator / denominator
    }

    // Already decimal: "1.5"
    const decimal = Number(input)

    return Number.isNaN(decimal) ? null : decimal
  }

  const handleReset = () => {
    setForm({ date: '', location: '', thickness: ''})
    setDepths(Array(16).fill(''))
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
          <div className="ice-depth-grid">
            {depths.map((depth, index) => {
              const decimal = fractionToDecimal(depth)
              return(
                <label className='field' key={index}>
                  <span>Zone {index + 1}</span>
                  <input 
                    type='text' 
                    placeholder='Example: 1 1/2'
                    value={depth}
                    onChange={(event) => {
                      const newDepths = [...depths]
                      newDepths[index] = event.target.value
                      setDepths(newDepths)
                    }}/>
                      {decimal !== null && (
                        <small>Decimal: {decimal.toFixed(3)}</small>
                      )}
                </label>
              )
            })}
          </div>
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
