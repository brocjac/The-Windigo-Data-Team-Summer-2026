Create Database The_Ponds_Building_DB
go
use The_Ponds_Building_DB;
go
CREATE TABLE [Worker] (
  [Worker_ID] Int NOT NULL identity(1,1),
  [First_Name] Varchar(15) NOT NULL,
  [Last_Name] Varchar(20) NOT NULL,
  [Email] Varchar(255) NOT NULL,
  [Password_Hash] Varchar(255) NOT NULL,
  [Account_Status] VARCHAR(20) NOT NULL DEFAULT 'pending',
  [Created_At] DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
  [Updated_At] DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
  PRIMARY KEY ([Worker_ID]),
  CONSTRAINT UQ_Worker_Email UNIQUE (Email),
  CONSTRAINT Chk_Worker_Status CHECK (Account_Status IN ('pending', 'active', 'suspended', 'deleted'))
);

CREATE TABLE [Rink_Temp_Humidity] (
  [Rink_Temp_Humidity_ID] Int NOT NULL identity(1,1),
  [Rink_Temp_Humidity_Date] Date NOT NULL,
  [Temperature] Int NOT NULL,
  [Humidity] Int NOT NULL,
  [Worker_ID] Int,
  PRIMARY KEY ([Rink_Temp_Humidity_ID]),
  CONSTRAINT [FK_Rink_Temp_Humidity_Worker_ID]
    FOREIGN KEY ([Worker_ID])
      REFERENCES [Worker]([Worker_ID])
);

CREATE TABLE [Natural_Gas_Stats] (
  [Natural_Gas_Stats_ID] Int NOT NULL identity(1,1),
  [Natural_Gas_Billing_Date] Date NOT NULL,
  [Natural_Gas_Read_Date] Date NOT NULL,
  [Natural_Gas_Billing_Days] Int NOT NULL,
  [Other_Gas_Charges] Decimal(10,2) NOT NULL,
  [Previous_Balance_And_Adjustments_Gas] Decimal(10,2) NOT NULL,
  [Base_Gas_Cost] Decimal(10,2) NOT NULL,
  [Purchase_Gas_Adjustment] Decimal(10,2) NOT NULL,
  [Distribution_Charge] Decimal(10,2) NOT NULL,
  [Customer_Charge] Decimal(10,2) NOT NULL,
  [Tax_Cost] Decimal(10,2) NOT NULL,
  [Natural_Gas_Used_Therms] Decimal(10,1) NOT NULL,
  [Gas_Heating_Degree_Days] Int NOT NULL,
  [Gas_Cooling_Degree_Days] Int NOT NULL,
  [Worker_ID] Int,
  PRIMARY KEY ([Natural_Gas_Stats_ID]),
  CONSTRAINT [FK_Natural_Gas_Stats_Worker_ID]
    FOREIGN KEY ([Worker_ID])
      REFERENCES [Worker]([Worker_ID])
);

CREATE TABLE [Zamboni] (
  [Zamboni_ID] Int NOT NULL identity(1,1),
  [Zamboni] varchar(10) NOT NULL,
  PRIMARY KEY ([Zamboni_ID]),
  CONSTRAINT Chk_Zamboni_Zam_Status check (Zamboni IN ('Boucher', 'Baxter', 'Quality'))

);

CREATE TABLE [Zam_Maintenance] (
  [Zam_Maintenance_ID] Int NOT NULL identity(1,1),
  [Zam_Maintenance_Date] Date NOT NULL,
  [Maintenance_Done] Varchar(20) NOT NULL,
  [Notes] Varchar(15),
  [Blade_Inventory] Int NOT NULL,
  [Blade_Width] Decimal(5,4),
  [Zamboni_ID] Int,
  [Worker_ID] Int,
  PRIMARY KEY ([Zam_Maintenance_ID]),
  CONSTRAINT [FK_Zam_Maintenance_Worker_ID]
    FOREIGN KEY ([Worker_ID])
      REFERENCES [Worker]([Worker_ID]),
  CONSTRAINT [FK_Zam_Maintenance_Zamboni_ID]
    FOREIGN KEY ([Zamboni_ID])
      REFERENCES [Zamboni]([Zamboni_ID])
);

CREATE TABLE [Facility_HVAC_Filter] (
  [Facility_HVAC_Filter_ID] Int NOT NULL identity(1,1),
  [Facility_Change_Date] Date NOT NULL,
  [20x25_Changed] varchar(10) not null,
  [20x20_Changed] varchar(10) not null,
  [16x22_Changed] varchar(10) not null,
  [20x25_Inventory] Int NOT NULL,
  [20x20_Inventory] Int NOT NULL,
  [16x22_Inventory] Int NOT NULL,
  [Notes] Varchar(15),
  [Worker_ID] Int,
  CONSTRAINT Chk_Facility_HVAC_Filter_Fac_20x25_Status check ([20x25_Changed] IN ('Yes', 'No', 'Not Operating')),
  CONSTRAINT Chk_Facility_HVAC_Filter_Fac_20x20_Status check ([20x20_Changed] IN ('Yes', 'No', 'Not Operating')),
  CONSTRAINT Chk_Facility_HVAC_Filter_Fac_16x22_Status check ([16x22_Changed] IN ('Yes', 'No', 'Not Operating')),
  PRIMARY KEY ([Facility_HVAC_Filter_ID]),
  CONSTRAINT [FK_Facility_HVAC_Filter_Worker_ID]
    FOREIGN KEY ([Worker_ID])
      REFERENCES [Worker]([Worker_ID])
);

CREATE TABLE [Ice_Depth_Readings] (
  [Reading_ID] Int NOT NULL identity(1,1),
  [Reading_Date] Date NOT NULL,
  [Zone_ID] TinyInt NOT NULL,
  [Ice_Depth] Decimal(5,2) NOT NULL,
  [Worker_ID] Int,
  PRIMARY KEY ([Reading_ID]),
  CONSTRAINT [FK_Ice_Depth_Readings_Worker_ID]
    FOREIGN KEY ([Worker_ID])
      REFERENCES [Worker]([Worker_ID])
);

CREATE TABLE [Ice_Maintenance] (
  [Ice_Maintenance_ID] Int NOT NULL identity(1,1),
  [Ice_Maintenance_Date] Date NOT NULL,
  [Edged] varchar(10) not null,
  [Chipped] varchar(10) not null,
  [Cross_Cut] varchar(10) not null,
  [Hand_Flood] varchar(10) not null,
  [Notes] Varchar(20),
  [Worker_ID] Int,
  PRIMARY KEY ([Ice_Maintenance_ID]),
  CONSTRAINT Chk_Ice_Maintenance_Edged_Status check (Edged IN ('Yes', 'Corners', 'NA')),
  CONSTRAINT Chk_Ice_Maintenance_Chipped_Status check (Edged IN ('Yes', 'No', 'NA')),
  CONSTRAINT Chk_Ice_Maintenance_Cross_Cut_Status check (Edged IN ('Yes', 'No', 'NA')),
  CONSTRAINT Chk_Ice_Maintenance_Hand_Flood_Status check (Edged IN ('Yes', 'No', 'NA')),
  CONSTRAINT [FK_Ice_Maintenance_Worker_ID]
    FOREIGN KEY ([Worker_ID])
      REFERENCES [Worker]([Worker_ID])
);

CREATE TABLE [Rink_HVAC_Filter] (
  [Rink_HVAC_Filter_ID] Int NOT NULL identity(1,1),
  [Rink_Change_Date] Date NOT NULL,
  [20x20_Changed] Varchar(20),
  [24x24_Changed] Varchar(20),
  [18x24_Changed] Varchar(20),
  [20x20_Inventory] Int,
  [24x24_Inventory] Int,
  [18x24_Inventory] Int,
  [Notes] Varchar(15),
  [Worker_ID] Int,
  CONSTRAINT Chk_20x20_Status check ([20x20_Changed] IN ('Yes', 'No', 'Not Operating')),
  CONSTRAINT Chk_24x24_Status check ([24x24_Changed] IN ('Yes', 'No', 'Not Operating')),
  CONSTRAINT Chk_18x24_Status check ([18x24_Changed] IN ('Yes', 'No', 'Not Operating')),
  PRIMARY KEY ([Rink_HVAC_Filter_ID]),
  CONSTRAINT [FK_Rink_HVAC_Filter_Worker_ID]
    FOREIGN KEY ([Worker_ID])
      REFERENCES [Worker]([Worker_ID])
);

CREATE TABLE [Rink_Misc_Maintenance] (
  [Rink_Misc_Maintenance_ID] Int NOT NULL identity(1,1),
  [Rink_Misc_Maintenance_Date] Date NOT NULL,
  [Task] Varchar(35),
  [Notes] Varchar(45),
  [Worker_ID] Int,
  PRIMARY KEY ([Rink_Misc_Maintenance_ID]),
  CONSTRAINT [FK_Rink_Misc_Maintenance_Worker_ID]
    FOREIGN KEY ([Worker_ID])
      REFERENCES [Worker]([Worker_ID])
);

CREATE TABLE [Glycol_Machine] (
  [Glycol_Machine_ID] Int NOT NULL identity(1,1),
  [Glycol_Machine_Date] Date NOT NULL,
  [Before_Pressure_Return_PSI] Int Not NUll,
  [Before_Pressure_Out_PSI] Int Not NUll,
  [Before_Measure_Line] Char(7) Not NUll,
  [After_Pressure_Return_PSI] Int Not NUll,
  [After_Pressure_Out_PSI] Int Not NUll,
  [After_Measure_Line] Char(7) Not NUll,
  [Gallons_Added] Int Not NUll,
  [Notes] Varchar(50),
  [Worker_ID] Int,
  PRIMARY KEY ([Glycol_Machine_ID]),
  CONSTRAINT Chk_Before_Status check ([Before_Measure_Line] IN ('Above', 'Below', 'At')),
  CONSTRAINT Chk_After_Status check ([After_Measure_Line] IN ('Above', 'Below', 'At')),
  CONSTRAINT [FK_Glycol_Machine_Worker_ID]
    FOREIGN KEY ([Worker_ID])
      REFERENCES [Worker]([Worker_ID])
);

CREATE TABLE [Electricity_Stats] (
  [Electricity_Stats_ID] Int NOT NULL identity(1,1),
  [Electricity_Billing_Date] Date NOT NULL,
  [Electricity_Read_Date] Date NOT NULL,
  [Electricity_Billing_Days] Int NOT NULL,
  [On_Peak_Energy_Charges] Decimal(10,2) NOT NULL,
  [Off_Peak_Energy_Charges] Decimal(10,2) NOT NULL,
  [System_Demand_Charges] Decimal(10,2) NOT NULL,
  [Customer_Demand_Charges] Decimal(10,2) NOT NULL,
  [Customer_Charge] Int NOT NULL,
  [Other_Charges] Decimal(10,2) NOT NULL,
  [Tax_Cost] Decimal(10,2) NOT NULL,
  [Summary_Of_Other_Charges] Decimal(10,2) NOT NULL,
  [Previous_Balance_And_Adjustments_Electric] Decimal(10,2) NOT NULL,
  [On_Peak_Energy_Usage_kWh] Int NOT NULL,
  [Off_Peak_Energy_Usage_kWh] Int NOT NULL,
  [System_Demand_kW] Int NOT NULL,
  [Customer_Demand_kW] int NOT NULL,
  [Electricity_Heating_Degree_Days] Int NOT NULL,
  [Electricity_Cooling_Degree_Days] Int NOT NULL,
  [Worker_ID] Int,
  PRIMARY KEY ([Electricity_Stats_ID]),
  CONSTRAINT [FK_Electricity_Stats_Worker_ID]
    FOREIGN KEY ([Worker_ID])
      REFERENCES [Worker]([Worker_ID])
);

CREATE TABLE [Zam_Schedule] (
  [Zam_Schedule_ID] Int NOT NULL identity(1,1),
  [Zam_Schedule_Date] Date NOT NULL,
  [Notes] Varchar(15),
  [Zamboni_ID] Int,
  [Worker_ID] Int
  PRIMARY KEY ([Zam_Schedule_ID]),
  CONSTRAINT [FK_Zam_Schedule_Zamboni_ID]
    FOREIGN KEY ([Zamboni_ID])
      REFERENCES [Zamboni]([Zamboni_ID]),
  CONSTRAINT [FK_Zam_Schedule_Worker_ID]
    FOREIGN KEY ([Worker_ID])
      REFERENCES [Worker]([Worker_ID])
);

CREATE TABLE Ponds_Weather_Meteo (
    Ponds_Weather_ID INT IDENTITY(1,1) PRIMARY KEY,

    Ponds_Weather_Date DATE NOT NULL,

    Max_Temperature DECIMAL(6,2),
    Min_Temperature DECIMAL(6,2),
    Avg_Relative_Humidity DECIMAL(5,2),
    Avg_Dew_Point DECIMAL(6,2),

    CONSTRAINT UQ_Ponds_Weather_Meteo_Date
        UNIQUE (Ponds_Weather_Date)
);