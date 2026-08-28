using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class IceDepthReading
{
    public int ReadingId { get; set; }

    public DateOnly ReadingDate { get; set; }

    public byte ZoneId { get; set; }

    public decimal IceDepth { get; set; }

    public int? WorkerId { get; set; }

    public virtual Worker? Worker { get; set; }
}
