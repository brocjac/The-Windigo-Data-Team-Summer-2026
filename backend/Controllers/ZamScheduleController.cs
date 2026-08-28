using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ZamScheduleController : ControllerBase
{
    private readonly ThePondsBuildingDbContext _context;

    public ZamScheduleController(ThePondsBuildingDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var data = await _context.ZamSchedules
            .AsNoTracking()
            .OrderByDescending(x => x.ZamScheduleDate)
            .ToListAsync();

        return Ok(data);
    }

    [HttpPost]
    public async Task<IActionResult> Create(ZamScheduleRequest request)
    {
        var schedule = new ZamSchedule
        {
            ZamScheduleDate = request.ZamScheduleDate,
            Notes = request.Notes,
            ZamboniId = request.ZamboniId,
            WorkerId = request.WorkerId
        };

        _context.ZamSchedules.Add(schedule);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            schedule.ZamScheduleId,
            schedule.ZamScheduleDate,
            schedule.Notes,
            schedule.ZamboniId,
            schedule.WorkerId
        });
    }
}