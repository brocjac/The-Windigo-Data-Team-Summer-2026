using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class MaintenanceChecksAndRepair
{
    public int MaintenanceChecksAndRepairsId { get; set; }

    public string? ChecksAndRepairs { get; set; }

    public int? MaintenanceCategoryId { get; set; }

    public virtual MaintenanceCategory? MaintenanceCategory { get; set; }

    public virtual ICollection<ZamMaintenanceItem> ZamMaintenanceItems { get; set; } = new List<ZamMaintenanceItem>();
}
