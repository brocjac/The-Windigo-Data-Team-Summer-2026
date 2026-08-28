using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class ElectricityStat
{
    public int ElectricityStatsId { get; set; }

    public DateOnly ElectricityBillingDate { get; set; }

    public DateOnly ElectricityReadDate { get; set; }

    public int ElectricityBillingDays { get; set; }

    public decimal OnPeakEnergyCharges { get; set; }

    public decimal OffPeakEnergyCharges { get; set; }

    public decimal SystemDemandCharges { get; set; }

    public decimal CustomerDemandCharges { get; set; }

    public int CustomerCharge { get; set; }

    public decimal OtherCharges { get; set; }

    public decimal TaxCost { get; set; }

    public decimal SummaryOfOtherCharges { get; set; }

    public decimal PreviousBalanceAndAdjustmentsElectric { get; set; }

    public int OnPeakEnergyUsageKWh { get; set; }

    public int OffPeakEnergyUsageKWh { get; set; }

    public int SystemDemandKW { get; set; }

    public int CustomerDemandKW { get; set; }

    public int ElectricityHeatingDegreeDays { get; set; }

    public int ElectricityCoolingDegreeDays { get; set; }

    public int? WorkerId { get; set; }

    public virtual Worker? Worker { get; set; }
}
