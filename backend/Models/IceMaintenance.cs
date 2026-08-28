using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class IceMaintenance
{
    public int IceMaintenanceId { get; set; }

    public DateOnly IceMaintenanceDate { get; set; }

    public string Edged { get; set; } = null!;

    public string Chipped { get; set; } = null!;

    public string CrossCut { get; set; } = null!;

    public string HandFlood { get; set; } = null!;

    public string? Notes { get; set; }

    public int? WorkerId { get; set; }

    public virtual Worker? Worker { get; set; }
}
