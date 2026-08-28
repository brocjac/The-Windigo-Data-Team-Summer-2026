using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class GlycolMachine
{
    public int GlycolMachineId { get; set; }

    public DateOnly GlycolMachineDate { get; set; }

    public int BeforePressureReturnPsi { get; set; }

    public int BeforePressureOutPsi { get; set; }

    public string BeforeMeasureLine { get; set; } = null!;

    public int AfterPressureReturnPsi { get; set; }

    public int AfterPressureOutPsi { get; set; }

    public string AfterMeasureLine { get; set; } = null!;

    public int GallonsAdded { get; set; }

    public string? Notes { get; set; }

    public int? WorkerId { get; set; }

    public virtual Worker? Worker { get; set; }
}
