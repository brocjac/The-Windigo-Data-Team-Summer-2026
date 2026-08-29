import { useEffect, useState } from 'react'
import { FiSave, FiRotateCcw, FiX } from 'react-icons/fi'
import FormCard from '../../components/FormCard'
import {getGasStats, addGasStats} from '../../data/api'

function GasUsageForm() {
  const [form, setForm] = useState({
    BillingDate: '',
    ReadDate: '',
    BillingDays: '',
    CustomerCharge: '',
    OtherCharges: '',
    TaxCost: '',
    SummaryOfOtherCharges: '',
    PreviousBalanceAndAdjustments: '',
    BaseGasCost: '',
    PurchaseGasAdjustment: '',
    DistributionCharge: '',
    NaturalGasUsedTherms: '',
    HeatingDegreeDays: '',
    CoolingDegreeDays: ''
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')

  const [readings, setReadings] = useState([])

  useEffect(() => {
    getGasStats()
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
        naturalGasBillingDate: form.BillingDate,
        naturalGasReadDate: form.ReadDate,
        naturalGasBillingDays: Number(form.BillingDays),
        otherGasCharges: Number(form.OtherCharges),
        previousBalanceAndAdjustmentsGas: Number(form.PreviousBalanceAndAdjustments),
        baseGasCost: Number(form.BaseGasCost),
        purchaseGasAdjustment: Number(form.PurchaseGasAdjustment),
        distributionCharge: Number(form.DistributionCharge),
        customerCharge: Number(form.CustomerCharge),
        taxCost: Number(form.TaxCost),
        naturalGasUsedTherms: Number(form.NaturalGasUsedTherms),
        gasHeatingDegreeDays: Number(form.HeatingDegreeDays),
        gasCoolingDegreeDays: Number(form.CoolingDegreeDays)
      }

      const saveReading = await addGasStats(newReading)

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
      BillingDate: '', 
      ReadDate: '', 
      BillingDays: '', 
      CustomerCharge: '', 
      OtherCharges: '', 
      TaxCost: '', 
      SummaryOfOtherCharges: '', 
      PreviousBalanceAndAdjustments: '', 
      BaseGasCost: '',
      PurchaseGasAdjustment: '',
      DistributionCharge: '',
      NaturalGasUsedTherms: '', 
      HeatingDegreeDays: '', 
      CoolingDegreeDays: '' 
    })
    setErrors({})
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
            <span>Billing Date</span>
            <input type="date" value={form.BillingDate} onChange={(event) => setForm({ ...form, BillingDate: event.target.value })} />
          </label>
          <label className="field">
            <span>Read Date</span>
            <input type="date" value={form.ReadDate} onChange={(event) => setForm({ ...form, ReadDate: event.target.value })} />
          </label>
          <label className="field">
            <span>Billing Days</span>
            <input type='Number' value={form.BillingDays} onChange={(event) => setForm({ ...form, BillingDays: event.target.value })} />
          </label>
          <label className="field">
            <span>Customer Charge</span>
            <input type='Number' value={form.CustomerCharge} onChange={(event) => setForm({ ...form, CustomerCharge: event.target.value })} />
          </label>
          <label className="field">
            <span>Other Charges</span>
            <input type='Number' value={form.OtherCharges} onChange={(event) => setForm({ ...form, OtherCharges: event.target.value })} />
          </label>
          <label className="field">
            <span>Tax Cost</span>
            <input type='Number' value={form.TaxCost} onChange={(event) => setForm({ ...form, TaxCost: event.target.value })} />
          </label>
          <label className="field">
            <span>Summary Of Other Charges</span>
            <input type='Number' value={form.SummaryOfOtherCharges} onChange={(event) => setForm({ ...form, SummaryOfOtherCharges: event.target.value })} />
          </label>
          <label className="field">
            <span>Previous Balance And Adjustments</span>
            <input type='Number' value={form.PreviousBalanceAndAdjustments} onChange={(event) => setForm({ ...form, PreviousBalanceAndAdjustments: event.target.value })} />
          </label>
          <label className="field">
            <span>Base Gas Cost</span>
            <input value={form.BaseGasCost} onChange={(event) => setForm({ ...form, BaseGasCost: event.target.value })} />
          </label>
          <label className="field">
            <span>Purchase Gas Adjustment</span>
            <input value={form.PurchaseGasAdjustment} onChange={(event) => setForm({ ...form, PurchaseGasAdjustment: event.target.value })} />
          </label>
          <label className="field">
            <span>Distribution Charge</span>
            <input value={form.DistributionCharge} onChange={(event) => setForm({ ...form, DistributionCharge: event.target.value })} />
          </label>
          <label className="field">
            <span>Total Therms</span>
            <input value={form.NaturalGasUsedTherms} onChange={(event) => setForm({ ...form, NaturalGasUsedTherms: event.target.value })} />
          </label>
          <label className="field">
            <span>Heating Degree Days</span>
            <input type='Number' value={form.HeatingDegreeDays} onChange={(event) => setForm({ ...form, HeatingDegreeDays: event.target.value })} />
          </label>
          <label className="field">
            <span>Cooling Degree Days</span>
            <input type='Number' value={form.CoolingDegreeDays} onChange={(event) => setForm({ ...form, CoolingDegreeDays: event.target.value })} />
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
