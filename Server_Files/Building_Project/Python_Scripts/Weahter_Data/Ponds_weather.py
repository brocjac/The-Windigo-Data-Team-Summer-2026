import os
import logging
from pathlib import Path
from urllib.parse import quote_plus

import pandas as pd
import requests
import openmeteo_requests

from dotenv import load_dotenv
from retry_requests import retry
from sqlalchemy import create_engine, text

# =========================================================
# 1. PATHS AND LOGGING
# =========================================================

server_files_path = Path(__file__).resolve().parents[3]

env_path = server_files_path / ".env"
log_path = server_files_path / "ponds_weather.log"

logging.basicConfig(
    filename=log_path,
    filemode="a",
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)

logging.info("--------------------------------------------------")
logging.info("Ponds weather script started.")

# =========================================================
# 2. LOAD ENVIRONMENT VARIABLES
# =========================================================

if not env_path.exists():
    logging.error(f".env file not found: {env_path}")
    raise FileNotFoundError(f".env file not found: {env_path}")

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
    message = (
        f"Missing environment variables: "
        f"{', '.join(missing)}"
    )

    logging.error(message)
    raise RuntimeError(message)

# =========================================================
# 3. CREATE SQL SERVER CONNECTION
# =========================================================

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

# =========================================================
# 4. READ UTILITY BILLING DATA
# =========================================================

electric_query = text("""select Electricity_Read_Date, Electricity_Billing_Days from Electricity_Stats""")

gas_query = text("""select Natural_Gas_Read_Date, Natural_Gas_Billing_Days from Natural_Gas_Stats""")
try:
    with engine.connect() as connection:
        electric_df = pd.read_sql(electric_query, connection)
        gas_df = pd.read_sql(gas_query, connection)
except Exception:
    logging.exception(
        "Failed to read utility billing data from SQL Server."
    )
    raise

if electric_df.empty and gas_df.empty:
    logging.info(
        "No electricity or natural gas records found. "
        "Nothing to process."
    )
    raise SystemExit(0)

# =========================================================
# 5. CLEAN UTILITY DATA
# =========================================================

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

if not gas_df.empty:
    gas_df["Natural_Gas_Read_Date"] = pd.to_datetime(
        gas_df["Natural_Gas_Read_Date"],
        errors="coerce"
    )

    gas_df["Natural_Gas_Billing_Days"] = pd.to_numeric(
        gas_df["Natural_Gas_Billing_Days"],
        errors="coerce"
    )

    gas_df["gas_start_date"] = (
        gas_df["Natural_Gas_Read_Date"]
        - pd.to_timedelta(
            gas_df["Natural_Gas_Billing_Days"] - 1,
            unit="D"
        )
    )


if not electric_df.empty:
    electric_df["Electricity_Read_Date"] = pd.to_datetime(
        electric_df["Electricity_Read_Date"],
        errors="coerce"
    )

    electric_df["Electricity_Billing_Days"] = pd.to_numeric(
        electric_df["Electricity_Billing_Days"],
        errors="coerce"
    )

    electric_df["electricity_start_date"] = (
        electric_df["Electricity_Read_Date"]
        - pd.to_timedelta(
            electric_df["Electricity_Billing_Days"] - 1,
            unit="D"
        )
    )

# =========================================================
# 6. DETERMINE REQUIRED WEATHER DATE RANGE
# =========================================================

start_dates = []
end_dates = []

if not gas_df.empty:
    start_dates.append(
        gas_df["gas_start_date"].min()
    )
    end_dates.append(
        gas_df["Natural_Gas_Read_Date"].max()
    )

if not electric_df.empty:
    start_dates.append(
        electric_df["electricity_start_date"].min()
    )
    end_dates.append(
        electric_df["Electricity_Read_Date"].max()
    )

if not start_dates or not end_dates:
    logging.info(
        "No valid billing dates were available."
    )
    raise SystemExit(0)

absolute_start = min(start_dates)
absolute_end = max(end_dates)

logging.info(
    f"Required weather range: "
    f"{absolute_start.date()} through "
    f"{absolute_end.date()}"
)

if gas_df.empty:
    raise ValueError("Natural_Gas_Stats returned no records.")

if electric_df.empty:
    raise ValueError("Electricity_Stats returned no records.")

# =========================================================
# 7. CHECK EXISTING WEATHER DATA
# =========================================================

existing_weather_query = text("""
    SELECT Ponds_Weather_Date
    FROM Ponds_Weather_Meteo
""")

try:
    with engine.connect() as connection:
        existing_weather_df = pd.read_sql(
            existing_weather_query, connection
        )
except Exception:
    logging.exception(
        "Failed to read existing weather dates."
    )
    raise

if not existing_weather_df.empty:
    existing_weather_df["Ponds_Weather_Date"] = (
        pd.to_datetime(existing_weather_df["Ponds_Weather_Date"], errors="coerce").dt.date
    )

# =========================================================
# 8. DETERMINE MISSING DATES
# =========================================================

required_dates = pd.date_range(
    start=absolute_start,
    end=absolute_end,
    freq="D"
).date

if existing_weather_df.empty:
    missing_dates = list(required_dates)

else:
    existing_dates = set(
        existing_weather_df["Ponds_Weather_Date"].dropna()
    )
    missing_dates = [date for date in required_dates if date not in existing_dates]

if not missing_dates:
    logging.info(
        "Weather table is already up to date."
    )
    engine.dispose()
    raise SystemExit(0)

logging.info(f"{len(missing_dates)} weather dates are missing.")

# =========================================================
# 9. DETERMINE API RANGE
# =========================================================

api_start_date = min(missing_dates)
api_end_date = max(missing_dates)

start_date = api_start_date.strftime("%Y-%m-%d")
end_date = api_end_date.strftime("%Y-%m-%d")

logging.info(
    f"Requesting Open-Meteo data from "
    f"{start_date} through {end_date}."
)

# =========================================================
# 10. OPEN-METEO LOCATION
# =========================================================
PONDS_LAT = 43.07036380872471
PONDS_LON = -88.12443039077134

print("\nUsing Ponds coordinates:")
print(f"Latitude:  {PONDS_LAT}")
print(f"Longitude: {PONDS_LON}\n")

# =========================================================
# 11. OPEN-METEO CLIENT
# =========================================================
session = requests.Session()

retry_session = retry(
    session,
    retries=5,
    backoff_factor=0.2
)

openmeteo = openmeteo_requests.Client(
    session=retry_session
)

# =========================================================
# 12. OPEN-METEO REQUEST
# =========================================================
#url = "https://historical-forecast-api.open-meteo.com/v1/forecast"
url = (
    "https://historical-forecast-api."
    "open-meteo.com/v1/forecast"
)
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
try:
    responses = openmeteo.weather_api(url, params=params)
except Exception:
    logging.exception("Open-Meteo API request failed.")
    raise

# =========================================================
# 13. PROCESS OPEN-METEO RESPONSE
# =========================================================
response = responses[0]
print(f"Coordinates returned by API: {response.Latitude()}°N {response.Longitude()}°E")
print(f"Elevation: {response.Elevation()} m asl")
print(f"Timezone difference to GMT+0: {response.UtcOffsetSeconds()}s\n")

daily = response.Daily()

daily_max = daily.Variables(0).ValuesAsNumpy()
daily_min = daily.Variables(1).ValuesAsNumpy()
daily_rh_mean = daily.Variables(2).ValuesAsNumpy()
daily_dew_mean = daily.Variables(3).ValuesAsNumpy()

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

# =========================================================
# 14. CLEAN WEATHER DATA
# =========================================================

daily_dataframe = daily_dataframe.rename(
    columns={
        "date": "Ponds_Weather_Date",
        "temp_max": "Max_Temperature",
        "temp_min": "Min_Temperature",
        "rh_mean": "Avg_Relative_Humidity",
        "dew_point_mean": "Avg_Dew_Point"
    }
)

daily_dataframe["Ponds_Weather_Date"] = (
    pd.to_datetime(
        daily_dataframe["Ponds_Weather_Date"]
    ).dt.date
)

col_numeric = [
    "Max_Temperature",
    "Min_Temperature",
    "Avg_Relative_Humidity",
    "Avg_Dew_Point"
]

daily_dataframe[col_numeric] = (daily_dataframe[col_numeric].astype("float64").round(2))

# =========================================================
# 15. KEEP ONLY ACTUALLY MISSING DATES
# =========================================================

missing_date_set = set(missing_dates)

daily_dataframe = daily_dataframe[
    daily_dataframe["Ponds_Weather_Date"].isin(missing_date_set)
].copy()

if daily_dataframe.empty:
    logging.info("Open-Meteo returned no new weather rows.")
    engine.dispose()
    raise SystemExit(0)

# =========================================================
# 16. INSERT WEATHER DATA INTO SQL SERVER
# =========================================================

target_columns = [
    "Ponds_Weather_Date",
    "Max_Temperature",
    "Min_Temperature",
    "Avg_Relative_Humidity",
    "Avg_Dew_Point"
]

target_table = "Ponds_Weather_Meteo"

daily_dataframe = daily_dataframe[target_columns]

try:
    daily_dataframe.to_sql(name=target_table, con=engine, if_exists="append", index=False)
    logging.info(
        f"Successfully inserted "
        f"{len(daily_dataframe)} weather rows."
    )
except Exception:
    logging.exception(
        "Failed to insert weather data "
        "into SQL Server."
    )
print("Specified data successfully inserted!")

# =========================================================
# 17. CLEANUP
# =========================================================

engine.dispose()
logging.info(
    "Ponds weather script completed successfully."
)