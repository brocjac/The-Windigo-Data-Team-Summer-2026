using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IceDepthReadings : ControllerBase
{
    private readonly ThePondsBuildingDbContext _context;

    public IceDepthReadings(ThePondsBuildingDbContext context)
    {
        _context = context;
    }
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var data = await _context.IceDepthReadings.AsNoTracking().ToListAsync();
        return Ok(data);
    }
    [HttpPost]
    public async Task<IActionResult> Create(List<IceDepthReading> readings)
    {
        _context.IceDepthReadings.AddRange(readings);
        await _context.SaveChangesAsync();
        return Ok(readings);
    }
}