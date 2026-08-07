import openmeteo_requests
import pandas as pd
import requests_cache
from retry_requests import retry
from dotenv import load_dotenv
import requests
import os
from sqlalchemy import create_engine, text
from urllib.parse import quote_plus
# ---------------------------------------------------------
# 1. Hubspot From start and end of Electricity and Gas Billing
# ---------------------------------------------------------
SERVER = os.getenv("DB_SERVER", r"192.168.1.48\WINDIGODATABASE,1433")
DATABASE = os.getenv("DB_NAME", "The_Ponds_Building_DB")

conn_str = f"DRIVER={{ODBC Driver 18 for SQL Server}};SERVER={SERVER};DATABASE={DATABASE};Trusted_Connection=yes;Encrypt=yes;TrustServerCertificate=yes;"
encoded_conn_str = quote_plus(conn_str)

engine = create_engine(f"mssql+pyodbc:///?odbc_connect={encoded_conn_str}")

gas_df["gas_read_date"] = pd.to_datetime(
    gas_df["gas_read_date"],
    errors="coerce"
)

gas_df["gas_billing_days"] = pd.to_numeric(
    gas_df["gas_billing_days"],
    errors="coerce"
)

electric_df["electricity_read_date"] = pd.to_datetime(
    electric_df["electricity_read_date"],
    errors="coerce"
)

electric_df["electric_billing_days"] = pd.to_numeric(
    electric_df["electric_billing_days"],
    errors="coerce"
)

gas_df["gas_start_date"] = (
    gas_df["gas_read_date"]
    - pd.to_timedelta(
        gas_df["gas_billing_days"] - 1,
        unit="D"
    )
)

electric_df["electricity_start_date"] = (
    electric_df["electricity_read_date"]
    - pd.to_timedelta(
        electric_df["electric_billing_days"] - 1,
        unit="D"
    )
)

absolute_start = min(
    gas_df["gas_start_date"].min(),
    electric_df["electricity_start_date"].min()
)

absolute_end = max(
    gas_df["gas_read_date"].max(),
    electric_df["electricity_read_date"].max()
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