import requests
import pandas as pd
from dotenv import load_dotenv
import os

df = pd.read_csv("D:\other-files\school\database_dev\The-Windigo-Data-Team-Summer-2026\Ice Depth Project\Ice_Depth_File_Converter\Windigo_Ice_Depths_decimal.csv")

# Remove rows where every ice depth field is blank
ice_depth_columns = [str(i) for i in range(1,17)]

df = df.dropna(subset=ice_depth_columns, how="all")

df_long = pd.melt(
    df,
    id_vars=['Date'],
    value_vars=ice_depth_columns,
    var_name='Zone',
    value_name='Depth'
)

df_long["Zone"] = (
    df_long["Zone"]
    .astype(int)
)

df_long["Depth"] = pd.to_numeric(df_long["Depth"], errors="coerce")

df_long = df_long.dropna(subset=["Depth"])

df_long.to_csv('D:\other-files\school\database_dev\The-Windigo-Data-Team-Summer-2026\Ice Depth Project\Ice_Depth_File_Converter\Windigo_Ice_Depths_Pivot.csv', index=False)

print(df_long.info())