using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FacilityHvacFilterController : ControllerBase
{
    private readonly ThePondsBuildingDbContext _context;

    public FacilityHvacFilterController(ThePondsBuildingDbContext context)
    {
        _context = context;
    }
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var data = await _context.FacilityHvacFilters
            .AsNoTracking()
            .OrderByDescending(x => x.FacilityHvacFilterId)
            .ToListAsync();
        return Ok(data);
    }
    [HttpPost]
    public async Task<IActionResult> Create(FacilityHvacRequest request)
    {
        // Get the most recent HVAC record
        var previousRecord = await _context.FacilityHvacFilters
            .AsNoTracking()
            .OrderByDescending(x => x.FacilityHvacFilterId)
            .FirstOrDefaultAsync();

        // Start with the most recent inventory
        int Inventory16x22 = previousRecord?._16x22Inventory ?? 0;

        int Inventory20x20 = previousRecord?._20x20Inventory ?? 0;

        int Inventory20x25 = previousRecord?._20x25Inventory ?? 0;

        // Apply inventory additions / overrides first
        Inventory16x22 = ApplyInventoryAdjustment(
            Inventory16x22,
            request.Inventory16x22Mode,
            request.Inventory16x22Amount
        );

        Inventory20x20 = ApplyInventoryAdjustment(
            Inventory20x20,
            request.Inventory20x20Mode,
            request.Inventory20x20Amount
        );

        Inventory20x25 = ApplyInventoryAdjustment(
            Inventory20x25,
            request.Inventory20x25Mode,
            request.Inventory20x25Amount
        );

        
        // -----------------------------
        // 20x25
        // -----------------------------

        // Filter was changed, so one was used
        if (WasFilterChanged(request.Changed20x25))
        {
            if (Inventory20x25 <= 0)
            {
                return BadRequest(
                    "No 20x25 filters are available in inventory."
                );
            }

            Inventory20x25--;
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
        // 16x22
        // -----------------------------

        // Filter was changed, so one was used
        if (WasFilterChanged(request.Changed16x22))
        {
            if (Inventory16x22 <= 0)
            {
                return BadRequest(
                    "No 16x22 filters are available in inventory."
                );
            }

            Inventory16x22--;
        }

        // Create a NEW history record
        var newRecord = new FacilityHvacFilter
        {
            FacilityChangeDate = request.FacilityChangeDate,

            _20x25Changed = NormalizeStatus(request.Changed20x25),
            _20x20Changed = NormalizeStatus(request.Changed20x20),
            _16x22Changed = NormalizeStatus(request.Changed16x22),

            _16x22Inventory = Inventory16x22,
            _20x20Inventory = Inventory20x20,
            _20x25Inventory = Inventory20x25,

            Notes = request.Notes
        };

        _context.FacilityHvacFilters.Add(newRecord);
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