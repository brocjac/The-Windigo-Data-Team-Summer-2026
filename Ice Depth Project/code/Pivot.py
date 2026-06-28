import requests
import pandas as pd
import csv

service_key = "pat-na1-4e5c57aa-3722-4638-96d7-409b2dc8b7a4"

url = "https://api.hubapi.com/crm/objects/2026-03/contacts"

headers = {
    "Authorization": f"Bearer {service_key}"
}

response = requests.get(
    "https://api.hubapi.com/crm/v3/objects/contacts",
    headers=headers
)

properties = [
    "date",
    "ice_depth_zone__1",
    "ice_depth_zone__2",
    "ice_depth_zone__3",
    "ice_depth_zone__4",
    "ice_depth_zone__5",
    "ice_depth_zone__6",
    "ice_depth_zone__7",
    "ice_depth_zone__8",
    "ice_depth_zone__9",
    "ice_depth_zone__10",
    "ice_depth_zone__11",
    "ice_depth_zone__12",
    "ice_depth_zone__13",
    "ice_depth_zone__14",
    "ice_depth_zone__15",
    "ice_depth_zone__16"
]

params = {
    "limit": 100,
    "properties": ",".join(properties)
}

r = requests.get(url, headers=headers, params=params)

data = r.json()

rows = []

while url:
    r = requests.get(url, headers=headers, params=params)
    r.raise_for_status()
    data = r.json()

    for item in data["results"]:
        row = item.get("properties", {})
        row["id"] = item["id"]
        rows.append(row)

    paging = data.get("paging", {}).get("next", {})
    url = paging.get("link")
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