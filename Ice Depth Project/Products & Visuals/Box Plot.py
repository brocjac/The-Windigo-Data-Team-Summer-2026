import pandas as pd
import matplotlib.pyplot as plt

# -----------------------------------------
# 1. Load the cleaned decimal dataset
# -----------------------------------------
df = pd.read_csv("Windigo_Ice_Depths_Unpivoted.csv")

# -----------------------------------------
# 2. Convert columns (if not already)
# -----------------------------------------
df['Zone'] = pd.to_numeric(df['Zone'], errors="coerce")
df['Depth'] = pd.to_numeric(df['Depth'], errors="coerce")

df['Zone'] = df['Zone'].astype(int)

# -----------------------------------------
# 3. Identify the 16 zones
# -----------------------------------------
df = df.sort_values('Zone')

# -----------------------------------------
# 4. Create a boxplot comparing all zones
# -----------------------------------------
fig = plt.figure(figsize=(16,7))
ax = fig.add_subplot(111)

data_by_zone = [
    df.loc[df["Zone"] == zone, "Depth"].dropna().values
    for zone in sorted(df["Zone"].unique())
]
pc = [
    "#0B3D91",  # dark blue
    "#649ED4",  # light blue
    "#1F4E79",  # medium blue
    "#9CC8FF"   # ice blue
]
oc = "Black"
bp = plt.boxplot(
    data_by_zone,
    label=[str(zone) for zone in sorted(df["Zone"].unique())],
    patch_artist=True,
    capprops=dict(color=oc),
    whiskerprops=dict(color=oc),
    flierprops=dict(color=oc, markeredgecolor=oc),
    medianprops=dict(color="#CC0000", linewidth=2)
)

for i, box in enumerate(bp["boxes"]):
    box.set_facecolor(pc[i % len(pc)])

plt.title("Ice Depth Distribution by Zone", fontsize=16)
plt.xlabel("Zone", fontsize=12)
plt.ylabel("Depth (inches)", fontsize=12)
plt.grid(axis='y', linestyle='--', alpha=0.5)

plt.tight_layout()
plt.show()