import { useEffect, useState } from 'react'
import { FiSave, FiRotateCcw, FiX } from 'react-icons/fi'
import FormCard from '../../components/FormCard'
import {getElectricityStat, addElectricityStat} from '../../data/api'

function ElectricityUsageForm() {
  const [form, setForm] = useState({
    BillingDate: '',
    ReadDate: '',
    BillingDays: '',
    OnPeakCharges: '',
    OffPeakCharges: '',
    SystemDemandCharges: '',
    CustomerDemandCharges: '',
    CustomerCharge: '',
    OtherCharges: '',
    TaxCost: '',
    SummaryOfOtherCharges: '',
    PreviousBalanceAndAdjustments: '',
    OnPeakEnergyUsageKWh: '',
    OffPeakEnergyUsageKWh: '',
    SystemDemandKW: '',
    CustomerDemandKW: '',
    HeatingDegreeDays: '',
    CoolingDegreeDays: ''
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')

  const [readings, setReadings] = useState([])

  useEffect(() => {
    getElectricityStat()
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
        electricityBillingDate: form.BillingDate,
        electricityReadDate: form.ReadDate,
        electricityBillingDays: Number(form.BillingDays),
        onPeakEnergyCharges: Number(form.OnPeakCharges),
        offPeakEnergyCharges: Number(form.OffPeakCharges),
        systemDemandCharges: Number(form.SystemDemandCharges),
        customerDemandCharges: Number(form.CustomerDemandCharges),
        customerCharge: Number(form.CustomerCharge),
        otherCharges: Number(form.OtherCharges),
        taxCost: Number(form.TaxCost),
        summaryOfOtherCharges: Number(form.SummaryOfOtherCharges),
        previousBalanceAndAdjustmentsElectric: Number(form.PreviousBalanceAndAdjustments),
        onPeakEnergyUsageKWh: Number(form.OnPeakEnergyUsageKWh),
        offPeakEnergyUsageKWh: Number(form.OffPeakEnergyUsageKWh),
        systemDemandKW: Number(form.SystemDemandKW),
        customerDemandKW: Number(form.CustomerDemandKW),
        electricityHeatingDegreeDays: Number(form.HeatingDegreeDays),
        electricityCoolingDegreeDays: Number(form.CoolingDegreeDays),
      }

      const saveReading = await addElectricityStat(newReading)

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
      OnPeakCharges: '',
      OffPeakCharges: '',
      SystemDemandCharges: '',
      CustomerDemandCharges: '',
      CustomerCharge: '',
      OtherCharges: '',
      TaxCost: '',
      SummaryOfOtherCharges: '',
      PreviousBalanceAndAdjustments: '',
      OnPeakEnergyUsageKWh: '',
      OffPeakEnergyUsageKWh: '',
      SystemDemandKW: '',
      CustomerDemandKW: '',
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
          <h2>Electricity Usage Form</h2>
        </div>
      </div>
      <FormCard title="Electricity usage entry" description="Record monthly utility consumption and spend.">
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
            <span>On-Peak Usage Cost</span>
            <input type='Number' value={form.OnPeakCharges} onChange={(event) => setForm({ ...form, OnPeakCharges: event.target.value })} />
          </label>
          <label className="field">
            <span>On-Peak Usage kWh</span>
            <input type='Number' value={form.OnPeakEnergyUsageKWh} onChange={(event) => setForm({ ...form, OnPeakEnergyUsageKWh: event.target.value })} />
          </label>
          <label className="field">
            <span>Off-Peak Usage Cost</span>
            <input type='Number' value={form.OffPeakCharges} onChange={(event) => setForm({ ...form, OffPeakCharges: event.target.value })} />
          </label>
          <label className="field">
            <span>Off-Peak Usage kWh</span>
            <input type='Number' value={form.OffPeakEnergyUsageKWh} onChange={(event) => setForm({ ...form, OffPeakEnergyUsageKWh: event.target.value })} />
          </label>
          <label className="field">
            <span>System Demand Charges</span>
            <input type='Number' value={form.SystemDemandCharges} onChange={(event) => setForm({ ...form, SystemDemandCharges: event.target.value })} />
          </label>
          <label className="field">
            <span>Customer Demand Charges</span>
            <input type='Number' value={form.CustomerDemandCharges} onChange={(event) => setForm({ ...form, CustomerDemandCharges: event.target.value })} />
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
            <span>System Demand KW</span>
            <input type='Number' value={form.SystemDemandKW} onChange={(event) => setForm({ ...form, SystemDemandKW: event.target.value })} />
          </label>
          <label className="field">
            <span>Customer Demand KW</span>
            <input type='Number' value={form.CustomerDemandKW} onChange={(event) => setForm({ ...form, CustomerDemandKW: event.target.value })} />
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

export default ElectricityUsageForm
