using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class ZamSchedule
{
    public int ZamScheduleId { get; set; }

    public DateOnly ZamScheduleDate { get; set; }

    public string? Notes { get; set; }

    public int? ZamboniId { get; set; }

    public int? WorkerId { get; set; }

    public virtual Worker? Worker { get; set; }

    public virtual Zamboni? Zamboni { get; set; }
}
