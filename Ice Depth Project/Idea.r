#install.packages("tidyverse")
#install.packages("akima")
#install.packages("ggforce")

library(tidyverse)
library(akima)
library(ggforce)

df <- read_csv("Windigo_Ice_Depths_Unpivoted.csv")

df <- df %>%
  mutate(
    Date = as.Date(Date, format = "%m/%d/%y"),
    Zone = as.numeric(Zone),
    Depth = as.numeric(Depth)
  )

point_locations <- tibble(
  Zone = c(16,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15),
  x = c(20,40,75,100,125,180,193,170,180,125,100,75,40,20,7,30),
  y = c(76,78,78,78,78,76,42.5,42.5,9,7,7,7,7,9,42.5,42.5)
)

zone_avg <- df %>%
  group_by(Zone) %>%
  summarise(Depth = mean(Depth, na.rm = TRUE), .groups = "drop") %>%
  left_join(point_locations, by = "Zone")

interp <- with(zone_avg, interp(x, y, Depth, xo = seq(0, 200, length = 500),
                                yo = seq(0, 85, length = 250)))

heat_df <- expand.grid(x = interp$x, y = interp$y)
heat_df$Depth <- as.vector(interp$z)

p <- ggplot() +
  geom_raster(data = heat_df, aes(x = x, y = y, fill = Depth), alpha = 0.75) +
  geom_point(data = zone_avg, aes(x = x, y = y), size = 8, color = "black") +
  geom_text(data = zone_avg, aes(x = x, y = y + 2, label = Zone), color = "white") +
  geom_text(data = zone_avg, aes(x = x, y = y - 2, label = round(Depth, 2)), color = "white") +
  geom_rect(aes(xmin = 0, xmax = 200, ymin = 0, ymax = 85), fill = NA, color = "black") +
  geom_vline(xintercept = c(75, 100, 125), color = "black") +
  coord_fixed() +
  scale_fill_gradient(low = "white", high = "blue") +
  labs(title = "Windigo Average Ice Depth Heatmap", fill = "Ice depth") +
  theme_void()

print(p)