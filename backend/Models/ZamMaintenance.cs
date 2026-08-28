using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class ZamMaintenance
{
    public int ZamMaintenanceId { get; set; }

    public DateOnly ZamMaintenanceDate { get; set; }

    public string? Notes { get; set; }

    public int BladeInventory { get; set; }

    public decimal? BladeWidth { get; set; }

    public int? ZamboniId { get; set; }

    public int? WorkerId { get; set; }

    public virtual Worker? Worker { get; set; }

    public virtual ICollection<ZamMaintenanceItem> ZamMaintenanceItems { get; set; } = new List<ZamMaintenanceItem>();

    public virtual Zamboni? Zamboni { get; set; }
}
