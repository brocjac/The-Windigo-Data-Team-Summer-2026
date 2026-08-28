using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class RinkDesHvacFilter
{
    public int RinkHvacFilterId { get; set; }

    public DateOnly RinkChangeDate { get; set; }

    public string? _20x20Changed { get; set; }

    public string? _24x24Changed { get; set; }

    public string? _18x24Changed { get; set; }

    public int? _20x20Inventory { get; set; }

    public int? _24x24Inventory { get; set; }

    public int? _18x24Inventory { get; set; }

    public string? Notes { get; set; }

    public int? WorkerId { get; set; }

    public virtual Worker? Worker { get; set; }
}
