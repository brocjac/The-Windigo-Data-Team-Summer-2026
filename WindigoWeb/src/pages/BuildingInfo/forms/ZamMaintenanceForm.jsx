import { useEffect, useState } from 'react'
import { FiSave, FiRotateCcw, FiX } from 'react-icons/fi'
import FormCard from '../../../components/FormCard'
import { 
  getZambonis, 
  getMaintenanceCategory, 
  getMaintenanceChecks, 
  getZamMaintenance,
  addZamMaintenance
} from '../../../data/api'

function ZamMaintenanceForm() {
  const [status, setStatus] = useState('')
  const [zambonis, setZambonis] = useState([])
  const [categories, setCategories] = useState([])
  const [checks, setChecks] = useState([])
  const [readings, setReadings] = useState([])
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    date: '',
    workerId: '',
    zambonis: [
      {
        zamboniId: '',
        bladeInventory: '',
        bladeWidth: '',
        notes: '',
        maintenanceSearch: '',
        maintenanceItemIds: []
      }
    ]
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          zamboniData,
          categoryData,
          checkData,
          maintenanceData
        ] = await Promise.all([
          getZambonis(),
          getMaintenanceCategory(),
          getMaintenanceChecks(),
          getZamMaintenance()
        ])
        setZambonis(zamboniData)
        setCategories(categoryData)
        setChecks(checkData)
        setReadings(maintenanceData)
      }
      catch (error) {
        console.error('Failed to load Zamboni maintenance data:', error)
        setStatus('Failed to load maintenance data.')
      }
    }
    loadData()
  }, [])

  const updateZamboni = (index, field, value) => {
    setForm((current) => ({
      ...current,
      zambonis: current.zambonis.map((zam, i) =>
        i === index ? {...zam, [field]: value} : zam
      )
    }))
  }

  const removeZamboni = (index) => {
  setForm((current) => ({
    ...current,
    zambonis: current.zambonis.filter(
      (_, i) => i !== index
    )
  }))
}

  const validate = () => {

    const newErrors = {}

    if (!form.date) {
      newErrors.date = 'Maintenance date is required.'
    }

    form.zambonis.forEach((zam, index) => {
      if (!zam.zamboniId) {
        newErrors[`zamboni-${index}`] =
          'Please select a Zamboni.'
      }

      if (zam.bladeInventory === '') {
        newErrors[`bladeInventory-${index}`] =
          'Blade inventory is required.'
      }

      if (zam.maintenanceItemIds.length === 0) {
        newErrors[`maintenance-${index}`] =
          'Select at least one maintenance item.'
      }
    })

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const addMaintenanceItem = (index) => {
    const zam = form.zambonis[index]
    const selectedCheck = checks.find(
        (check) =>
            check.checksAndRepairs === zam.maintenanceSearch
    )

    if (!selectedCheck) {
        setStatus('Please select a valid maintenance item.')
        return
    }

    const selectedId =
        selectedCheck.maintenanceChecksAndRepairsId

    if (zam.maintenanceItemIds.includes(selectedId)) {
        setStatus('That maintenance item is already selected.')
        return
    }

    setForm((current) => ({
        ...current,

        zambonis: current.zambonis.map((item, i) =>
          i === index ? {
            ...item,
            maintenanceSearch: '',
            maintenanceItemIds: [
              ...item.maintenanceItemIds,
              selectedId
            ]
          } : item
        )
    }))

    setStatus('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validate()) {
      setStatus('Please enter the required information and select at least one maintenance item.')
      return
    }

    try {
      const newReading = form.zambonis.map((zam) => ({
        zamMaintenanceDate: form.date,
        notes: zam.notes.trim() === '' ? null : zam.notes.trim(),
        bladeInventory: Number(zam.bladeInventory),
        bladeWidth: zam.bladeWidth === '' ? null : Number(zam.bladeWidth),
        zamboniId: Number(zam.zamboniId),
        maintenanceItemIds: zam.maintenanceItemIds
      }))
      const savedReading = await addZamMaintenance(newReading)
      setReadings((current) => [
        ...savedReading,
        ...current
      ])
      setStatus('Zamboni maintenance saved successfully.')

      resetForm()
    }
    catch (error) {
      console.error('Failed to save Zamboni maintenance:', error)
      setStatus('Failed to save Zamboni maintenance.')
    }
  }

  const removeMaintenanceItem = (index, id) => {
    setForm((current) => ({
      ...current,
      zambonis: current.zambonis.map((zam, i) =>
        i === index
          ? {
              ...zam,
              maintenanceItemIds:
                zam.maintenanceItemIds.filter(
                  (itemId) => itemId !== id
                )
            }
          : zam
      )
    }))
  }

  const resetForm = () => {
    setForm({
      date: '',
      workerId: '',

      zambonis: [
        {
          zamboniId: '',
          bladeInventory: '',
          bladeWidth: '',
          notes: '',
          maintenanceSearch: '',
          maintenanceItemIds: []
        }
      ]
    })

    setErrors({})
    setStatus('')
  }
  return(
    <div className="page">
      <div className="page__header">
        <div>
          <p className="eyebrow">Forms</p>
          <h2>Zamboni Maintenance Form</h2>
        </div>
      </div>
      <FormCard title="Zamboni Maintenance" description="Record all maintenance done on the zamboni.">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Date</span>
            <input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} />
            {errors.date && (<small>{errors.date}</small>)}
          </label>
          {form.zambonis.map((zam, index) => (
            <div className='groupField' key={index}>
              <h3>Zamboni {index + 1}</h3>
              {/* Zambonis */}
                <label className="field">
                  <span>Zamboni</span>
                  <select id='zamboniId' name='zamboniId' value={zam.zamboniId} onChange={(event) => {
                    const value = event.target.value

                    setForm((current) => ({
                      ...current,
                      zambonis: current.zambonis.map((item, i) => 
                        i === index ? {...item, zamboniId:value} : item
                      )
                    }))
                  }}>
                    <option value=''>Select Zamboni</option>
                    {zambonis.map((zam) => (
                      <option key={zam.zamboniId} value={zam.zamboniId}>{zam.zamboni1}</option>
                    ))}
                  </select>
                </label>

              {/* Maintenance Checks & Repairs */}
              <div className="maintenance-checks">
                <h3>Maintenance Checks & Repairs</h3>
                <input 
                  id='maintenanceSearch' 
                  list={`maintenance-options-${index}`} 
                  placeholder='Search maintenance item...'
                  value={zam.maintenanceSearch}
                  onChange={(event)=> 
                    updateZamboni(
                    index, 'maintenanceSearch', event.target.value
                    )
                  }/>

                  <button type='button' onClick={() => addMaintenanceItem(index)}>Add</button>

                  <datalist id={`maintenance-options-${index}`}>
                    {checks.map((check) => (
                      <option key={check.maintenanceChecksAndRepairsId} value={check.checksAndRepairs}/>
                    ))}
                  </datalist>
              </div>

              <div className="selected-maintenance-items">
                {zam.maintenanceItemIds.map((id) => {
                  const check = checks.find(
                    (item) => item.maintenanceChecksAndRepairsId === id
                  )
                  if (!check) {
                    return null
                  }
                  return (
                    <div key={id} className='selected-maintenance-item'>
                      <span>{check.checksAndRepairs}</span>
                      <button type='button' onClick={() => removeMaintenanceItem(index, id)}>Remove</button>
                    </div>
                  )
                })}
              </div>

              {/* Blade Width */}
              <label className='field'>
                <span>Blade Width</span>
                <input id='bladeWidth' name='bladeWidth' type='number' step='0.0001' min='0' value={zam.bladeWidth} onChange={(event) => updateZamboni(index, 'bladeWidth', event.target.value)}/>
              </label>

              {/* Blade Inventory */}
              <label className='field'>
                <span>Blade Inventory</span>
                <input id='bladeInventory' name='bladeInventory' type='number' min='0' value={zam.bladeInventory} onChange={(event) => updateZamboni(index, 'bladeInventory', event.target.value)} required/>
              </label>

              <label className='field'>
                <span>Notes</span>
                <textarea value={zam.notes} onChange={(event) => updateZamboni(index, 'notes', event.target.value)}/>
              </label>

              {form.zambonis.length > 1 && (
                <button type='button' className="button button--danger" onClick={() => removeZamboni(index)}><FiX />Remove Zamboni</button>
              )}

            </div>
          ))}

          <button type='button' onClick={() =>
                setForm((current) => ({
                  ...current,
                  zambonis: [
                    ...current.zambonis,
                    {
                      zamboniId: '',
                      bladeInventory: '',
                      bladeWidth: '',
                      notes: '',
                      maintenanceSearch: '',
                      maintenanceItemIds: []
                    }
                  ]
                }))
              }>Add Zam</button>

          {status && <p className={`status ${status.includes('success') ? 'status--success' : 'status--error'}`}>{status}</p>}
          <div className="form-actions">
            <button className="button button--primary" type="submit"><FiSave /> Save</button>
            <button className="button button--secondary" type="button" onClick={resetForm}><FiRotateCcw /> Reset</button>
            <button className="button button--danger" type="button"><FiX /> Cancel</button>
          </div>
        </form>
      </FormCard>
    </div>
  )
}
export default ZamMaintenanceForm