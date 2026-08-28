namespace backend.Controllers;

public class FacilityHvacRequest
{
    public DateOnly FacilityChangeDate { get; set; }

    // Was filter changed?
    public string Changed16x22 { get; set; } = "No";

    public string Changed20x20 { get; set; } = "No";

    public string Changed20x25 { get; set; } = "No";

    // Inventory mode:
    // "add", "set", or "none"

    public string Inventory16x22Mode { get; set; } = "None";
    public int Inventory16x22Amount { get; set; }

    public string Inventory20x20Mode { get; set; } = "None";
    public int Inventory20x20Amount { get; set; }

    public string Inventory20x25Mode { get; set; } = "None";
    public int Inventory20x25Amount { get; set; }

    public string? Notes { get; set; }
}