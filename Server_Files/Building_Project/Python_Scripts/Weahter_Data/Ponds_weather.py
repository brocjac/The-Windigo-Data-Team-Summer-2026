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
cache_session = requests_cache.CachedSession('.cache', expire_after=3600)
retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
openmeteo = openmeteo_requests.Client(session=retry_session)

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
daily_dataframe["date"] = pd.to_datetime(daily_dataframe["date"]).dt.date

# ---------------------------------------------------------
# 7. Print
# ---------------------------------------------------------
#print(daily_dataframe)
print(start_date, end_date)