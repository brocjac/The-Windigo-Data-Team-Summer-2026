Create or alter Procedure dbo.Ponds_Electricity_Analysis
as
begin
	set nocount on;
	select
		es.Electricity_Billing_Date as 'Electricity Billing Date',
		es.Electricity_Read_Date as 'Electricity Read Date',
		es.Electricity_Billing_Days as 'Electricity Billing Days',
		es.On_Peak_Energy_Charges as 'On Peak Energy Charges',
		es.Off_Peak_Energy_Charges as 'Off Peak Energy Charges',
		es.System_Demand_Charges as 'System Demand Charges',
		es.Customer_Demand_Charges as 'Customer Demand Charges',
		es.Customer_Charge as 'Customer Charge',
		es.Other_Charges as 'Other Charges',
		es.Tax_Cost as 'Tax Cost',
		es.On_Peak_Energy_Usage_kWh as 'On Peak Energy Usage kWh',
		es.Off_Peak_Energy_Usage_kWh as 'Off Peak Energy Usage kWh',
		es.System_Demand_kW as 'System Demand kW',
		es.Customer_Demand_kW as 'Customer Demand kW',
		es.Electricity_Heating_Degree_Days as 'Electricity Heating Degree Days',
		es.Electricity_Cooling_Degree_Days as 'Electricity Cooling Degree Days',
		es.Summary_Of_Other_Charges + es.Previous_Balance_And_Adjustments_Electric as 'Summary of Other Electricity Charges',
		es.On_Peak_Energy_Charges + es.Off_Peak_Energy_Charges + es.System_Demand_Charges + es.Customer_Demand_Charges + es.Customer_Charge + es.Other_Charges + es.Tax_Cost as 'Total Electric Charges',
		(es.On_Peak_Energy_Charges + es.Off_Peak_Energy_Charges + es.System_Demand_Charges + es.Customer_Demand_Charges + es.Customer_Charge + es.Other_Charges + es.Tax_Cost) / es.Electricity_Billing_Days as 'Avg Electric Cost / Day',
		es.On_Peak_Energy_Charges + es.Off_Peak_Energy_Charges + es.System_Demand_Charges + es.Customer_Demand_Charges + es.Customer_Charge + es.Other_Charges + es.Tax_Cost + es.Summary_Of_Other_Charges + es.Previous_Balance_And_Adjustments_Electric as 'Total Electric Bill',
		es.Off_Peak_Energy_Usage_kWh + es.On_Peak_Energy_Usage_kWh as 'Total On / Off Peak Electricity Used kWh',
		(es.Off_Peak_Energy_Usage_kWh + es.On_Peak_Energy_Usage_kWh) / es.Electricity_Billing_Days as 'Avg Electric kWh / Day',
		DATEADD(day, -(cast(es.Electricity_Billing_Days as int) - 1), es.Electricity_Billing_Date) as 'Electric Start Date',
		es.Worker_ID
	from Electricity_Stats es
end
go
Create or alter Procedure dbo.Ponds_Natural_Gas_Analysis
as
begin
	set nocount on;
	select
		ngs.Natural_Gas_Billing_Date as 'Natural Gas Billing Date',
		ngs.Natural_Gas_Read_Date as 'Natural Gas Read Date',
		ngs.Natural_Gas_Billing_Days as 'Natural Gas Billing Days',
		ngs.Other_Gas_Charges as 'Other Gas Charges',
		ngs.Previous_Balance_And_Adjustments_Gas as 'Previous Balance And Adjustments Gas',
		ngs.Base_Gas_Cost as 'Base Gas Cost',
		ngs.Purchase_Gas_Adjustment as 'Purchase Gas Adjustment',
		ngs.Distribution_Charge as 'Distribution Charge',
		ngs.Customer_Charge as 'Customer Charge',
		ngs.Tax_Cost as 'Tax Cost',
		ngs.Natural_Gas_Used_Therms as 'Natural Gas Used Therms',
		ngs.Gas_Heating_Degree_Days as 'Gas Heating Degree Days',
		ngs.Gas_Cooling_Degree_Days as 'Gas Cooling Degree Days',
		ngs.Previous_Balance_And_Adjustments_Gas + ngs.Base_Gas_Cost + ngs.Purchase_Gas_Adjustment + ngs.Distribution_Charge + ngs.Customer_Charge + ngs.Tax_Cost as 'Total Bill',
		ngs.Base_Gas_Cost + ngs.Purchase_Gas_Adjustment + ngs.Distribution_Charge + ngs.Customer_Charge + ngs.Tax_Cost as 'Total Natural Gas Charges',
		(ngs.Base_Gas_Cost + ngs.Purchase_Gas_Adjustment + ngs.Distribution_Charge + ngs.Customer_Charge + ngs.Tax_Cost) / ngs.Natural_Gas_Billing_Days as 'Avg Gas cost / day',
		ngs.Natural_Gas_Used_Therms/ngs.Natural_Gas_Billing_Days as 'Avg Gas therms / day',
		DATEADD(day, -(cast(ngs.Natural_Gas_Billing_Days as int) - 1), ngs.Natural_Gas_Billing_Date) as 'Natural Gas Start Date',
		ngs.Worker_ID
	from Natural_Gas_Stats ngs
end
go
create or alter Procedure dbo.The_Ponds_Weather_Analysis
as
begin
	set nocount on;
	with ConvertedInput as (
		select
			Rink_Temp_Humidity_ID,
			((Temperature - 32.0)*5.0/9.0) as temp_c,
			(Humidity / 100.0) as rh_decimal
		from Rink_Temp_Humidity
	),
	CalculatedAlpha as (
		select
			Rink_Temp_Humidity_ID,
			temp_c,
			(LOG(rh_decimal) + ((17.625 * temp_c) / (243.04 + temp_c))) as alpha
		from ConvertedInput
	),
	DewPointCelcius as (
		select
			Rink_Temp_Humidity_ID,
			((243.04 * alpha) / (17.625 - alpha)) as dew_point_c
		from CalculatedAlpha
	)
	select
		Temperature as 'Temperature F',
		Humidity,
		ROUND(((dew_point_c * 9.0 / 5.0) + 32.0), 2) as 'Dew Point'
	from Rink_Temp_Humidity rth
	join DewPointCelcius dpc on rth.Rink_Temp_Humidity_ID = dpc.Rink_Temp_Humidity_ID
end

go
select column_name
from INFORMATION_SCHEMA.COLUMNS
where TABLE_NAME = 'Natural_Gas_Stats';

SELECT
    COLUMN_NAME,
    DATA_TYPE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Electricity_Stats'
  AND COLUMN_NAME IN ('Electricity_Billing_Days', 'Electricity_Billing_Date');

SELECT 
    SCHEMA_NAME(t.schema_id) AS SchemaName,
    t.name AS TableName,
    SUM(p.rows) AS TotalRowCount
FROM 
    sys.tables AS t
INNER JOIN 
    sys.partitions AS p ON t.object_id = p.object_id
WHERE 
    p.index_id IN (0, 1) -- 0 = Heap (no index), 1 = Clustered Index
    AND t.is_ms_shipped = 0 -- Exclude system tables
GROUP BY 
    t.schema_id, t.name
ORDER BY 
    TotalRowCount DESC;

go