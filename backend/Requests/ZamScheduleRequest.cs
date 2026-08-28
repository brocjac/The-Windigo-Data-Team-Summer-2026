namespace backend.Models;

public class ZamScheduleRequest
{
    public DateOnly ZamScheduleDate { get; set; }

    public string? Notes { get; set; }

    public int? ZamboniId { get; set; }

    public int? WorkerId { get; set; }
}