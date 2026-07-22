# %% [markdown]
# ## Correlation of Weather Data and Gas, Electric and The Rink

# %%
import requests
import pandas as pd
from dotenv import load_dotenv
from scipy.stats import linregress
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
    "gas_read_date",
    "gas_billing_days",
    "natural_gas_used_therms",
    "heating_degree_days_gas",
    "cooling_degree_days_gas",

    "electricity_read_date",
    "electric_billing_days",
    "heating_degree_days",
    "cooling_degree_days",
    "onpeak_electricity_used_kwh",
    "offpeak_electricity_used_kwh",

    "date"
] + [f"ice_depth_zone__{i}" for i in range(1, 17)]

params = {
    "limit": 100,
    "properties": ",".join(properties)
}

hubspot_rows = []

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

        hubspot_rows.append(row)

    url = data.get("paging", {}).get("next", {}).get("link")
    params = None

hubspot_df = pd.DataFrame(hubspot_rows)

gas_columns = [
    "gas_read_date",
    "gas_billing_days",
    "natural_gas_used_therms",
    "heating_degree_days_gas",
    "cooling_degree_days_gas"
]

electric_columns = [
    "electricity_read_date",
    "electric_billing_days",
    "heating_degree_days",
    "cooling_degree_days",
    "onpeak_electricity_used_kwh",
    "offpeak_electricity_used_kwh"
]

ice_depth_columns = ["date"] + [f"ice_depth_zone__{i}" for i in range(1, 17)]

gas_df = hubspot_df[gas_columns].copy()

electric_df = hubspot_df[electric_columns].copy()

ice_df = hubspot_df[ice_depth_columns].copy()

weather = pd.read_csv(r'D:\other-files\school\database_dev\The-Windigo-Data-Team-Summer-2026\Ice Depth Project\weather_data_final.csv')

columns = [
    "DATE",
    "Best_TMAX",
    "Best_TMIN",
    "Rel Humidity Max",
    "Rel Humidity Mean",
    "Dew Point Mean",
    "Wind Speed Max",
    "Wind Gusts Max",
    "Brookfield_PRCP",
    "Brookfield_SNWD",
    "Waukesha_SNOW"
]

# weather data
weather_df = pd.DataFrame(weather[columns])

weather_numeric_columns = [
    "Best_TMAX",
    "Best_TMIN",
    "Rel Humidity Max",
    "Rel Humidity Mean",
    "Dew Point Mean",
    "Wind Speed Max",
    "Wind Gusts Max",
    "Brookfield_PRCP",
    "Brookfield_SNWD",
    "Waukesha_SNOW"
]

for col in weather_numeric_columns:
    weather_df[col] = pd.to_numeric(
        weather_df[col], errors="coerce"
    )

weather_df["DATE"] = pd.to_datetime(
    weather_df["DATE"],
    errors="coerce"
)

#-----------------------
# Ice Rink Data
#-----------------------

# Convert empty strings to missing values
ice_df = ice_df.replace("", pd.NA)

# Remove rows where every ice depth field is blank
ice_depth_columns = [col for col in ice_df.columns if col.startswith("ice_depth_zone_")]

ice_df = ice_df.dropna(subset=ice_depth_columns, how="all")

ice_df["date"] = pd.to_datetime(
    ice_df["date"],
    errors="coerce"
)

zone_columns = [f"ice_depth_zone__{i}" for i in range(1,17)]

for col in zone_columns:
    ice_df[col] = pd.to_numeric(
        ice_df[col],
        errors="coerce"
    )

ice_df["average_ice_depth"] = (
    ice_df[zone_columns].mean(axis=1)
)

ice_df = ice_df.dropna(
    subset=["average_ice_depth"]
)

ice_df["ice_period_start"] = (ice_df["date"].shift(1) + pd.Timedelta(days=1))
ice_df["ice_period_end"] = (ice_df["ice_period_start"].fillna(ice_df["date"]))
ice_df["ice_period_end"] = ice_df["date"]

#-----------------------
# Gas data
#-----------------------

# Convert empty strings to missing values
gas_df = gas_df.replace("", pd.NA)
gas_df = gas_df.dropna(subset=["gas_read_date"], how="any")

gas_df["gas_read_date"] = pd.to_datetime(
    gas_df["gas_read_date"],
    errors="coerce"
)

gas_col_numeric = [
    "gas_billing_days",
    "natural_gas_used_therms",
    "heating_degree_days_gas",
    "cooling_degree_days_gas"
]

for col in gas_col_numeric:
    gas_df[col] = pd.to_numeric(gas_df[col], errors="coerce")

#--------------------
# Electricity Data
#--------------------

electric_df = electric_df.replace("", pd.NA)
electric_df = electric_df.dropna(subset=["electricity_read_date"], how="any")

electric_df["electricity_read_date"] = pd.to_datetime(
    electric_df["electricity_read_date"],
    errors="coerce"
)

electric_col_numeric = [
    "electric_billing_days",
    "heating_degree_days",
    "cooling_degree_days",
    "onpeak_electricity_used_kwh",
    "offpeak_electricity_used_kwh"
]

for col in electric_col_numeric:
    electric_df[col] = pd.to_numeric(electric_df[col], errors="coerce")

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

def summarize_weather_period(row, start_column, end_column):
    start_date = row[start_column]
    end_date = row[end_column]

    if pd.isna(start_date) or pd.isna(end_date):
        return pd.Series({
            "average_tmax": pd.NA,
            "average_tmin": pd.NA,
            "average_max_humidity": pd.NA,
            "average_humidity": pd.NA,
            "average_dew_point": pd.NA,
            "average_max_wind_speed": pd.NA,
            "max_wind_gusts": pd.NA,
            "total_precipitation": pd.NA,
            "average_snow_depth": pd.NA,
            "total_snowfall": pd.NA,
            "weather_days_found": 0
        })
    
    period_weather = weather_df[
        weather_df["DATE"].between(
            start_date,
            end_date,
            inclusive="both"
        )
    ]

    return pd.Series({
        "average_tmax": period_weather["Best_TMAX"].mean(),
        "average_tmin": period_weather["Best_TMIN"].mean(),
        "average_humidity": period_weather["Rel Humidity Mean"].mean(),
        "average_max_humidity": period_weather["Rel Humidity Max"].mean(),
        "average_dew_point": period_weather["Dew Point Mean"].mean(),
        "average_max_wind_speed": period_weather["Wind Speed Max"].mean(),
        "max_wind_gusts": period_weather["Wind Gusts Max"].max(),
        "total_precipitation": period_weather["Brookfield_PRCP"].fillna(0).sum(),
        "average_snow_depth": period_weather["Brookfield_SNWD"].mean(),
        "total_snowfall": period_weather["Waukesha_SNOW"].fillna(0).sum(),
        "weather_days_found": period_weather["DATE"].nunique()
    })

weather_summary_gas = gas_df.apply(
    summarize_weather_period,
    axis=1,
    start_column="gas_start_date",
    end_column="gas_read_date"
)

weather_summary_electric = electric_df.apply(
    summarize_weather_period,
    axis=1,
    start_column="electricity_start_date",
    end_column="electricity_read_date"
)

weather_summary_ice = ice_df.apply(
    summarize_weather_period,
    axis=1,
    start_column="ice_period_start",
    end_column="ice_period_end"
)


gas_df = pd.concat([gas_df.reset_index(drop=True), weather_summary_gas.reset_index(drop=True)], axis=1)
electric_df = pd.concat([electric_df.reset_index(drop=True), weather_summary_electric.reset_index(drop=True)], axis=1)
ice_df = pd.concat([ice_df.reset_index(drop=True), weather_summary_ice.reset_index(drop=True)], axis=1)

gas_df = gas_df.replace("", pd.NA)
gas_df = gas_df.dropna(subset=["average_tmax"], how="any").reset_index(drop=True)

electric_df = electric_df.replace("", pd.NA)
electric_df = electric_df.dropna(subset=["average_tmax"], how="any").reset_index(drop=True)

ice_df = ice_df.replace("", pd.NA)
ice_df = ice_df.dropna(subset=["average_tmax"], how="any").reset_index(drop=True)

def create_regression_table(dataframe, target_column):

    weather_columns = [
        "average_tmax",
        "average_tmin",
        "average_humidity",
        "average_max_humidity",
        "average_dew_point",
        "average_max_wind_speed",
        "max_wind_gusts",
        "total_precipitation",
        "average_snow_depth",
        "total_snowfall",
        "weather_days_found"
    ]

    result_list = []

    for column in weather_columns:
        regression_data = dataframe[
            [column, target_column]
        ].copy()

        regression_data[column] = pd.to_numeric(
            regression_data[column],
            errors="coerce"
        )

        regression_data[target_column] = pd.to_numeric(
            regression_data[target_column],
            errors="coerce"
        )

        regression_data = regression_data.dropna()

        if (
            len(regression_data) < 2
            or regression_data[column].nunique() < 2
        ):
            continue

        result = linregress(
            regression_data[column],
            regression_data[target_column]
        )

        result_list.append({
            "weather_varable": column,
            "correlation_r": result.rvalue,
            "r_squared": result.rvalue ** 2,
            "slope": result.slope,
            "intercept": result.intercept,
            "p_value": result.pvalue,
            "periods": len(regression_data)
        })

    regression_table = pd.DataFrame(result_list)

    if not regression_table.empty:
        regression_table = (
            regression_table
            .sort_values("r_squared", ascending=False)
            .reset_index(drop=True)
        )

        regression_table = regression_table.round({
            "correlation_r": 3,
            "r_squared": 3,
            "slope": 3,
            "intercept": 3,
            "p_value": 3,
        })

        return regression_table

regression_table_gas_usage = create_regression_table(dataframe=gas_df, target_column="natural_gas_used_therms")
regression_table_gas_heating = create_regression_table(dataframe=gas_df, target_column="heating_degree_days_gas")
regression_table_gas_cooling = create_regression_table(dataframe=gas_df, target_column="cooling_degree_days_gas")

regression_table_electric_onpeak = create_regression_table(dataframe=electric_df, target_column="onpeak_electricity_used_kwh")
regression_table_electric_offpeak = create_regression_table(dataframe=electric_df, target_column="offpeak_electricity_used_kwh")
regression_table_electric_heating = create_regression_table(dataframe=electric_df, target_column="heating_degree_days")
regression_table_electric_cooling = create_regression_table(dataframe=electric_df, target_column="cooling_degree_days")

zone = [f"ice_depth_zone__{i}" for i in range(1, 17)]

tables_ice=[]

for z in zone:
    regression_table = create_regression_table(dataframe=ice_df, target_column=z)

    regression_table["Zone"] = z
    tables_ice.append(regression_table)

regression_table_ice = pd.concat(tables_ice, ignore_index=True)

regression_table_ice["Zone"] = (
    regression_table_ice["Zone"]
    .str.replace("ice_depth_zone__", "", regex=False)
    .astype(int)
)



with pd.ExcelWriter("D:\other-files\school\database_dev\The-Windigo-Data-Team-Summer-2026\Ice Depth Project\Correlation.xlsx", engine="openpyxl", mode="w") as writer:
    regression_table_gas_usage.to_excel(writer, sheet_name="Gas Usage", index=False)
    regression_table_gas_heating.to_excel(writer, sheet_name="Gas Heating Days", index=False)
    regression_table_gas_cooling.to_excel(writer, sheet_name="Gas Cooling Days", index=False)

    regression_table_electric_onpeak.to_excel(writer, sheet_name="On-Peak", index=False)
    regression_table_electric_offpeak.to_excel(writer, sheet_name="Off-Peak", index=False)
    regression_table_electric_heating.to_excel(writer, sheet_name="Electric Heating Days", index=False)
    regression_table_electric_cooling.to_excel(writer, sheet_name="Electric Cooling Days", index=False)

    regression_table_ice.to_excel(writer, sheet_name="Ice Depth", index=False)
