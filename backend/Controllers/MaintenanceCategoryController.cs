using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MaintenanceCategoryController : ControllerBase
{
    private readonly ThePondsBuildingDbContext _context;

    public MaintenanceCategoryController(ThePondsBuildingDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var data = await _context.MaintenanceCategories.AsNoTracking().OrderBy(x => x.MaintenanceCategoryId).ToListAsync();
        return Ok(data);
    }
}