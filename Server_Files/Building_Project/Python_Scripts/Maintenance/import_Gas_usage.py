import requests
import pandas as pd
from dotenv import load_dotenv
import os


load_dotenv(r"D:\other-files\school\database_dev\Windigo Internship\HUBSPOT_KEY.env")

service_key = os.getenv("HUBSPOT_SERVICE_KEY")

if not service_key:
    raise ValueError("HUBSPOT_SERVICE_KEY was not loaded")

url = "https://api.hubapi.com/crm/v3/objects/contacts"

headers = {
    "Authorization": f"Bearer {service_key}"
}

response = requests.get(
    "https://api.hubapi.com/crm/v3/objects/contacts",
    headers=headers
)

properties = [
    "gas_bill_date",
    "gas_read_date",
    "gas_billing_days",
    "natural_gas_used_therms",
    "heating_degree_days_gas",
    "cooling_degree_days_gas",
    "other_charges_gas",
    "previous_balance_and_adjustments_gas",
    "base_gas_cost",
    "purchase_gas_adjustment",
    "distribution_charge_gas",
    "customer_charge_gas",
    "gas_taxes"
]

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
        props = item.get("properties", {})

        row = {
            "id": item.get("id")
        }

        for prop in properties:
            row[prop] = props.get(prop)

        rows.append(row)

    url = data.get("paging", {}).get("next", {}).get("link")
    params = None

df = pd.DataFrame(rows)

# Convert empty strings to missing values
df = df.replace("", pd.NA)
df = df.dropna(subset=["gas_bill_date"], how="any")

df["gas_bill_date"] = pd.to_datetime(
    df["gas_bill_date"],
    errors="coerce"
)

df["gas_read_date"] = pd.to_datetime(
    df["gas_read_date"],
    errors="coerce"
)

col_numeric = [
    "gas_billing_days",
    "natural_gas_used_therms",
    "heating_degree_days_gas",
    "cooling_degree_days_gas",
    "other_charges_gas",
    "previous_balance_and_adjustments_gas",
    "base_gas_cost",
    "purchase_gas_adjustment",
    "distribution_charge_gas",
    "customer_charge_gas",
    "gas_taxes"
]

for col in col_numeric :
    df[col] = pd.to_numeric(df[col], errors="coerce")

df["total_gas_charges"] = (
    df["base_gas_cost"].fillna(0) +
    df["purchase_gas_adjustment"].fillna(0) +
    df["distribution_charge_gas"].fillna(0) +
    df["customer_charge_gas"].fillna(0) +
    df["gas_taxes"].fillna(0)
)
df["total_gas_bill"] = (
    df["total_gas_charges"].fillna(0) +
    df["other_charges_gas"].fillna(0) +
    df["previous_balance_and_adjustments_gas"].fillna(0)
)
df["avg_gas_cost_per_day"] = (
    df["total_gas_charges"].fillna(0) / df["gas_billing_days"].fillna(0)
)
df["avg_therms_per_day"] = (
    df["natural_gas_used_therms"].fillna(0) / df["gas_billing_days"].fillna(0)
)
df["gas_start_date"] = (
    df["gas_read_date"] - pd.to_timedelta(df["gas_billing_days"], unit="D")
)
print(df.info())