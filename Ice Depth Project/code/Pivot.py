import requests
import pandas as pd
from dotenv import load_dotenv
import os


load_dotenv(r"D:\other-files\school\database_dev\Windigo Internship\HUBSPOT_KEY.env")

service_key = os.getenv("HUBSPOT_SERVICE_KEY")

if not service_key:
    raise ValueError("HUBSPOT_SERVICE_KEY was not loaded")

url = "https://api.hubapi.com/crm/objects/2026-03/contacts"

headers = {
    "Authorization": f"Bearer {service_key}"
}

response = requests.get(
    "https://api.hubapi.com/crm/v3/objects/contacts",
    headers=headers
)

properties = ["date"] + [f"ice_depth_zone__{i}" for i in range(1, 17)]

params = {
    "limit": 100,
    "properties": ",".join(properties)
}

rows = []

while url:
    r = requests.get(url, headers=headers, params=params)
    r.raise_for_status()
    data = r.json()

    for item in data.get("results", []):
        row = item.get("properties", {})
        row["id"] = item.get("id")
        rows.append(row)

    url = data.get("paging", {}).get("next", {}).get("link")
    params = None

df = pd.DataFrame(rows)

# Convert empty strings to missing values
df = df.replace("", pd.NA)

# Remove rows where every ice depth field is blank
ice_depth_columns = [col for col in df.columns if col.startswith("ice_depth_zone_")]

df = df.dropna(subset=ice_depth_columns, how="all")

df_long = pd.melt(
    df,
    id_vars=['date'],
    value_vars=ice_depth_columns,
    var_name='Zone',
    value_name='Depth'
)

df_long["Zone"] = (
    df_long["Zone"]
    .str.replace("ice_depth_zone__", "", regex=False)
    .astype(int)
)

df_long["Depth"] = pd.to_numeric(df_long["Depth"], errors="coerce")

df_long = df_long.dropna(subset=["Depth"])

df_long = df_long.rename(columns={"date": "Date"})

print(df_long.head())