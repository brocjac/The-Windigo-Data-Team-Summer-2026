import openmeteo_requests
import pandas as pd
import requests_cache
from retry_requests import retry

# Setup the Open-Meteo API client with cache and retry on error
cache_session = requests_cache.CachedSession('.cache', expire_after = 3600)
retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
openmeteo = openmeteo_requests.Client(session = retry_session)

# Make sure all required weather variables are listed here
# The order of variables in hourly or daily is important to assign them correctly below
url = "https://historical-forecast-api.open-meteo.com/v1/forecast"
params = {
	"latitude": 43.07036380872471, 
	"longitude": -88.12443039077134,
	"start_date": "2025-05-12",
	"end_date": "2026-07-10",
	"daily": ["temperature_2m_max", "temperature_2m_min", "relative_humidity_2m_max", "relative_humidity_2m_mean", "dew_point_2m_mean"],
	"temperature_unit": "fahrenheit",
}
responses = openmeteo.weather_api(url, params = params)

# Process first location. Add a for-loop for multiple locations or weather models
response = responses[0]
print(f"Coordinates: {response.Latitude()}°N {response.Longitude()}°E")
print(f"Elevation: {response.Elevation()} m asl")
print(f"Timezone difference to GMT+0: {response.UtcOffsetSeconds()}s")


# Process daily data
daily = response.Daily()
daily_max = daily.Variables(0).ValuesAsNumpy()
daily_min = daily.Variables(1).ValuesAsNumpy()
daily_rh_mean = daily.Variables(2).ValuesAsNumpy()
daily_dew_mean = daily.Variables(3).ValuesAsNumpy()

# Create your dataframe
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
# Create your dataframe
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

# 1. Create the DataFrame
daily_dataframe = pd.DataFrame(data=daily_data)

# 2. INSERT THIS CLEANING LINE HERE
# This strips the time element and keeps only the YYYY-MM-DD date
daily_dataframe['date'] = pd.to_datetime(daily_dataframe['date']).dt.date

# 3. Define the path clearly
path = r"C:\Users\lucas\Desktop\Professional\Internship Windigo\Ice_Depths\windigo_weather_data.csv"

# 4. Save the file
daily_dataframe.to_csv(path, index=False)

# 5. Print the confirmation
print(f"Data successfully saved to: {path}")