import openmeteo_requests
import pandas as pd
import requests_cache
from retry_requests import retry
import os

# ---------------------------------------------------------
# 1. END DATE INPUT WITH VALIDATION
# ---------------------------------------------------------
while True:
    try:
        user_input_end_date = input("Enter the end date (YYYY-MM-DD): ").strip()
        user_input_end_date = pd.to_datetime(user_input_end_date).strftime("%Y-%m-%d")
        break
    except ValueError:
        print("Invalid date format. Please enter as YYYY-MM-DD.")

# ---------------------------------------------------------
# 2. DEFAULT SAVE LOCATION = DESKTOP + USER OVERRIDE
# ---------------------------------------------------------
default_desktop = os.path.join(os.path.expanduser("~"), "Desktop")

while True:
    save_folder = input(
        "Enter folder to save CSV (press Enter for Desktop): "
    ).strip()

    # If user presses Enter → use Desktop
    if save_folder == "":
        save_folder = default_desktop

    # Remove quotes from Windows Copy Path
    save_folder = save_folder.strip('"').strip("'")

    # Validate folder
    try:
        os.makedirs(save_folder, exist_ok=True)
        break
    except OSError:
        print("Invalid folder path. Please try again.")

# Build final save path
filename = f"windigo_weather_{user_input_end_date}.csv"
save_path = os.path.join(save_folder, filename)


# ---------------------------------------------------------
# 3. GLOBAL COORDINATES FOR THE PONDS
# ---------------------------------------------------------
PONDS_LAT = 43.07036380872471
PONDS_LON = -88.12443039077134

print("\nUsing Ponds coordinates:")
print(f"Latitude:  {PONDS_LAT}")
print(f"Longitude: {PONDS_LON}\n")

# ---------------------------------------------------------
# 4. SETUP OPEN-METEO CLIENT
# ---------------------------------------------------------
cache_session = requests_cache.CachedSession('.cache', expire_after=3600)
retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
openmeteo = openmeteo_requests.Client(session=retry_session)

# ---------------------------------------------------------
# 5. API REQUEST PARAMETERS
# ---------------------------------------------------------
url = "https://historical-forecast-api.open-meteo.com/v1/forecast"
params = {
    "latitude": PONDS_LAT,
    "longitude": PONDS_LON,
    "start_date": "2025-05-12",
    "end_date": user_input_end_date,
    "daily": [
        "temperature_2m_max",
        "temperature_2m_min",
        "relative_humidity_2m_max",
        "relative_humidity_2m_mean",
        "dew_point_2m_mean"
    ],
    "temperature_unit": "fahrenheit",
}

responses = openmeteo.weather_api(url, params=params)

# ---------------------------------------------------------
# 6. PROCESS RESPONSE
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
# 7. BUILD DATAFRAME
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
# 8. SAVE FILE
# ---------------------------------------------------------
daily_dataframe.to_csv(save_path, index=False)

print(f"Data successfully saved to:\n{save_path}\n")
