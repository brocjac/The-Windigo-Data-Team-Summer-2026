import os
import pandas as pd
import requests
from dotenv import load_dotenv

#-----------------------------------
# HubSpot Data from Ice Rink Date
#-----------------------------------

load_dotenv(r"D:\other-files\school\database_dev\Windigo Internship\HUBSPOT_KEY.env")

service_key = os.getenv("HUBSPOT_SERVICE_KEY")

if not service_key:
    raise ValueError("HUBSPOT_SERVICE_KEY was not loaded")

hubspot_url = "https://api.hubapi.com/crm/v3/objects/contacts"

headers_hub = {
    "Authorization": f"Bearer {service_key}"
}

response_hub = requests.get(
    "https://api.hubapi.com/crm/v3/objects/contacts",
    headers=headers_hub
)

params_hub = {
    "limit": 100,
    "properties": "date"
}

rows = []

while hubspot_url:
    r = requests.get(hubspot_url, headers=headers_hub, params=params_hub)
    r.raise_for_status()
    hubspot_data = r.json()

    for item in hubspot_data.get("results", []):
        properties = item.get("properties", {})

        row = {
            "id": item.get("id")
        }

        row["date"] = properties.get("date")

        rows.append(row)

    # HubSpot returns the full next-page URL
    url = hubspot_data.get("paging", {}).get("next", {}).get("link")

    # The next-page URL already contains its pagination parameters
    params = None

ice_df = pd.DataFrame(rows)

ice_df["date"] = pd.to_datetime(ice_df["date"])

start_date = ice_df['date'].min().strftime("%Y-%m-%d")
end_date = ice_df['date'].max().strftime("%Y-%m-%d")

#-----------------------------------
# HubSpot Data from Ice Rink Date
#-----------------------------------

url = "https://www.ncei.noaa.gov/access/services/data/v1"

params = {
    "dataset": "daily-summaries",
    "stations": "USC00471062,USW00014839",
    "startDate": start_date,
    "endDate": end_date,
    "format": "json",
    "units": "standard",
    "includeAttributes": "false"
}

response = requests.get(url, params=params)
response.raise_for_status()

df = pd.DataFrame(response.json())

df["DATE"] = pd.to_datetime(df["DATE"])

brookfield = df[df["STATION"] == "USC00471062"].copy()
mitchell = df[df["STATION"] == "USW00014839"].copy()

brookfield_keep = [
    "DATE", "SNOW", "TMAX", "TMIN", "PRCP", "TOBS", "SNWD"
]

w_cols = [
    c for c in mitchell.columns 
    if c.startswith(("WT", "WS", "WD")) or c == "AWND"
]

mitchell_keep = ["DATE"] + w_cols

weather_df = brookfield[brookfield_keep].merge(
    mitchell[mitchell_keep],
    on="DATE",
    how="left"
)

to_int = ['TMAX', 'TMIN', 'PRCP', 'TOBS', 'SNWD', 'WSF2', 'WDF2', 'AWND', 'WSF5', 'WDF5', 'WT01', 'WT03', 'WT08', 'WT02', 'WT09', 'WT06', 'WT04', 'WT05', 'SNOW']

for int in to_int:
    weather_df[int] = pd.to_numeric(weather_df[int])

weather_df = weather_df.rename(
    columns={
        'TOBS': 'Tempurature Observed',
        'SNWD': 'Snow Depth',
        'WSF2': 'Fastest Two Minute Wind Speed',
        'WDF2': 'Direction of Fastest Two Minute Wind',
        'AWND': 'Average Daily Wind Speed',
        'WSF5': 'Fastest Five Second Wind Speed',
        'WDF5': 'Direction of Fastest Five Second Wind',
        'WT01': 'Fog - Ice Fog - Freezing Fog',
        'WT02': 'Heavy Fog or Heavy Freezing Fog',
        'WT03': 'Thunder',
        'WT04': 'Ice Pellets - Sleet - Snow Pellets - Small Hail',
        'WT05': 'Hail',
        'WT06': 'Glaze or Rime',
        'WT08': 'Smoke or Haze',
        'WT09': 'Blowing or Drifting Snow'
    }
)

weather_df