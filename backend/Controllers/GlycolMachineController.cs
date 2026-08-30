using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GlycolMachineController : ControllerBase
{
    private readonly ThePondsBuildingDbContext _context;

    public GlycolMachineController(ThePondsBuildingDbContext context)
    {
        _context = context;
    }
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var data = await _context.GlycolMachines.AsNoTracking().ToListAsync();
        return Ok(data);
    }
    [HttpPost]
    public async Task<IActionResult> Create(GlycolMachine reading)
    {
        _context.GlycolMachines.Add(reading);
        await _context.SaveChangesAsync();
        return Ok(reading);
    }
}