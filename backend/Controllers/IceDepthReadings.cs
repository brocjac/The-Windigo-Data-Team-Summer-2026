using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers;

[Authorize]
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
    public async Task<IActionResult> Create(IceDepthReading reading)
    {
        var workerIdClaim = User.FindFirst("WorkerId")?.Value;

        if (!int.TryParse(workerIdClaim, out int workerId))
        {
            return Unauthorized();
        }

        reading.WorkerId = workerId;

        _context.IceDepthReadings.AddRange(reading);
        await _context.SaveChangesAsync();
        return Ok(reading);
    }
}