using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class RinkTempHumidity
{
    public int RinkTempHumidityId { get; set; }

    public DateOnly RinkTempHumidityDate { get; set; }

    public int Temperature { get; set; }

    public int Humidity { get; set; }

    public int? WorkerId { get; set; }

    public virtual Worker? Worker { get; set; }
}
