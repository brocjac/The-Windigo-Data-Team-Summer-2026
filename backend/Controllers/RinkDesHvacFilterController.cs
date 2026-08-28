using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RinkDesHvacFilterController : ControllerBase
{
    private readonly ThePondsBuildingDbContext _context;

    public RinkDesHvacFilterController(ThePondsBuildingDbContext context)
    {
        _context = context;
    }
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var data = await _context.RinkDesHvacFilters
            .AsNoTracking()
            .OrderByDescending(x => x.RinkHvacFilterId)
            .ToListAsync();
        return Ok(data);
    }
    [HttpPost]
    public async Task<IActionResult> Create(RinkHvacRequest request)
    {
        // Get the most recent HVAC record
        var previousRecord = await _context.RinkDesHvacFilters
            .AsNoTracking()
            .OrderByDescending(x => x.RinkHvacFilterId)
            .FirstOrDefaultAsync();

        // Start with the most recent inventory
        int Inventory18x24 = previousRecord?._18x24Inventory ?? 0;

        int Inventory20x20 = previousRecord?._20x20Inventory ?? 0;

        int Inventory24x24 = previousRecord?._24x24Inventory ?? 0;

        // Apply inventory additions / overrides first
        Inventory18x24 = ApplyInventoryAdjustment(
            Inventory18x24,
            request.Inventory18x24Mode,
            request.Inventory18x24Amount
        );

        Inventory20x20 = ApplyInventoryAdjustment(
            Inventory20x20,
            request.Inventory20x20Mode,
            request.Inventory20x20Amount
        );

        Inventory24x24 = ApplyInventoryAdjustment(
            Inventory24x24,
            request.Inventory24x24Mode,
            request.Inventory24x24Amount
        );

        
        // -----------------------------
        // 24x24
        // -----------------------------

        // Filter was changed, so one was used
        if (WasFilterChanged(request.Changed24x24))
        {
            if (Inventory24x24 <= 0)
            {
                return BadRequest(
                    "No 24x24 filters are available in inventory."
                );
            }

            Inventory24x24--;
        }

        // -----------------------------
        // 20x20
        // -----------------------------

        // Filter was changed, so one was used
        if (WasFilterChanged(request.Changed20x20))
        {
            if (Inventory20x20 <= 0)
            {
                return BadRequest(
                    "No 20x20 filters are available in inventory."
                );
            }

            Inventory20x20--;
        }

        // -----------------------------
        // 18x24
        // -----------------------------

        // Filter was changed, so one was used
        if (WasFilterChanged(request.Changed18x24))
        {
            if (Inventory18x24 <= 0)
            {
                return BadRequest(
                    "No 18x24 filters are available in inventory."
                );
            }

            Inventory18x24--;
        }

        // Create a NEW history record
        var newRecord = new RinkDesHvacFilter
        {
            RinkChangeDate = request.RinkChangeDate,

            _24x24Changed = NormalizeStatus(request.Changed24x24),
            _20x20Changed = NormalizeStatus(request.Changed20x20),
            _18x24Changed = NormalizeStatus(request.Changed18x24),

            _18x24Inventory = Inventory18x24,
            _20x20Inventory = Inventory20x20,
            _24x24Inventory = Inventory24x24,

            Notes = request.Notes
        };

        _context.RinkDesHvacFilters.Add(newRecord);
        await _context.SaveChangesAsync();
        return Ok(newRecord);
    }

    private static bool WasFilterChanged(string? value)
    {
        return 
            string.Equals(
                value,
                "Yes",
                StringComparison.OrdinalIgnoreCase
            )
            ||
            string.Equals(
                value,
                "Fixed + Changed",
                StringComparison.OrdinalIgnoreCase
            );
    }

    private static string NormalizeStatus(string? value)
    {
        if (string.Equals(
            value,
            "Yes",
            StringComparison.OrdinalIgnoreCase))
        {
            return "Yes";
        }
        if (string.Equals(
            value,
            "Down",
            StringComparison.OrdinalIgnoreCase))
        {
            return "Down";
        }
        if (string.Equals(
            value,
            "Fixed",
            StringComparison.OrdinalIgnoreCase))
        {
            return "Fixed";
        }
        if (string.Equals(
            value,
            "Fixed + Changed",
            StringComparison.OrdinalIgnoreCase))
        {
            return "Fixed + Changed";
        }

        return "No";
    }

    private static int ApplyInventoryAdjustment(int CurrentInventory, string? mode, int amount)
    {
        if (amount < 0)
        {
            throw new ArgumentException(
                "Inventory amount cannot be negative."
            );
        }

        // Add newly delivered filters
        if (string.Equals(mode, "add", StringComparison.OrdinalIgnoreCase))
        {
            return CurrentInventory + amount;
        }
        if (string.Equals(mode, "set", StringComparison.OrdinalIgnoreCase))
        {
            return amount;
        }

        // "none" means inventory stays unchanged
        return CurrentInventory;
    }
    
}