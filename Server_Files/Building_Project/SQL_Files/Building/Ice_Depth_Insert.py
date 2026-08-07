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

df = pd.read_csv("D:\other-files\school\database_dev\The-Windigo-Data-Team-Summer-2026\Ice Depth Project\Ice_Depth_File_Converter\Windigo_Ice_Depths_Pivot.csv")
print("Actual CSV Columns:", df.columns.tolist())

df = df.rename(
    columns={
        "Date": "Reading_Date",
        "Zone": "Zone_ID",
        "Depth": "Ice_Depth"
    }
)

df["Reading_Date"] = pd.to_datetime(df["Reading_Date"])

target_columns = ["Reading_Date", "Zone_ID", "Ice_Depth"]

df = df[target_columns]

target_table = "Ice_Depth_Readings"
df.sort_values(by="Reading_Date", ascending=True)

df.to_sql(name=target_table, con=engine, if_exists="append", index=False)

print("Specified data successfully inserted!")
