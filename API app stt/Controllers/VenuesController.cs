using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportsBookingAPI.Data;
using SportsBookingAPI.Models;

namespace SportsBookingAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Route("api/venue")]
public class VenuesController : ControllerBase
{
    private readonly AppDbContext _context;

    public VenuesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: /api/venues
    [HttpGet]
    public async Task<IActionResult> GetVenues()
    {
        var venues = await _context.Venues
            .AsNoTracking()
            .Where(v => v.IsActive)
            .Select(v => new
            {
                v.Id,
                v.Name,
                v.Address,
                v.Description,
                v.IsActive,
                CourtsCount = v.Courts.Count(c => c.IsActive)
            })
            .ToListAsync();

        return Ok(venues);
    }

    // GET: /api/venues/1
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetVenue(int id)
    {
        var venue = await _context.Venues
            .AsNoTracking()
            .Where(v => v.Id == id && v.IsActive)
            .Select(v => new
            {
                v.Id,
                v.Name,
                v.Address,
                v.Description,
                v.IsActive,
                Courts = v.Courts.Where(c => c.IsActive).Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.SportType,
                    c.PricePerHour
                }).ToList()
            })
            .FirstOrDefaultAsync();

        if (venue == null)
        {
            return NotFound(new { message = "Không tìm thấy địa điểm/cơ sở sân này." });
        }

        return Ok(venue);
    }
}
