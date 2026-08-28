using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ElectricityStatsController : ControllerBase
{
    private readonly ThePondsBuildingDbContext _context;

    public ElectricityStatsController(ThePondsBuildingDbContext context)
    {
        _context = context;
    }
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var data = await _context.ElectricityStats.AsNoTracking().ToListAsync();
        return Ok(data);
    }
    [HttpPost]
    public async Task<IActionResult> Create(ElectricityStat reading)
    {
        _context.ElectricityStats.Add(reading);
        await _context.SaveChangesAsync();
        return Ok(reading);
    }
}