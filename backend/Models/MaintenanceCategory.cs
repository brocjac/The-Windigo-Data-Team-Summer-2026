using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class MaintenanceCategory
{
    public int MaintenanceCategoryId { get; set; }

    public string? MaintenanceType { get; set; }

    public virtual ICollection<MaintenanceChecksAndRepair> MaintenanceChecksAndRepairs { get; set; } = new List<MaintenanceChecksAndRepair>();
}
