import os
from pathlib import Path
from urllib.parse import quote_plus

import pandas as pd
import requests
import openmeteo_requests

from dotenv import load_dotenv
from retry_requests import retry
from sqlalchemy import create_engine, text

# ---------------------------------------------------------
# 1. Hubspot From start and end of Electricity and Gas Billing
# ---------------------------------------------------------

env_path = Path(__file__).resolve().parents[3] / ".env"

print("Looking for .env at:", env_path)
print("Exists:", env_path.exists())

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

missing = [
    name for name, value in required_env.items()
    if not value
]

if missing:
    raise RuntimeError(
        f"Missing environment variables: {', '.join(missing)}"
    )

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

electric_query = text("""select Electricity_Read_Date, Electricity_Billing_Days from Electricity_Stats""")

gas_query = text("""select Natural_Gas_Read_Date, Natural_Gas_Billing_Days from Natural_Gas_Stats""")

with engine.connect() as connection:
    electric_df = pd.read_sql(electric_query, connection)
    gas_df = pd.read_sql(gas_query, connection)

gas_df = gas_df.dropna(
    subset=[
        "Natural_Gas_Read_Date",
        "Natural_Gas_Billing_Days"
    ]
)

electric_df = electric_df.dropna(
    subset=[
        "Electricity_Read_Date",
        "Electricity_Billing_Days"
    ]
)

print(gas_df.head())
print(electric_df.head())

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

if gas_df.empty:
    raise ValueError("Natural_Gas_Stats returned no records.")

if electric_df.empty:
    raise ValueError("Electricity_Stats returned no records.")

start_date = pd.to_datetime(absolute_start).strftime("%Y-%m-%d")
end_date = pd.to_datetime(absolute_end).strftime("%Y-%m-%d")


# ---------------------------------------------------------
# 2. GLOBAL COORDINATES FOR THE PONDS
# ---------------------------------------------------------
PONDS_LAT = 43.07036380872471
PONDS_LON = -88.12443039077134

print("\nUsing Ponds coordinates:")
print(f"Latitude:  {PONDS_LAT}")
print(f"Longitude: {PONDS_LON}\n")

# ---------------------------------------------------------
# 3. SETUP OPEN-METEO CLIENT
# ---------------------------------------------------------
session = requests.Session()

retry_session = retry(
    session,
    retries=5,
    backoff_factor=0.2
)

openmeteo = openmeteo_requests.Client(
    session=retry_session
)

# ---------------------------------------------------------
# 4. API REQUEST PARAMETERS
# ---------------------------------------------------------
url = "https://historical-forecast-api.open-meteo.com/v1/forecast"
params = {
    "latitude": PONDS_LAT,
    "longitude": PONDS_LON,
    "start_date": start_date,
    "end_date": end_date,
    "daily": [
        "temperature_2m_max",
        "temperature_2m_min",
        "relative_humidity_2m_mean",
        "dew_point_2m_mean"
    ],
    "temperature_unit": "fahrenheit",
}

responses = openmeteo.weather_api(url, params=params)

# ---------------------------------------------------------
# 5. PROCESS RESPONSE
# ---------------------------------------------------------
response = responses[0]
print(f"Coordinates returned by API: {response.Latitude()}°N {response.Longitude()}°E")
print(f"Elevation: {response.Elevation()} m asl")
print(f"Timezone difference to GMT+0: {response.UtcOffsetSeconds()}s\n")

daily = response.Daily()

daily_max = daily.Variables(0).ValuesAsNumpy()
daily_min = daily.Variables(1).ValuesAsNumpy()
daily_rh_mean = daily.Variables(2).ValuesAsNumpy()
daily_dew_mean = daily.Variables(3).ValuesAsNumpy()

# ---------------------------------------------------------
# 6. BUILD DATAFRAME
# ---------------------------------------------------------
daily_data = {
    "date": pd.date_range(
        start=pd.to_datetime(daily.Time(), unit="s", utc=True),
        end=pd.to_datetime(daily.TimeEnd(), unit="s", utc=True),
        freq=pd.Timedelta(seconds=daily.Interval()),
        inclusive="left"
    ),
    "temp_max": daily_max,
    "temp_min": daily_min,
    "rh_mean": daily_rh_mean,
    "dew_point_mean": daily_dew_mean
}

daily_dataframe = pd.DataFrame(data=daily_data)

# Strip time → keep only YYYY-MM-DD
daily_dataframe["date"] = pd.to_datetime(daily_dataframe["date"])

# ---------------------------------------------------------
# 7. Print
# ---------------------------------------------------------
print(daily_dataframe.info())
print(start_date, end_date)

daily_dataframe = daily_dataframe.rename(
    columns={
        "date": "Ponds_Weather_Date",
        "temp_max": "Max_Temperature",
        "temp_min": "Min_Temperature",
        "rh_mean": "Avg_Relative_Humidity",
        "dew_point_mean": "Avg_Dew_Point"
    }
)

col_numeric = [
    "Max_Temperature",
    "Min_Temperature",
    "Avg_Relative_Humidity",
    "Avg_Dew_Point"
]

daily_dataframe[col_numeric] = (daily_dataframe[col_numeric].astype("float64").round(2))


target_columns = [
    "Ponds_Weather_Date",
    "Max_Temperature",
    "Min_Temperature",
    "Avg_Relative_Humidity",
    "Avg_Dew_Point"
]

daily_dataframe["Ponds_Weather_Date"] = (
    pd.to_datetime(daily_dataframe["Ponds_Weather_Date"])
    .dt.date
)

target_table = "Ponds_Weather_Meteo"

daily_dataframe.to_sql(name=target_table, con=engine, if_exists="append", index=False)
print("Specified data successfully inserted!")