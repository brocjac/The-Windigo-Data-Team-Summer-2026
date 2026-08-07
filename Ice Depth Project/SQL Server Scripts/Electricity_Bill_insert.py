import pandas as pd
import urllib
import pyodbc
from sqlalchemy import create_engine

server = "192.168.1.48\WINDIGODATABASE,1433"      # e.g., '192.168.1.50' or 'localhost'
database = "The_Ponds_Building_DB"
username = "WindigoWayTheAdminWay"   # e.g., 'sa' or a custom user
password = "Win!Go#26$14&32"

# 2. Build connection string
conn_str = (
    "DRIVER={ODBC Driver 17 for SQL Server};"
    f"SERVER={server};"
    f"DATABASE={database};"
    f"UID={username};"
    f"PWD={password};"
)
try:
    conn = pyodbc.connect(conn_str)
    cursor = conn.cursor()
    print("Successfully connected using SQL Server Authentication!")

    # Test query
    cursor.execute("SELECT @@VERSION")
    print("Database Version: ", cursor.fetchone()[0])

    cursor.close()
    conn.close()
except Exception as e:
    print("Connection failed:", e)

params = urllib.parse.quote_plus(conn_str)
engine = create_engine(f"mssql+pyodbc:///?odbc_connect={params}")

df = pd.read_excel(
    "D:\\other-files\\school\\database_dev\\The-Windigo-Data-Team-Summer-2026\\Ice Depth Project\\Source_Documents - Items to be copied\\billing_data\\BillHistory_Account_Electric.xlsx"
)
print("Actual Excel Columns:", df.columns.tolist())

df = df.rename(
    columns={
        "Bill date" : "Electricity_Billing_Date",
        "Read date" : "Electricity_Read_Date",
        "Billing days" : "Electricity_Billing_Days",
        "On-peak energy charges" : "On_Peak_Energy_Charges",
        "Off-peak energy charges" : "Off_Peak_Energy_Charges",
        "System demand charge" : "System_Demand_Charges",
        "Customer demand charge" : "Customer_Demand_Charges",
        "Customer charge" : "Customer_Charge",
        "Other charges" : "Other_Charges",
        "Taxes" : "Tax_Cost",
        "Summary of Other charges" : "Summary_Of_Other_Charges",
        "Previous balance and adjustments" : "Previous_Balance_And_Adjustments_Electric",
        "On-peak electricity used (kWh)" : "On_Peak_Energy_Usage_kWh",
        "Off-peak electricity used (kWh)" : "Off_Peak_Energy_Usage_kWh",
        "System demand (kW)" : "System_Demand_kW",
        "Customer demand (kW)": "Customer_Demand_kW",
        "Heating degree days" : "Electricity_Heating_Degree_Days",
        "Cooling degree days" : "Electricity_Cooling_Degree_Days"
    }
)

target_columns = [
    "Electricity_Billing_Date",
    "Electricity_Read_Date",
    "Electricity_Billing_Days",
    "On_Peak_Energy_Charges",
    "Off_Peak_Energy_Charges",
    "System_Demand_Charges",
    "Customer_Demand_Charges",
    "Customer_Charge",
    "Other_Charges",
    "Tax_Cost",
    "Summary_Of_Other_Charges",
    "Previous_Balance_And_Adjustments_Electric",
    "On_Peak_Energy_Usage_kWh",
    "Off_Peak_Energy_Usage_kWh",
    "System_Demand_kW",
    "Customer_Demand_kW",
    "Electricity_Heating_Degree_Days",
    "Electricity_Cooling_Degree_Days"
]

df = df[target_columns]

target_table = "Electricity_Stats"

df.to_sql(name=target_table, con=engine, if_exists="append", index=False)

print("Specified data successfully inserted!")
