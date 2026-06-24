import pandas as pd

df = pd.read_csv("D:\other-files\school\database_dev\Windigo Internship\Ice Depth Project\Windigo_Ice_Depths_decimal.csv")

stat_summary = df.describe()

print(stat_summary)