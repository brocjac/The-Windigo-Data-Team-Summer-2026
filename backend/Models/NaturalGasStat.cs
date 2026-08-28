using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class NaturalGasStat
{
    public int NaturalGasStatsId { get; set; }

    public DateOnly NaturalGasBillingDate { get; set; }

    public DateOnly NaturalGasReadDate { get; set; }

    public int NaturalGasBillingDays { get; set; }

    public decimal OtherGasCharges { get; set; }

    public decimal PreviousBalanceAndAdjustmentsGas { get; set; }

    public decimal BaseGasCost { get; set; }

    public decimal PurchaseGasAdjustment { get; set; }

    public decimal DistributionCharge { get; set; }

    public decimal CustomerCharge { get; set; }

    public decimal TaxCost { get; set; }

    public decimal NaturalGasUsedTherms { get; set; }

    public int GasHeatingDegreeDays { get; set; }

    public int GasCoolingDegreeDays { get; set; }

    public int? WorkerId { get; set; }

    public virtual Worker? Worker { get; set; }
}
