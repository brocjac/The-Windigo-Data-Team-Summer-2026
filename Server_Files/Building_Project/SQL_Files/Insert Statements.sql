USE [The_Ponds_Building_DB]
GO

INSERT INTO [dbo].[Rink_Misc_Maintenance]
           ([Rink_Misc_Maintenance_Date]
           ,[Task]
           ,[Notes])
     VALUes
        ('4/29/2026', 'Water Fountain Filters', 'Changed Water Fountain Filters'),
        ('4/29/2026', 'Replaced Bulbs', 'Replaced Bulbs in skate sharpener room.');
GO

go
insert into Zamboni (Zamboni)
values
    ('Boucher'),
    ('Baxter'),
    ('Quality');

go

select * from Zamboni

go
insert into [dbo].[Zam_Schedule] ([Zam_Schedule_Date],[Zamboni_ID], Notes)
values
    ('10/3/2025', 2, ''),
    ('11/4/2025', 1, ''),
    ('12/6/2026', 2, ''),
    ('1/12/2026', 3, ''),
    ('1/26/2026', 1, ''),
    ('3/5/2026', 3, ''),
    ('3/22/2026', 1, ''),
    ('4/8/2026', 3, ''),
    ('5/13/2026', 2, 'Transmission issues'),
    ('5/28/2026', 1, ''),
    ('7/14/2026', 3, ''),
    ('7/17/2026', 1, '')

go

go
insert into Glycol_Machine (Glycol_Machine_Date, Before_Pressure_Return_PSI, Before_Pressure_Out_PSI, Before_Measure_Line, After_Pressure_Return_PSI, After_Pressure_Out_PSI, After_Measure_Line, Gallons_Added, Notes)
values ('4/15/2026', 10, 38, 'Below', 12, 39, 'At', 20, 'Added 20 gal. of glycol to machine.');

go

go
insert into Rink_Temp_Humidity (Rink_Temp_Humidity_Date, Temperature, Humidity)
values 
    ('2/13/2026',	50,	14),
    ('2/16/2026',	50,	44),
    ('2/18/2026',	49,	30),
    ('2/22/2026',	48,	31),
    ('2/26/2026',	49,	31),
    ('2/27/2026',	49,	37),
    ('3/31/2026',	49,	35),
    ('4/6/2026',    48,	36),
    ('4/10/2026',	50,	42),
    ('4/15/2026',	49,	39),
    ('4/16/2026',	51,	32),
    ('4/23/2026',	48,	30),
    ('4/26/2026',	48,	32),
    ('4/28/2026',	50,	34),
    ('5/2/2026',    48,	38),
    ('5/4/2026',    51,	33),
    ('5/20/2026',	50,	34),
    ('6/9/2026',    54,	32),
    ('6/29/2026',	57,	37),
    ('7/14/2026',	59,	39),
    ('7/15/2026',	61,	34);
go

insert into Maintenance_Category (Maintenance_Type)
values
    ('Engine'),
    ('Cooling System'),
    ('Hydraulic System'),
    ('Ice Making Components'),
    ('Drive & Chassis'),
    ('Elevator / Auger'),
    ('Electrical'),
    ('Repairs / Issues'),
    ('Inspection')
go

insert into Maintenance_Checks_and_Repairs (Checks_and_Repairs, Maintenance_Category_ID)
values
    ('Oil Changed', 1),
    ('Oil Checked', 1),
    ('Oil Filter Replaced', 1),
    ('Air Filter Replaced', 1),
    ('Spark Plugs Replaced (gas/propane)', 1),
    ('Battery Checked', 1),
    ('Battery Replaced', 1),
    ('Belts Replaced', 1),

    ('Coolant Checked', 2),
    ('Coolant Added', 2),
    ('Coolant Changed', 2),
    ('Radiator Cleaned', 2),
    ('Water Pump Replaced', 2),
    ('Hoses Replaced', 2),

    ('Hydraulic Oil Checked', 3),
    ('Hydraulic Oil Changed', 3),
    ('Hydraulic Filter Replaced', 3),
    ('Hydraulic Leak Repaired', 3),

    ('Blade Changed', 4),
    ('Blade Adjusted', 4),
    ('Blade Sharpened', 4),
    ('Blade Holder Serviced', 4),
    ('Towel/Rag Replaced', 4),
    ('Wash Water Filter Cleaned', 4),
    ('Water Nozzles Cleaned', 4),

    ('New Tires', 5),
    ('Tire Pressure Checked', 5),
    ('Wheel Bearings Serviced', 5),
    ('Grease Applied', 5),
    ('Grease Points Serviced', 5),
    ('Steering Adjusted', 5),
    ('Brakes Serviced', 5),

    ('Elevator Chain Serviced', 6),
    ('Elevator Chain Adjusted', 6),
    ('Chain Replaced', 6),
    ('Bearings Replaced', 6),
    ('Conveyor Inspected', 6),

    ('Lights Repaired', 7),
    ('Warning Beacon Repaired', 7),
    ('Wiring Repaired', 7),
    ('Sensors Checked', 7),
    ('Switches Replaced', 7),

    ('Engine Issue', 8),
    ('Transmission Issue', 8),
    ('Hydraulic Issue', 8),
    ('Electrical Issue', 8),
    ('Cooling System Issue', 8),
    ('Water System Issue', 8),
    ('Leak Repaired', 8),
    ('Other Repair', 8),

    ('Annual Inspection', 9),
    ('Safety Inspection', 9),
    ('Test Drive Completed', 9),
    ('Machine Cleaned', 9)

go


SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Maintenance_Checks_and_Repairs';

select * from Maintenance_Checks_and_Repairs

truncate table Ice_Depth_Readings


