using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RinkTempHumidityController : ControllerBase
{
    private readonly ThePondsBuildingDbContext _context;

    public RinkTempHumidityController(ThePondsBuildingDbContext context)
    {
        _context = context;
    }
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var data = await _context.RinkTempHumidities.AsNoTracking().ToListAsync();
        return Ok(data);
    }
    [HttpPost]
    public async Task<IActionResult> Create(RinkTempHumidity reading)
    {
        _context.RinkTempHumidities.Add(reading);
        await _context.SaveChangesAsync();
        return Ok(reading);
    }
}