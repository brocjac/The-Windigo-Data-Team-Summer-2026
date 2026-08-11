import os
from pathlib import Path
import pandas as pd
from urllib.parse import quote_plus

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError


import openmeteo_requests
import pandas as pd
import requests_cache
from retry_requests import retry
from dotenv import load_dotenv
import requests

project_root = Path(__file__).resolve().parents[2]
env_path = project_root / ".env"

print("Looking for .env at:", env_path)
print("Exists:", env_path.exists())

load_dotenv(env_path)

print("Server:", os.getenv("DB_SERVER"))
print("Database:", os.getenv("DB_NAME"))
print("User:", os.getenv("DB_USER"))
print("Driver:", os.getenv("DB_DRIVER"))
print("Password loaded:", bool(os.getenv("DB_PASSWORD")))

server = os.getenv("DB_SERVER")
database = os.getenv("DB_NAME")
username = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
driver = os.getenv("DB_DRIVER")

odbc_connection = (
    f"DRIVER={{{driver}}};"
    f"SERVER={server};"
    f"DATABASE={database};"
    f"UID={username};"
    f"PWD={password};"
    "Encrypt=yes;"
    "TrustServerCertificate=yes;"
)

connection_url = (
    "mssql+pyodbc:///?odbc_connect="
    + quote_plus(odbc_connection)
)

engine = create_engine(
    connection_url,
    pool_pre_ping=True
)

# try:
#     with engine.connect() as connection:
#         result = connection.execute(
#             text("""
#                 SELECT
#                     @@SERVERNAME AS ServerName,
#                     DB_NAME() AS DatabaseName,
#                     SUSER_SNAME() AS LoginName,
#                     @@VERSION AS SQLVersion
#         """)
#         )

#         row = result.fetchone()

#         print("Connection successful!")
#         print(f"Server: {row.ServerName}")
#         print(f"Database: {row.DatabaseName}")
#         print(f"Login: {row.LoginName}")
#         print(f"Version: {row.SQLVersion}")
# except SQLAlchemyError as error:
#     print("Connection FAILED!")
#     print(type(error).__name__)
#     print(error)

query = text("""select Electricity_Read_Date, Electricity_Billing_Days from Electricity_Stats""")

with engine.connect() as connection:
    electric_df = pd.read_sql(query, connection)

print(electric_df.head())

query = text("""select Natural_Gas_Read_Date, Natural_Gas_Billing_Days from Natural_Gas_Stats""")

with engine.connect() as connection:
    gas_df = pd.read_sql(query, connection)

print(gas_df.head())

gas_df["Natural_Gas_Read_Date"] = pd.to_datetime(
    gas_df["Natural_Gas_Read_Date"],
    errors="coerce"
)

gas_df["Natural_Gas_Billing_Days"] = pd.to_numeric(
    gas_df["Natural_Gas_Billing_Days"],
    errors="coerce"
)

electric_df["Electricity_Read_Date"] = pd.to_datetime(
    electric_df["Electricity_Read_Date"],
    errors="coerce"
)

electric_df["Electricity_Billing_Days"] = pd.to_numeric(
    electric_df["Electricity_Billing_Days"],
    errors="coerce"
)

gas_df["gas_start_date"] = (
    gas_df["Natural_Gas_Read_Date"]
    - pd.to_timedelta(
        gas_df["Natural_Gas_Billing_Days"] - 1,
        unit="D"
    )
)

electric_df["electricity_start_date"] = (
    electric_df["Electricity_Read_Date"]
    - pd.to_timedelta(
        electric_df["Electricity_Billing_Days"] - 1,
        unit="D"
    )
)

absolute_start = min(
    gas_df["gas_start_date"].min(),
    electric_df["electricity_start_date"].min()
)

absolute_end = max(
    gas_df["Natural_Gas_Read_Date"].max(),
    electric_df["Electricity_Read_Date"].max()
)

start_date = pd.to_datetime(absolute_start).strftime("%Y-%m-%d")
end_date = pd.to_datetime(absolute_end).strftime("%Y-%m-%d")