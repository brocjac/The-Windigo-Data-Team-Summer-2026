namespace backend.Controllers;

public class ZamMaintenanceRequest
{
    public DateOnly ZamMaintenanceDate { get; set; }

    public string? Notes { get; set; }

    public int BladeInventory { get; set; }

    public decimal? BladeWidth { get; set; }

    public int ZamboniId { get; set; }

    public int? WorkerId { get; set; }

    public List<int> MaintenanceItemIds { get; set; } = new();
}