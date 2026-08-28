using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class FacilityHvacFilter
{
    public int FacilityHvacFilterId { get; set; }

    public DateOnly FacilityChangeDate { get; set; }

    public string _20x25Changed { get; set; } = null!;

    public string _20x20Changed { get; set; } = null!;

    public string _16x22Changed { get; set; } = null!;

    public int _20x25Inventory { get; set; }

    public int _20x20Inventory { get; set; }

    public int _16x22Inventory { get; set; }

    public string? Notes { get; set; }

    public int? WorkerId { get; set; }

    public virtual Worker? Worker { get; set; }
}
