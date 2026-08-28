using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IceMaintenanceController : ControllerBase
{
    private readonly ThePondsBuildingDbContext _context;

    public IceMaintenanceController(ThePondsBuildingDbContext context)
    {
        _context = context;
    }
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var data = await _context.IceMaintenances.AsNoTracking().ToListAsync();
        return Ok(data);
    }
    [HttpPost]
    public async Task<IActionResult> Create(IceMaintenance reading)
    {
        _context.IceMaintenances.Add(reading);
        await _context.SaveChangesAsync();
        return Ok(reading);
    }
}