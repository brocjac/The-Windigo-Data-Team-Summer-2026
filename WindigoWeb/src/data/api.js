const API_URL = "http://localhost:5028/api";

async function apiGet(endpoint) {
    const response = await fetch(`${API_URL}/${endpoint}`);

    if (!response.ok) {
        throw new error(`API request failed: ${response.status}`);
    }

    return response.json();
}

async function apiPost(endpoint, data) {
    const response = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const errorText = await response.text()

        console.error('API response:', errorText)

        throw new Error(
            `API request failed: ${response.status} - ${errorText}`
        )
    }

    return response.json();
}

export const getRinkTempHumidity = () =>
    apiGet('RinkTempHumidity')

export const addRinkTempHumidity = (reading) =>
    apiPost('RinkTempHumidity', reading)

export const getIceDepthReadings = () =>
    apiGet('IceDepthReadings')

export const addIceDepthReadings = (reading) =>
    apiPost('IceDepthReadings', reading)

export const getFacilityHvacFilter = () =>
    apiGet('FacilityHvacFilter')

export const addFacilityHvacFilter = (reading) =>
    apiPost('FacilityHvacFilter', reading)

export const updateFacilityInventory = (adjustment) =>
    apiPost('FacilityHvacFilter', adjustment)

export const getRinkDesHvacFilter = () =>
    apiGet('RinkDesHvacFilter')

export const addRinkDesHvacFilter = (reading) =>
    apiPost('RinkDesHvacFilter', reading)

export const getIceMaintenance = () =>
    apiGet('IceMaintenance')

export const addIceMaintenance = (reading) =>
    apiPost('IceMaintenance', reading)

export const getRinkMiscMaintenance = () =>
    apiGet('RinkMiscMaintenance')

export const addRinkMiscMaintenance = (reading) =>
    apiPost('RinkMiscMaintenance', reading)


// -------------------------
// Zamboni Maintenance
// -------------------------

export const getZambonis = () =>
    apiGet('Zamboni')

export const getMaintenanceCategory = () =>
    apiGet('MaintenanceCategory')

export const getMaintenanceChecks = () =>
    apiGet('MaintenanceChecksAndRepair')

export const getMaintenanceChecksByCategory = (categoryId) =>
    apiGet(`MaintenanceChecksByCategory/category/${categoryId}`)

export const getZamMaintenance = () =>
    apiGet('ZamMaintenance')

export const addZamMaintenance = (record) =>
    apiPost('ZamMaintenance', record)


export const getZamSchedule = () => 
    apiGet('ZamSchedule')

export const addZamSchedule = (record) =>
  apiPost('ZamSchedule', record)

export const getGasStats = () => 
    apiGet('NaturalGasStats')

export const addGasStats = (record) =>
  apiPost('NaturalGasStats', record)

export const getElectricityStat = () => 
    apiGet('ElectricityStats')

export const addElectricityStat = (record) =>
    apiPost('ElectricityStats', record)

export const getGlycolMachine = () => 
    apiGet('GlycolMachine')

export const addGlycolMachine = (record) =>
    apiPost('GlycolMachine', record)