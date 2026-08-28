using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RinkMiscMaintenanceController : ControllerBase
{
    private readonly ThePondsBuildingDbContext _context;

    public RinkMiscMaintenanceController(ThePondsBuildingDbContext context)
    {
        _context = context;
    }
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var data = await _context.RinkMiscMaintenances.AsNoTracking().ToListAsync();
        return Ok(data);
    }
    [HttpPost]
    public async Task<IActionResult> Create(RinkMiscMaintenance reading)
    {
        _context.RinkMiscMaintenances.Add(reading);
        await _context.SaveChangesAsync();
        return Ok(reading);
    }
}