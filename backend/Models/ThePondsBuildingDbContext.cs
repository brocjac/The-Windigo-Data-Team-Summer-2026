using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace backend.Models;

public partial class ThePondsBuildingDbContext : DbContext
{
    public ThePondsBuildingDbContext(DbContextOptions<ThePondsBuildingDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<ElectricityStat> ElectricityStats { get; set; }

    public virtual DbSet<FacilityHvacFilter> FacilityHvacFilters { get; set; }

    public virtual DbSet<GlycolMachine> GlycolMachines { get; set; }

    public virtual DbSet<IceDepthReading> IceDepthReadings { get; set; }

    public virtual DbSet<IceMaintenance> IceMaintenances { get; set; }

    public virtual DbSet<MaintenanceCategory> MaintenanceCategories { get; set; }

    public virtual DbSet<MaintenanceChecksAndRepair> MaintenanceChecksAndRepairs { get; set; }

    public virtual DbSet<NaturalGasStat> NaturalGasStats { get; set; }

    public virtual DbSet<PondsWeatherMeteo> PondsWeatherMeteos { get; set; }

    public virtual DbSet<RinkDesHvacFilter> RinkDesHvacFilters { get; set; }

    public virtual DbSet<RinkMiscMaintenance> RinkMiscMaintenances { get; set; }

    public virtual DbSet<RinkTempHumidity> RinkTempHumidities { get; set; }

    public virtual DbSet<Worker> Workers { get; set; }

    public virtual DbSet<ZamMaintenance> ZamMaintenances { get; set; }

    public virtual DbSet<ZamMaintenanceItem> ZamMaintenanceItems { get; set; }

    public virtual DbSet<ZamSchedule> ZamSchedules { get; set; }

    public virtual DbSet<Zamboni> Zambonis { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ElectricityStat>(entity =>
        {
            entity.HasKey(e => e.ElectricityStatsId).HasName("PK__Electric__343A1DD92EA89D8D");

            entity.ToTable("Electricity_Stats");

            entity.Property(e => e.ElectricityStatsId).HasColumnName("Electricity_Stats_ID");
            entity.Property(e => e.CustomerCharge).HasColumnName("Customer_Charge");
            entity.Property(e => e.CustomerDemandCharges)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("Customer_Demand_Charges");
            entity.Property(e => e.CustomerDemandKW).HasColumnName("Customer_Demand_kW");
            entity.Property(e => e.ElectricityBillingDate).HasColumnName("Electricity_Billing_Date");
            entity.Property(e => e.ElectricityBillingDays).HasColumnName("Electricity_Billing_Days");
            entity.Property(e => e.ElectricityCoolingDegreeDays).HasColumnName("Electricity_Cooling_Degree_Days");
            entity.Property(e => e.ElectricityHeatingDegreeDays).HasColumnName("Electricity_Heating_Degree_Days");
            entity.Property(e => e.ElectricityReadDate).HasColumnName("Electricity_Read_Date");
            entity.Property(e => e.OffPeakEnergyCharges)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("Off_Peak_Energy_Charges");
            entity.Property(e => e.OffPeakEnergyUsageKWh).HasColumnName("Off_Peak_Energy_Usage_kWh");
            entity.Property(e => e.OnPeakEnergyCharges)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("On_Peak_Energy_Charges");
            entity.Property(e => e.OnPeakEnergyUsageKWh).HasColumnName("On_Peak_Energy_Usage_kWh");
            entity.Property(e => e.OtherCharges)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("Other_Charges");
            entity.Property(e => e.PreviousBalanceAndAdjustmentsElectric)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("Previous_Balance_And_Adjustments_Electric");
            entity.Property(e => e.SummaryOfOtherCharges)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("Summary_Of_Other_Charges");
            entity.Property(e => e.SystemDemandCharges)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("System_Demand_Charges");
            entity.Property(e => e.SystemDemandKW).HasColumnName("System_Demand_kW");
            entity.Property(e => e.TaxCost)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("Tax_Cost");
            entity.Property(e => e.WorkerId).HasColumnName("Worker_ID");

            entity.HasOne(d => d.Worker).WithMany(p => p.ElectricityStats)
                .HasForeignKey(d => d.WorkerId)
                .HasConstraintName("FK_Electricity_Stats_Worker_ID");
        });

        modelBuilder.Entity<FacilityHvacFilter>(entity =>
        {
            entity.HasKey(e => e.FacilityHvacFilterId).HasName("PK__Facility__8A7AC871D2AE0AC3");

            entity.ToTable("Facility_HVAC_Filter");

            entity.Property(e => e.FacilityHvacFilterId).HasColumnName("Facility_HVAC_Filter_ID");
            entity.Property(e => e.FacilityChangeDate).HasColumnName("Facility_Change_Date");
            entity.Property(e => e.Notes).IsUnicode(false);
            entity.Property(e => e.WorkerId).HasColumnName("Worker_ID");
            entity.Property(e => e._16x22Changed)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("16x22_Changed");
            entity.Property(e => e._16x22Inventory).HasColumnName("16x22_Inventory");
            entity.Property(e => e._20x20Changed)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("20x20_Changed");
            entity.Property(e => e._20x20Inventory).HasColumnName("20x20_Inventory");
            entity.Property(e => e._20x25Changed)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("20x25_Changed");
            entity.Property(e => e._20x25Inventory).HasColumnName("20x25_Inventory");

            entity.HasOne(d => d.Worker).WithMany(p => p.FacilityHvacFilters)
                .HasForeignKey(d => d.WorkerId)
                .HasConstraintName("FK_Facility_HVAC_Filter_Worker_ID");
        });

        modelBuilder.Entity<GlycolMachine>(entity =>
        {
            entity.HasKey(e => e.GlycolMachineId).HasName("PK__Glycol_M__AA6A03269B2FA5CF");

            entity.ToTable("Glycol_Machine");

            entity.Property(e => e.GlycolMachineId).HasColumnName("Glycol_Machine_ID");
            entity.Property(e => e.AfterMeasureLine)
                .HasMaxLength(7)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("After_Measure_Line");
            entity.Property(e => e.AfterPressureOutPsi).HasColumnName("After_Pressure_Out_PSI");
            entity.Property(e => e.AfterPressureReturnPsi).HasColumnName("After_Pressure_Return_PSI");
            entity.Property(e => e.BeforeMeasureLine)
                .HasMaxLength(7)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Before_Measure_Line");
            entity.Property(e => e.BeforePressureOutPsi).HasColumnName("Before_Pressure_Out_PSI");
            entity.Property(e => e.BeforePressureReturnPsi).HasColumnName("Before_Pressure_Return_PSI");
            entity.Property(e => e.GallonsAdded).HasColumnName("Gallons_Added");
            entity.Property(e => e.GlycolMachineDate).HasColumnName("Glycol_Machine_Date");
            entity.Property(e => e.Notes).IsUnicode(false);
            entity.Property(e => e.WorkerId).HasColumnName("Worker_ID");

            entity.HasOne(d => d.Worker).WithMany(p => p.GlycolMachines)
                .HasForeignKey(d => d.WorkerId)
                .HasConstraintName("FK_Glycol_Machine_Worker_ID");
        });

        modelBuilder.Entity<IceDepthReading>(entity =>
        {
            entity.HasKey(e => e.ReadingId).HasName("PK__Ice_Dept__FC949F8B4DBC0D42");

            entity.ToTable("Ice_Depth_Readings");

            entity.Property(e => e.ReadingId).HasColumnName("Reading_ID");
            entity.Property(e => e.IceDepth)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("Ice_Depth");
            entity.Property(e => e.ReadingDate).HasColumnName("Reading_Date");
            entity.Property(e => e.WorkerId).HasColumnName("Worker_ID");
            entity.Property(e => e.ZoneId).HasColumnName("Zone_ID");

            entity.HasOne(d => d.Worker).WithMany(p => p.IceDepthReadings)
                .HasForeignKey(d => d.WorkerId)
                .HasConstraintName("FK_Ice_Depth_Readings_Worker_ID");
        });

        modelBuilder.Entity<IceMaintenance>(entity =>
        {
            entity.HasKey(e => e.IceMaintenanceId).HasName("PK__Ice_Main__8C191B509CCB73D2");

            entity.ToTable("Ice_Maintenance");

            entity.Property(e => e.IceMaintenanceId).HasColumnName("Ice_Maintenance_ID");
            entity.Property(e => e.Chipped)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.CrossCut)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("Cross_Cut");
            entity.Property(e => e.Edged)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.HandFlood)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("Hand_Flood");
            entity.Property(e => e.IceMaintenanceDate).HasColumnName("Ice_Maintenance_Date");
            entity.Property(e => e.Notes).IsUnicode(false);
            entity.Property(e => e.WorkerId).HasColumnName("Worker_ID");

            entity.HasOne(d => d.Worker).WithMany(p => p.IceMaintenances)
                .HasForeignKey(d => d.WorkerId)
                .HasConstraintName("FK_Ice_Maintenance_Worker_ID");
        });

        modelBuilder.Entity<MaintenanceCategory>(entity =>
        {
            entity.HasKey(e => e.MaintenanceCategoryId).HasName("PK__Maintena__77A694FCCFDA5788");

            entity.ToTable("Maintenance_Category");

            entity.Property(e => e.MaintenanceCategoryId).HasColumnName("Maintenance_Category_ID");
            entity.Property(e => e.MaintenanceType)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("Maintenance_Type");
        });

        modelBuilder.Entity<MaintenanceChecksAndRepair>(entity =>
        {
            entity.HasKey(e => e.MaintenanceChecksAndRepairsId).HasName("PK__Maintena__83048BACE3D6FE33");

            entity.ToTable("Maintenance_Checks_and_Repairs");

            entity.Property(e => e.MaintenanceChecksAndRepairsId).HasColumnName("Maintenance_Checks_and_Repairs_ID");
            entity.Property(e => e.ChecksAndRepairs)
                .HasMaxLength(60)
                .IsUnicode(false)
                .HasColumnName("Checks_and_Repairs");
            entity.Property(e => e.MaintenanceCategoryId).HasColumnName("Maintenance_Category_ID");

            entity.HasOne(d => d.MaintenanceCategory).WithMany(p => p.MaintenanceChecksAndRepairs)
                .HasForeignKey(d => d.MaintenanceCategoryId)
                .HasConstraintName("FK_Maintenance_Checks_and_Repairs_Maintenance_Category_ID");
        });

        modelBuilder.Entity<NaturalGasStat>(entity =>
        {
            entity.HasKey(e => e.NaturalGasStatsId).HasName("PK__Natural___E7D12110F5691079");

            entity.ToTable("Natural_Gas_Stats");

            entity.Property(e => e.NaturalGasStatsId).HasColumnName("Natural_Gas_Stats_ID");
            entity.Property(e => e.BaseGasCost)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("Base_Gas_Cost");
            entity.Property(e => e.CustomerCharge)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("Customer_Charge");
            entity.Property(e => e.DistributionCharge)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("Distribution_Charge");
            entity.Property(e => e.GasCoolingDegreeDays).HasColumnName("Gas_Cooling_Degree_Days");
            entity.Property(e => e.GasHeatingDegreeDays).HasColumnName("Gas_Heating_Degree_Days");
            entity.Property(e => e.NaturalGasBillingDate).HasColumnName("Natural_Gas_Billing_Date");
            entity.Property(e => e.NaturalGasBillingDays).HasColumnName("Natural_Gas_Billing_Days");
            entity.Property(e => e.NaturalGasReadDate).HasColumnName("Natural_Gas_Read_Date");
            entity.Property(e => e.NaturalGasUsedTherms)
                .HasColumnType("decimal(10, 1)")
                .HasColumnName("Natural_Gas_Used_Therms");
            entity.Property(e => e.OtherGasCharges)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("Other_Gas_Charges");
            entity.Property(e => e.PreviousBalanceAndAdjustmentsGas)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("Previous_Balance_And_Adjustments_Gas");
            entity.Property(e => e.PurchaseGasAdjustment)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("Purchase_Gas_Adjustment");
            entity.Property(e => e.TaxCost)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("Tax_Cost");
            entity.Property(e => e.WorkerId).HasColumnName("Worker_ID");

            entity.HasOne(d => d.Worker).WithMany(p => p.NaturalGasStats)
                .HasForeignKey(d => d.WorkerId)
                .HasConstraintName("FK_Natural_Gas_Stats_Worker_ID");
        });

        modelBuilder.Entity<PondsWeatherMeteo>(entity =>
        {
            entity.HasKey(e => e.PondsWeatherId).HasName("PK__Ponds_We__991471EB12CF7C86");

            entity.ToTable("Ponds_Weather_Meteo");

            entity.HasIndex(e => e.PondsWeatherDate, "UQ_Ponds_Weather_Meteo_Date").IsUnique();

            entity.Property(e => e.PondsWeatherId).HasColumnName("Ponds_Weather_ID");
            entity.Property(e => e.AvgDewPoint)
                .HasColumnType("decimal(6, 2)")
                .HasColumnName("Avg_Dew_Point");
            entity.Property(e => e.AvgRelativeHumidity)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("Avg_Relative_Humidity");
            entity.Property(e => e.MaxTemperature)
                .HasColumnType("decimal(6, 2)")
                .HasColumnName("Max_Temperature");
            entity.Property(e => e.MinTemperature)
                .HasColumnType("decimal(6, 2)")
                .HasColumnName("Min_Temperature");
            entity.Property(e => e.PondsWeatherDate).HasColumnName("Ponds_Weather_Date");
        });

        modelBuilder.Entity<RinkDesHvacFilter>(entity =>
        {
            entity.HasKey(e => e.RinkHvacFilterId).HasName("PK__Rink_Des__921552E5B32DA19F");

            entity.ToTable("Rink_Des_HVAC_Filter");

            entity.Property(e => e.RinkHvacFilterId).HasColumnName("Rink_HVAC_Filter_ID");
            entity.Property(e => e.Notes).IsUnicode(false);
            entity.Property(e => e.RinkChangeDate).HasColumnName("Rink_Change_Date");
            entity.Property(e => e.WorkerId).HasColumnName("Worker_ID");
            entity.Property(e => e._18x24Changed)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("18x24_Changed");
            entity.Property(e => e._18x24Inventory).HasColumnName("18x24_Inventory");
            entity.Property(e => e._20x20Changed)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("20x20_Changed");
            entity.Property(e => e._20x20Inventory).HasColumnName("20x20_Inventory");
            entity.Property(e => e._24x24Changed)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("24x24_Changed");
            entity.Property(e => e._24x24Inventory).HasColumnName("24x24_Inventory");

            entity.HasOne(d => d.Worker).WithMany(p => p.RinkDesHvacFilters)
                .HasForeignKey(d => d.WorkerId)
                .HasConstraintName("FK_Rink_HVAC_Filter_Worker_ID");
        });

        modelBuilder.Entity<RinkMiscMaintenance>(entity =>
        {
            entity.HasKey(e => e.RinkMiscMaintenanceId).HasName("PK__Rink_Mis__A8D4681E46990E19");

            entity.ToTable("Rink_Misc_Maintenance");

            entity.Property(e => e.RinkMiscMaintenanceId).HasColumnName("Rink_Misc_Maintenance_ID");
            entity.Property(e => e.Notes).IsUnicode(false);
            entity.Property(e => e.RinkMiscMaintenanceDate).HasColumnName("Rink_Misc_Maintenance_Date");
            entity.Property(e => e.Task).IsUnicode(false);
            entity.Property(e => e.WorkerId).HasColumnName("Worker_ID");

            entity.HasOne(d => d.Worker).WithMany(p => p.RinkMiscMaintenances)
                .HasForeignKey(d => d.WorkerId)
                .HasConstraintName("FK_Rink_Misc_Maintenance_Worker_ID");
        });

        modelBuilder.Entity<RinkTempHumidity>(entity =>
        {
            entity.HasKey(e => e.RinkTempHumidityId).HasName("PK__Rink_Tem__D7C54CE981C60BFC");

            entity.ToTable("Rink_Temp_Humidity");

            entity.Property(e => e.RinkTempHumidityId).HasColumnName("Rink_Temp_Humidity_ID");
            entity.Property(e => e.RinkTempHumidityDate).HasColumnName("Rink_Temp_Humidity_Date");
            entity.Property(e => e.WorkerId).HasColumnName("Worker_ID");

            entity.HasOne(d => d.Worker).WithMany(p => p.RinkTempHumidities)
                .HasForeignKey(d => d.WorkerId)
                .HasConstraintName("FK_Rink_Temp_Humidity_Worker_ID");
        });

        modelBuilder.Entity<Worker>(entity =>
        {
            entity.ToTable("Worker");

            entity.HasIndex(e => e.Email, "UQ_Worker_Email").IsUnique();

            entity.Property(e => e.WorkerId).HasColumnName("Worker_ID");
            entity.Property(e => e.AccountStatus)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Account_Status");
            entity.Property(e => e.CreatedAt).HasColumnName("Created_At");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.FirstName)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("First_Name");
            entity.Property(e => e.LastName)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Last_Name");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("Password_Hash");
            entity.Property(e => e.UpdatedAt).HasColumnName("Updated_At");
        });

        modelBuilder.Entity<ZamMaintenance>(entity =>
        {
            entity.HasKey(e => e.ZamMaintenanceId).HasName("PK__Zam_Main__0CE6C0B4790C7638");

            entity.ToTable("Zam_Maintenance");

            entity.Property(e => e.ZamMaintenanceId).HasColumnName("Zam_Maintenance_ID");
            entity.Property(e => e.BladeInventory).HasColumnName("Blade_Inventory");
            entity.Property(e => e.BladeWidth)
                .HasColumnType("decimal(5, 4)")
                .HasColumnName("Blade_Width");
            entity.Property(e => e.Notes).IsUnicode(false);
            entity.Property(e => e.WorkerId).HasColumnName("Worker_ID");
            entity.Property(e => e.ZamMaintenanceDate).HasColumnName("Zam_Maintenance_Date");
            entity.Property(e => e.ZamboniId).HasColumnName("Zamboni_ID");

            entity.HasOne(d => d.Worker).WithMany(p => p.ZamMaintenances)
                .HasForeignKey(d => d.WorkerId)
                .HasConstraintName("FK_Zam_Maintenance_Worker_ID");

            entity.HasOne(d => d.Zamboni).WithMany(p => p.ZamMaintenances)
                .HasForeignKey(d => d.ZamboniId)
                .HasConstraintName("FK_Zam_Maintenance_Zamboni_ID");
        });

        modelBuilder.Entity<ZamMaintenanceItem>(entity =>
        {
            entity.HasKey(e => e.ZamMaintenanceItemId).HasName("PK__Zam_Main__9B44964B83FC042B");

            entity.ToTable("Zam_Maintenance_Item");

            entity.Property(e => e.ZamMaintenanceItemId).HasColumnName("Zam_Maintenance_Item_ID");
            entity.Property(e => e.MaintenanceChecksAndRepairsId).HasColumnName("Maintenance_Checks_and_Repairs_ID");
            entity.Property(e => e.ZamMaintenanceId).HasColumnName("Zam_Maintenance_ID");

            entity.HasOne(d => d.MaintenanceChecksAndRepairs).WithMany(p => p.ZamMaintenanceItems)
                .HasForeignKey(d => d.MaintenanceChecksAndRepairsId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Zam_Maint__Maint__3CF40B7E");

            entity.HasOne(d => d.ZamMaintenance).WithMany(p => p.ZamMaintenanceItems)
                .HasForeignKey(d => d.ZamMaintenanceId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Zam_Maint__Zam_M__3BFFE745");
        });

        modelBuilder.Entity<ZamSchedule>(entity =>
        {
            entity.HasKey(e => e.ZamScheduleId).HasName("PK__Zam_Sche__81B3845E69A63237");

            entity.ToTable("Zam_Schedule");

            entity.Property(e => e.ZamScheduleId).HasColumnName("Zam_Schedule_ID");
            entity.Property(e => e.Notes).IsUnicode(false);
            entity.Property(e => e.WorkerId).HasColumnName("Worker_ID");
            entity.Property(e => e.ZamScheduleDate).HasColumnName("Zam_Schedule_Date");
            entity.Property(e => e.ZamboniId).HasColumnName("Zamboni_ID");

            entity.HasOne(d => d.Worker).WithMany(p => p.ZamSchedules)
                .HasForeignKey(d => d.WorkerId)
                .HasConstraintName("FK_Zam_Schedule_Worker_ID");

            entity.HasOne(d => d.Zamboni).WithMany(p => p.ZamSchedules)
                .HasForeignKey(d => d.ZamboniId)
                .HasConstraintName("FK_Zam_Schedule_Zamboni_ID");
        });

        modelBuilder.Entity<Zamboni>(entity =>
        {
            entity.HasKey(e => e.ZamboniId).HasName("PK__Zamboni__0F7E1EABBCC56EB9");

            entity.ToTable("Zamboni");

            entity.Property(e => e.ZamboniId).HasColumnName("Zamboni_ID");
            entity.Property(e => e.Zamboni1)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("Zamboni");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
