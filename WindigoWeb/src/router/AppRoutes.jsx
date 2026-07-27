import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'

const HomePage = lazy(() => import('../pages/Home/HomePage'))
const TeamsDashboard = lazy(() => import('../pages/Teams/TeamsDashboard'))
const IceMaintenanceDashboard = lazy(() => import('../pages/IceMaintenance/IceMaintenanceDashboard'))
const IceDepthDashboard = lazy(() => import('../pages/IceMaintenance/IceDepthDashboard'))
const MaintenanceDashboard = lazy(() => import('../pages/IceMaintenance/MaintenanceDashboard'))
const RinkBuildingInfo = lazy(() => import('../pages/BuildingInfo/RinkBuildingInfo'))
const IceDepthForm = lazy(() => import('../pages/BuildingInfo/IceDepthForm'))
const MaintenanceForm = lazy(() => import('../pages/BuildingInfo/MaintenanceForm'))
const RinkTemperatureForm = lazy(() => import('../pages/BuildingInfo/RinkTemperatureForm'))
const BillingForms = lazy(() => import('../pages/BuildingInfo/BillingForms'))
const HVACMaintenance = lazy(() => import('../pages/Maintenance/HVACMaintenance'))
const IceMaintenance = lazy(() => import('../pages/Maintenance/IceMaintenance'))
const RinkMaintenance = lazy(() => import('../pages/Maintenance/RinkMaintenance'))
const ZamboniSchedule = lazy(() => import('../pages/Maintenance/ZamboniSchedule'))
const ZamboniMaintenance = lazy(() => import('../pages/Maintenance/ZamboniMaintenance'))
const GasUsageForm = lazy(() => import('../pages/Billing/GasUsageForm'))
const ElectricityUsageForm = lazy(() => import('../pages/Billing/ElectricityUsageForm'))

function PageLoading() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
      color: '#888',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '1rem',
    }}>
      Loading…
    </div>
  )
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/teams" element={<TeamsDashboard />} />
            <Route path="/ice-maintenance" element={<IceMaintenanceDashboard />} />
            <Route path="/ice-maintenance/ice-depth" element={<IceDepthDashboard />} />
            <Route path="/ice-maintenance/maintenance" element={<MaintenanceDashboard />} />
            <Route path="/building-info" element={<RinkBuildingInfo />} />
            <Route path="/building-info/ice-depth" element={<IceDepthForm />} />
            <Route path="/building-info/maintenance" element={<MaintenanceForm />} />
            <Route path="/building-info/rink-temperature" element={<RinkTemperatureForm />} />
            <Route path="/building-info/billing" element={<BillingForms />} />
            <Route path="/maintenance/hvac" element={<HVACMaintenance />} />
            <Route path="/maintenance/ice" element={<IceMaintenance />} />
            <Route path="/maintenance/rink" element={<RinkMaintenance />} />
            <Route path="/maintenance/zamboni/schedule" element={<ZamboniSchedule />} />
            <Route path="/maintenance/zamboni/maintenance" element={<ZamboniMaintenance />} />
            <Route path="/billing/gas" element={<GasUsageForm />} />
            <Route path="/billing/electricity" element={<ElectricityUsageForm />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default AppRoutes

