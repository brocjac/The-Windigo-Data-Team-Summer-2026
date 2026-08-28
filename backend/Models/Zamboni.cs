using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Zamboni
{
    public int ZamboniId { get; set; }

    public string Zamboni1 { get; set; } = null!;

    public virtual ICollection<ZamMaintenance> ZamMaintenances { get; set; } = new List<ZamMaintenance>();

    public virtual ICollection<ZamSchedule> ZamSchedules { get; set; } = new List<ZamSchedule>();
}
