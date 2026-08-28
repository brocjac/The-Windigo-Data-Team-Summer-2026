using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class RinkMiscMaintenance
{
    public int RinkMiscMaintenanceId { get; set; }

    public DateOnly RinkMiscMaintenanceDate { get; set; }

    public string? Task { get; set; }

    public string? Notes { get; set; }

    public int? WorkerId { get; set; }

    public virtual Worker? Worker { get; set; }
}
