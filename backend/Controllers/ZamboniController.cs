using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ZamboniController : ControllerBase
{
    private readonly ThePondsBuildingDbContext _context;

    public ZamboniController(ThePondsBuildingDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var data = await _context.Zambonis.AsNoTracking().OrderBy(x => x.ZamboniId).ToListAsync();
        return Ok(data);
    }
}