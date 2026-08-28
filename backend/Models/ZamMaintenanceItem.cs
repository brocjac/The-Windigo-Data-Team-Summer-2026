using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class ZamMaintenanceItem
{
    public int ZamMaintenanceItemId { get; set; }

    public int ZamMaintenanceId { get; set; }

    public int MaintenanceChecksAndRepairsId { get; set; }

    public virtual MaintenanceChecksAndRepair MaintenanceChecksAndRepairs { get; set; } = null!;

    public virtual ZamMaintenance ZamMaintenance { get; set; } = null!;
}
