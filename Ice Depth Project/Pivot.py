import pandas as pd
import csv

data = pd.read_csv("Windigo_Ice_Depths_decimal.csv")

df = pd.DataFrame(data)

df_long = pd.melt(
    df,
    id_vars=['Date'],
    value_vars=['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16'],
    var_name='Zone',
    value_name='Depth'
)

df_long.to_csv("Windigo_Ice_Depths_Unpivoted.csv", index=False)

print(df_long.head())