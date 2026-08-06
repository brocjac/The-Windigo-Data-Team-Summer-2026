# This script reads a CSV file containing ice depth 
# measurements, converts fractional values to decimal, 
# classifies usage based on the date, and saves the 
# processed data to a new CSV file.

### Note: This script assumes that the input CSV 
# file has a 'Date' column and depth columns starting 
# from the second column. It also assumes that 
# the file 'Windigo_Ice_Depths.csv' is in the same 
# directory as this script.


import pandas as pd
import re
from datetime import datetime

def frac_to_decimal(val):
    if pd.isna(val) or val == "":
        return None
    s = str(val).replace('"', '').strip()

    # Fix typo like "1/1/4"
    if s.count('/') > 1:
        parts = s.split('/')
        s = parts[0] + '-' + parts[1] + '/' + parts[2]

    # Mixed number: "1-1/4"
    if '-' in s:
        whole, frac = s.split('-')
        whole = float(whole)
    # Simple fraction: "3/4"
    elif '/' in s:
        whole, frac = 0.0, s
    # Whole number: "1"
    else:
        return float(s)

    # Fraction part
    if '/' in frac:
        num, den = frac.split('/')
        whole += float(num) / float(den)

    return whole


def classify_usage(date_val):
    month = date_val.month
    day = date_val.day

    # HIGH: Sept 1 – Mar 14
    if (month >= 9) or (month <= 2) or (month == 3 and day <= 14):
        return "High"

    # MEDIUM: June 1 – Aug 31
    if 6 <= month <= 8:
        return "Medium"

    # LOW: Mar 15 – May 31
    return "Low"

# -----------------------------
# Load CSV
# -----------------------------
df = pd.read_csv('D:\other-files\school\database_dev\The-Windigo-Data-Team-Summer-2026\Ice Depth Project\Ice_Depth_File_Converter\Ponds Operations.csv')

# Convert Date column to datetime
df['Date'] = pd.to_datetime(df['Date'])

# -----------------------------
# Convert depth columns
# -----------------------------
for col in df.columns[1:]:
    df[col] = df[col].apply(frac_to_decimal)

# -----------------------------
# Add Usage column (Column R)
# -----------------------------
df['Usage'] = df['Date'].apply(classify_usage)

# -----------------------------
# Save output
# -----------------------------
df.to_csv('Windigo_Ice_Depths_decimal.csv', index=False)

print(df.head())
