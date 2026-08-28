namespace backend.Controllers;

public class RinkHvacRequest
{
    public DateOnly RinkChangeDate { get; set; }

    // Was filter changed?
    public string Changed18x24 { get; set; } = "No";

    public string Changed20x20 { get; set; } = "No";

    public string Changed24x24 { get; set; } = "No";

    // Inventory mode:
    // "add", "set", or "none"

    public string Inventory18x24Mode { get; set; } = "None";
    public int Inventory18x24Amount { get; set; }

    public string Inventory20x20Mode { get; set; } = "None";
    public int Inventory20x20Amount { get; set; }

    public string Inventory24x24Mode { get; set; } = "None";
    public int Inventory24x24Amount { get; set; }

    public string? Notes { get; set; }
}