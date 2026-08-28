using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class PondsWeatherMeteo
{
    public int PondsWeatherId { get; set; }

    public DateOnly PondsWeatherDate { get; set; }

    public decimal? MaxTemperature { get; set; }

    public decimal? MinTemperature { get; set; }

    public decimal? AvgRelativeHumidity { get; set; }

    public decimal? AvgDewPoint { get; set; }
}
