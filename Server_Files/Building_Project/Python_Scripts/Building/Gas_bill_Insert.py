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
    "D:\\other-files\\school\\database_dev\\The-Windigo-Data-Team-Summer-2026\\Ice Depth Project\\Source_Documents - Items to be copied\\billing_data\\BillHistory_Account_Gas.xlsx"
)
print("Actual Excel Columns:", df.columns.tolist())

df = df.rename(
    columns={
        "Bill date" : "Natural_Gas_Billing_Date",
        "Read date" : "Natural_Gas_Read_Date",
        "Billing days" : "Natural_Gas_Billing_Days",
        "Other charges" : "Other_Gas_Charges",
        "Previous balance and adjustments" : "Previous_Balance_And_Adjustments_Gas",
        "Base gas cost" : "Base_Gas_Cost",
        "Purchase gas adjustment" : "Purchase_Gas_Adjustment",
        "Distribution charge" : "Distribution_Charge",
        "Customer charge" : "Customer_Charge",
        "Taxes" : "Tax_Cost",
        "Natural gas used (therms)" : "Natural_Gas_Used_Therms",
        "Heating degree days" : "Gas_Heating_Degree_Days",
        "Cooling degree days" : "Gas_Cooling_Degree_Days"
    }
)

target_columns = [
    "Natural_Gas_Billing_Date",
    "Natural_Gas_Read_Date",
    "Natural_Gas_Billing_Days",
    "Other_Gas_Charges",
    "Previous_Balance_And_Adjustments_Gas",
    "Base_Gas_Cost",
    "Purchase_Gas_Adjustment",
    "Distribution_Charge",
    "Customer_Charge",
    "Tax_Cost",
    "Natural_Gas_Used_Therms",
    "Gas_Heating_Degree_Days",
    "Gas_Cooling_Degree_Days"
]

df = df[target_columns]

target_table = "Natural_Gas_Stats"

df.to_sql(name=target_table, con=engine, if_exists="append", index=False)

print("Specified data successfully inserted!")
