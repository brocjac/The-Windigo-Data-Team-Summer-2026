import pandas as pd
import urllib
import pyodbc
from dotenv import load_dotenv
import os
from pathlib import Path
from urllib.parse import quote_plus
from sqlalchemy import create_engine

server_files_path = Path(__file__).resolve().parents[3]

env_path = server_files_path / ".env"
log_path = server_files_path / "ponds_weather.log"

# 2. Build connection string
load_dotenv(env_path)

server = os.getenv("DB_SERVER")
database = os.getenv("DB_NAME")
username = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
driver = os.getenv("DB_DRIVER")

required_env = {
    "DB_SERVER": server,
    "DB_NAME": database,
    "DB_USER": username,
    "DB_PASSWORD": password,
    "DB_DRIVER": driver
}

odbc_connection = (
    f"DRIVER={{{driver}}};"
    f"SERVER={server};"
    f"DATABASE={database};"
    f"UID={username};"
    f"PWD={password};"
    "Encrypt=yes;"
    "TrustServerCertificate=no;"
)

connection_url = (
    "mssql+pyodbc:///?odbc_connect="
    + quote_plus(odbc_connection)
)

engine = create_engine(
    connection_url,
    pool_pre_ping=True
)

df = pd.read_excel("D:\other-files\school\database_dev\The-Windigo-Data-Team-Summer-2026\Ice Depth Project\Ponds Operations.xlsx", sheet_name='Des Filter')
print("Actual CSV Columns:", df.columns.tolist())

df = df.rename(
    columns={
        "Date Changed":"Rink_Change_Date",
        "20 x 20c":"20x20_Changed",
        "24 x 24c":"24x24_Changed",
        "18 x 24c":"18x24_Changed",
        "20 x 20i":"20x20_Inventory",
        "24 x 24i":"24x24_Inventory",
        "18x 24i":"18x24_Inventory",
        "Notes":"Notes"
    }
)

df["Rink_Change_Date"] = pd.to_datetime(df["Rink_Change_Date"])

target_columns = ["Rink_Change_Date", "20x20_Changed", "24x24_Changed", "18x24_Changed", "20x20_Inventory", "24x24_Inventory", "18x24_Inventory", "Notes"]

df = df[target_columns]

target_table = "Rink_Des_HVAC_Filter"
df.sort_values(by="Rink_Change_Date", ascending=True)

df.to_sql(name=target_table, con=engine, if_exists="append", index=False)

print("Specified data successfully inserted!")
