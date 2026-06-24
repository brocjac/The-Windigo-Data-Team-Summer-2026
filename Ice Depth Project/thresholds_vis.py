import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Circle, Arc, PathPatch
from matplotlib.path import Path
from scipy.interpolate import griddata
from scipy.ndimage import gaussian_filter
from matplotlib.patches import Circle

csv_path = "D:\other-files\school\database_dev\The-Windigo-Data-Team-Summer-2026\Ice Depth Project\Windigo_Ice_Depths_Unpivoted.csv"

# Standard hockey rink size in feet
L, W = 200, 85

# x = left/right across rink length (0)
# y = up/down across rink width (1)
point_locations = {
    16: (20, 76),
    1: (40, 78),
    2: (75, 78),
    3: (100, 78),
    4: (125, 78),
    5: (180, 76),

    6: (193, 42.5),
    7: (170, 42.5),
    
    8: (180, 9),
    9: (125, 7),
    10: (100, 7),
    11: (75, 7),
    12: (40, 7),
    13: (20, 9),

    14: (7, 42.5),
    15: (30, 42.5),
}
# =========================
# LOAD CSV
# =========================



df = pd.read_csv(csv_path)
df["Zone"] = pd.to_numeric(df["Zone"], errors="coerce")
df["Depth"] = pd.to_numeric(df["Depth"], errors="coerce")

thresholds = (
    df.groupby("Zone")
        .agg(
            PctBelow075 = ("Depth", lambda x: (x < 0.75).mean() * 100),
            PctBelow100 = ("Depth", lambda x: (x < 1.00).mean() * 100),
            PctBelow125 = ("Depth", lambda x: (x < 1.25).mean() * 100)
        )
    .reset_index()
)

labels = thresholds["Zone"].to_numpy(dtype=int)
values = thresholds["PctBelow075"].to_numpy(dtype=float)

xs = np.array([point_locations[i][0] for i in labels], dtype=float)
ys = np.array([point_locations[i][1] for i in labels], dtype=float)

# =========================
# DRAW RINK
# =========================

def rounded_rink_patch(ax, length=200, width=85, radius=28, **kwargs):
    verts, codes = [], []
    x0, y0, x1, y1, r = 0, 0, length, width, radius

    verts.append((x0+r, y0)); codes.append(Path.MOVETO)
    verts.append((x1-r, y0)); codes.append(Path.LINETO)

    for t in np.linspace(-90, 0, 16):
        verts.append((x1-r + r*np.cos(np.deg2rad(t)), y0+r + r*np.sin(np.deg2rad(t))))
        codes.append(Path.LINETO)

    verts.append((x1, y1-r)); codes.append(Path.LINETO)

    for t in np.linspace(0, 90, 16):
        verts.append((x1-r + r*np.cos(np.deg2rad(t)), y1-r + r*np.sin(np.deg2rad(t))))
        codes.append(Path.LINETO)

    verts.append((x0+r, y1)); codes.append(Path.LINETO)

    for t in np.linspace(90, 180, 16):
        verts.append((x0+r + r*np.cos(np.deg2rad(t)), y1-r + r*np.sin(np.deg2rad(t))))
        codes.append(Path.LINETO)

    verts.append((x0, y0+r)); codes.append(Path.LINETO)

    for t in np.linspace(180, 270, 16):
        verts.append((x0+r + r*np.cos(np.deg2rad(t)), y0+r + r*np.sin(np.deg2rad(t))))
        codes.append(Path.LINETO)

    verts.append((x0+r, y0)); codes.append(Path.CLOSEPOLY)

    return PathPatch(Path(verts, codes), **kwargs)

def draw_rink(ax):
    rink = rounded_rink_patch(
        ax,
        L,
        W,
        facecolor="none",
        edgecolor="black",
        linewidth=2.5
    )
    ax.add_patch(rink)

    # Center and blue lines
    ax.plot([100, 100], [0, W], linewidth=2)
    ax.plot([75, 75], [0, W], linewidth=1.5)
    ax.plot([125, 125], [0, W], linewidth=1.5)

    # Goal lines
    ax.plot([11, 11], [20, 65], linewidth=1.2)
    ax.plot([189, 189], [20, 65], linewidth=1.2)

    # Faceoff circles
    for x, y, r in [
        (100, 42.5, 15),
        (50, 22, 15),
        (50, 63, 15),
        (150, 22, 15),
        (150, 63, 15)
    ]:
        ax.add_patch(Circle((x, y), r, fill=False, linewidth=1.2))
        ax.add_patch(Circle((x, y), 1.2, fill=True))

    # Goal creases
    ax.add_patch(Arc((11, 42.5), 12, 12, theta1=270, theta2=90, linewidth=1.2))
    ax.add_patch(Arc((189, 42.5), 12, 12, theta1=90, theta2=270, linewidth=1.2))

    # Label "Home" and "Visitor"
    ax.plot([80, 80], [-2, -1], color="black", linewidth=2)
    ax.plot([80, 95], [-2, -2], color="black", linewidth=2)
    ax.plot([95, 95], [-2, -1], color="black", linewidth=2)
    ax.text(
        87.5,
        -5,
        "Home",
        ha="center",
        va="center",
        fontsize=12,
        fontweight="bold",
        color="Black",
        zorder=20
    )

    ax.plot([105, 105], [-2, -1], color="black", linewidth=2)
    ax.plot([105, 120], [-2, -2], color="black", linewidth=2)
    ax.plot([120, 120], [-2, -1], color="black", linewidth=2)
    ax.text(
        112.5,
        -5,
        "Visitor",
        ha="center",
        va="center",
        fontsize=12,
        fontweight="bold",
        color="Black",
        zorder=20
    )

    ax.set_xlim(-7, L + 3)
    ax.set_ylim(-7, W + 3)
    ax.set_aspect("equal")
    ax.axis("off")

# Interpolate points into smooth heatmap
grid_x, grid_y = np.mgrid[0:L:500j, 0:W:250j]
grid_z = griddata((xs, ys), values, (grid_x, grid_y), method="linear")

# Fill empty areas with nearest values
nearest_z = griddata((xs, ys), values, (grid_x, grid_y), method="nearest")
grid_z = np.where(np.isnan(grid_z), nearest_z, grid_z)

fig, ax = plt.subplots(figsize=(14, 7))

grid_z = gaussian_filter(grid_z, sigma=15)

im = ax.imshow(
    grid_z.T,
    extent=(0, L, 0, W),
    origin="lower",
    alpha=0.72,
    aspect="equal",
    cmap="Blues"
)

rink_clip = rounded_rink_patch(
    ax,
    L,
    W,
    facecolor="none",
    edgecolor="none"
)

ax.add_patch(rink_clip)
im.set_clip_path(rink_clip)

draw_rink(ax)

# Plot measurement points
ax.scatter(xs, ys, s=110, edgecolors="black", linewidths=1.2)

for x, y, label, value in zip(xs, ys, labels, values):
    circle = Circle(
        (x,y),
        radius=6,
        facecolor="black",
        alpha=0.8,
        zorder=10
    )
    ax.add_patch(circle)
    if value < 1.25:
        text_color = "#ff0000"
    elif value < 1.35:
        text_color = "#ffd700"
    elif value > 1.55:
        text_color = "#00a2ff"
    else:
        text_color = "#00ff00"
    ax.text(
        x,
        y + 2,
        f"{label}",
        ha="center",
        va="center",
        fontsize=18,
        fontweight="bold",
        color=text_color,
        zorder=20
    )
    ax.text(
        x,
        y - 2,
        f"{value:.2f}",
        ha="center",
        va="center",
        fontsize=15,
        fontweight="semibold",
        color=text_color,
        zorder=20
    )
cbar = fig.colorbar(im, ax=ax, fraction=0.035, pad=0.025)
cbar.set_label("Ice depth")

ax.set_title(f"Windigo Average Ice Depth Heatmap", fontsize=16, pad=12)

plt.tight_layout()
plt.show()