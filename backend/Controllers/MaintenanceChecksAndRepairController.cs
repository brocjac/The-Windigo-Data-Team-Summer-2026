using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MaintenanceChecksAndRepairController : ControllerBase
{
    private readonly ThePondsBuildingDbContext _context;

    public MaintenanceChecksAndRepairController(ThePondsBuildingDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var data = await _context.MaintenanceChecksAndRepairs.AsNoTracking().ToListAsync();
        return Ok(data);
    }

    [HttpGet("category/{categoryId}")]
    public async Task<IActionResult> GetByCategory(int categoryId)
    {
        var data = await _context.MaintenanceChecksAndRepairs.AsNoTracking().Where(x => x.MaintenanceCategoryId == categoryId).ToArrayAsync();
        return Ok(data);
    }
}