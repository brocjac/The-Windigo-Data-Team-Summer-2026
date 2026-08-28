using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Worker
{
    public int WorkerId { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string AccountStatus { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<ElectricityStat> ElectricityStats { get; set; } = new List<ElectricityStat>();

    public virtual ICollection<FacilityHvacFilter> FacilityHvacFilters { get; set; } = new List<FacilityHvacFilter>();

    public virtual ICollection<GlycolMachine> GlycolMachines { get; set; } = new List<GlycolMachine>();

    public virtual ICollection<IceDepthReading> IceDepthReadings { get; set; } = new List<IceDepthReading>();

    public virtual ICollection<IceMaintenance> IceMaintenances { get; set; } = new List<IceMaintenance>();

    public virtual ICollection<NaturalGasStat> NaturalGasStats { get; set; } = new List<NaturalGasStat>();

    public virtual ICollection<RinkDesHvacFilter> RinkDesHvacFilters { get; set; } = new List<RinkDesHvacFilter>();

    public virtual ICollection<RinkMiscMaintenance> RinkMiscMaintenances { get; set; } = new List<RinkMiscMaintenance>();

    public virtual ICollection<RinkTempHumidity> RinkTempHumidities { get; set; } = new List<RinkTempHumidity>();

    public virtual ICollection<ZamMaintenance> ZamMaintenances { get; set; } = new List<ZamMaintenance>();

    public virtual ICollection<ZamSchedule> ZamSchedules { get; set; } = new List<ZamSchedule>();
}
