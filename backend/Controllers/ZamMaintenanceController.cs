using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ZamMaintenanceController : ControllerBase
{
    private readonly ThePondsBuildingDbContext _context;

    public ZamMaintenanceController(ThePondsBuildingDbContext context)
    {
        _context = context;
    }
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var data = await _context.ZamMaintenances.AsNoTracking().ToListAsync();
        return Ok(data);
    }
    [HttpPost]
    public async Task<IActionResult> Create(List<ZamMaintenanceRequest> requests)
    {
        var workerIdClaim = User.FindFirst("WorkerId")?.Value;

        if (!int.TryParse(workerIdClaim, out int workerId))
        {
            return Unauthorized();
        }

        var saved = new List<object>();

        foreach (var request in requests){

            var maintenance = new ZamMaintenance
            {
                ZamMaintenanceDate = request.ZamMaintenanceDate,
                Notes = request.Notes,
                BladeInventory = request.BladeInventory,
                BladeWidth = request.BladeWidth,
                ZamboniId = request.ZamboniId,
                WorkerId = workerId
            };
            _context.ZamMaintenances.Add(maintenance);
            await _context.SaveChangesAsync();
            foreach (var maintenanceItemId in request.MaintenanceItemIds)
            {
                var item = new ZamMaintenanceItem
                {
                    ZamMaintenanceId = maintenance.ZamMaintenanceId,
                    MaintenanceChecksAndRepairsId = maintenanceItemId
                };
                _context.ZamMaintenanceItems.Add(item);
            }
            await _context.SaveChangesAsync();
            saved.Add(new
            {
                maintenance.ZamMaintenanceId,
                maintenance.ZamMaintenanceDate,
                maintenance.Notes,
                maintenance.BladeInventory,
                maintenance.BladeWidth,
                maintenance.ZamboniId,
                maintenance.WorkerId,
                MaintenanceItemIds = request.MaintenanceItemIds
            });
        }
        return Ok(saved);
    }
}