#install.packages("rlang")
#install.packages("dplyr")
#install.packages("readr")
#install.packages("ggplot2")

library(dplyr)
library(readr)

# Load your long-format ice depth data
df <- read_csv("Windigo_Ice_Depths_Unpivoted.csv", show_col_types = FALSE)

# Ensure numeric
df$Depth <- as.numeric(df$Depth)

# Compute thresholds by Zone
thresholds <- df %>%
    group_by(Zone) %>%
    summarise(
        PctBelow075 = mean(Depth < 0.75, na.rm = TRUE) * 100,
        PctBelow100 = mean(Depth < 1.00, na.rm = TRUE) * 100,
        PctBelow125 = mean(Depth < 1.25, na.rm = TRUE) * 100
    )

# Save output
# write_csv(thresholds, "Thresholds.csv")