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
    "electric_bill_date",
    "electric_billing_days",
    "offpeak_electricity_used_kwh",
    "onpeak_electricity_used_kwh",
    "system_demand_charge",
    "customer_demand_charge",
    "customer_charge",
    "other_charges",
    "electricity_taxes",
    "other_electricity_charges",
    "previous_balance_and_adjustments",
    "on_peak_energy_charges",
    "off_peak_energy_charges",
    "system_demand_kw",
    "customer_demand_kw",
    "heating_degree_days",
    "cooling_degree_days"
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
df = df.dropna(subset=["electric_bill_date"], how="any")

df["electric_bill_date"] = pd.to_datetime(
    df["electric_bill_date"],
    errors="coerce"
)

col_numeric = [
    "electric_billing_days",
    "offpeak_electricity_used_kwh",
    "onpeak_electricity_used_kwh",
    "system_demand_charge",
    "customer_demand_charge",
    "customer_charge",
    "other_charges",
    "electricity_taxes",
    "other_electricity_charges",
    "previous_balance_and_adjustments",
    "on_peak_energy_charges",
    "off_peak_energy_charges",
    "system_demand_kw",
    "customer_demand_kw",
    "heating_degree_days",
    "cooling_degree_days"
]

for col in col_numeric :
    df[col] = pd.to_numeric(df[col], errors="coerce")

df = df.rename(columns={"other_electricity_charges": "other_summary_charges"})

df["total_electric_charges"] = (
    df["on_peak_energy_charges"].fillna(0) +
    df["off_peak_energy_charges"].fillna(0) +
    df["system_demand_charge"].fillna(0) +
    df["customer_demand_charge"].fillna(0) +
    df["customer_charge"].fillna(0) +
    df["other_charges"].fillna(0) +
    df["electricity_taxes"].fillna(0)
)
df["total_bill"] = (
    df["total_electric_charges"].fillna(0) +
    df["other_summary_charges"].fillna(0) +
    df["previous_balance_and_adjustments"].fillna(0)
)
df["avg_cost_per_day"] = (
    df["total_electric_charges"].fillna(0) / df["electric_billing_days"].fillna(0)
)
df["electricity_used_kWh"] = (
    df["offpeak_electricity_used_kwh"].fillna(0) +
    df["onpeak_electricity_used_kwh"].fillna(0)
)
df["avg_kwh_per_day"] = (
    df["electricity_used_kWh"].fillna(0) / df["electric_billing_days"].fillna(0)
)

print(df.info())