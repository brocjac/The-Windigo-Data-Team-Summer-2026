import { useState } from 'react'
import FormCard from '../../components/FormCard'
import FacilityHvacForm from './forms/FacilityHvacForm'
import RinkHvacForm from './forms/RinkDesHvacForm'
import IceMaintenanceForm from './forms/IceMaintenanceForm'
import MiscRinkMaintenanceForm from './forms/MiscRinkMaintenanceForm'
import ZamMaintenance from './forms/ZamMaintenanceForm'
import ZamSchedual from './forms/ZamScheduleForm'
import GlycolMachine from './forms/GlycolMachineForm'

function MaintenanceForm() {
  const [formType, setFormType] = useState('facility')
  return (
    <div className="page">
      <div className="page__header">
        <div>
          <p className="eyebrow">Forms</p>
          <h2>Maintenance Form</h2>
        </div>
      </div>
      <FormCard title="Report maintenance work" description="Capture maintenance needs across the rink facility.">
        <label className="field">
          <span>Select Form</span>
          <select value={formType} onChange={(event) => setFormType(event.target.value)}>
            <option value="facility">Facility HVAC Filter Change</option>
            <option value="rink">Rink Dec HVAC Filter Change</option>
            <option value="iceMaintenance">Ice Maintenance</option>
            <option value="miscRinkMaintenance">Miscellaneous Rink Maintenance</option>
            <option value="zamMaintenance">Zamboni Maintenance</option>
            <option value="zamSchedual">Zamboni Schedualer Form</option>
            <option value="glycolMachine">Glycol Machine Form</option>
          </select>
        </label>
        {formType === 'facility' && (
          <FacilityHvacForm/>
        )}
        {formType === 'rink' && (
          <RinkHvacForm/>
        )}
        {formType === 'iceMaintenance' && (
          <IceMaintenanceForm/>
        )}
        {formType === 'miscRinkMaintenance' && (
          <MiscRinkMaintenanceForm/>
        )}
        {formType === 'zamMaintenance' && (
          <ZamMaintenance/>
        )}
        {formType === 'zamSchedual' && (
          <ZamSchedual/>
        )}
        {formType === 'glycolMachine' && (
          <GlycolMachine/>
        )}
      </FormCard>
    </div>
  )
}
export default MaintenanceForm
