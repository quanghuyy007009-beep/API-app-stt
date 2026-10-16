
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportsBookingAPI.Data;
using SportsBookingAPI.Models;

namespace SportsBookingAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Route("api/court")]
public class CourtsController : ControllerBase
{
    private readonly AppDbContext _context;

    public CourtsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: /api/courts
    [HttpGet]
    public async Task<IActionResult> GetCourts(
        [FromQuery] string? sportType,
        [FromQuery] int? venueId)
    {
        var query = _context.Courts
            .AsNoTracking()
            .Where(c => c.IsActive);

        if (!string.IsNullOrWhiteSpace(sportType))
        {
            query = query.Where(
                c => c.SportType == sportType);
        }

        if (venueId.HasValue)
        {
            query = query.Where(
                c => c.VenueId == venueId.Value);
        }

        var courts = await query
            .OrderBy(c => c.Name)
            .Select(c => new
            {
                c.Id,
                c.VenueId,
                VenueName = c.Venue != null ? c.Venue.Name : string.Empty,
                Address = c.Venue != null ? c.Venue.Address : string.Empty,
                c.Name,
                c.SportType,
                c.PricePerHour,
                c.IsActive
            })
            .ToListAsync();

        return Ok(courts);
    }

    // GET: /api/courts/1
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetCourt(int id)
    {
        var court = await _context.Courts
            .AsNoTracking()
            .Where(c => c.Id == id && c.IsActive)
            .Select(c => new
            {
                c.Id,
                c.VenueId,
                VenueName = c.Venue != null ? c.Venue.Name : string.Empty,
                Address = c.Venue != null ? c.Venue.Address : string.Empty,
                c.Name,
                c.SportType,
                c.PricePerHour,
                c.IsActive
            })
            .FirstOrDefaultAsync();

        if (court == null)
        {
            return NotFound(new
            {
                message = "Không tìm thấy sân."
            });
        }

        return Ok(court);
    }

    // POST: /api/courts
    [HttpPost]
    public async Task<IActionResult> CreateCourt([FromBody] CreateCourtDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            return BadRequest(new { message = "Tên sân không được để trống." });
        }

        // Tự động tìm hoặc tạo một Venue mặc định nếu VenueId chưa tồn tại để tránh lỗi Foreign Key
        var targetVenueId = dto.VenueId;
        var venueExists = await _context.Venues.AnyAsync(v => v.Id == targetVenueId);
        if (!venueExists)
        {
            var defaultVenue = await _context.Venues.FirstOrDefaultAsync();
            if (defaultVenue == null)
            {
                defaultVenue = new Venue
                {
                    Name = "Sân Vận Động Trung Tâm",
                    Address = "123 Đường Thể Thao, TP.HCM",
                    IsActive = true
                };
                _context.Venues.Add(defaultVenue);
                await _context.SaveChangesAsync();
            }
            targetVenueId = defaultVenue.Id;
        }

        var court = new Court
        {
            VenueId = targetVenueId,
            Name = dto.Name.Trim(),
            SportType = string.IsNullOrWhiteSpace(dto.SportType) ? "Chung" : dto.SportType.Trim(),
            PricePerHour = dto.PricePerHour >= 0 ? dto.PricePerHour : 0,
            IsActive = true
        };

        _context.Courts.Add(court);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCourt), new { id = court.Id }, new
        {
            message = "Thêm sân mới thành công!",
            court = new
            {
                court.Id,
                court.VenueId,
                court.Name,
                court.SportType,
                court.PricePerHour,
                court.IsActive
            }
        });
    }

    // PUT: /api/courts/1
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateCourt(int id, [FromBody] UpdateCourtDto dto)
    {
        var court = await _context.Courts.FindAsync(id);
        if (court == null)
        {
            return NotFound(new { message = $"Không tìm thấy sân có ID {id} để cập nhật." });
        }

        if (!string.IsNullOrWhiteSpace(dto.Name))
        {
            court.Name = dto.Name.Trim();
        }

        if (!string.IsNullOrWhiteSpace(dto.SportType))
        {
            court.SportType = dto.SportType.Trim();
        }

        if (dto.PricePerHour.HasValue)
        {
            court.PricePerHour = dto.PricePerHour.Value;
        }

        if (dto.VenueId.HasValue && dto.VenueId.Value > 0)
        {
            var venueExists = await _context.Venues.AnyAsync(v => v.Id == dto.VenueId.Value);
            if (venueExists)
            {
                court.VenueId = dto.VenueId.Value;
            }
        }

        if (dto.IsActive.HasValue)
        {
            court.IsActive = dto.IsActive.Value;
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = $"Cập nhật thông tin sân #{id} thành công!",
            court = new
            {
                court.Id,
                court.VenueId,
                court.Name,
                court.SportType,
                court.PricePerHour,
                court.IsActive
            }
        });
    }

    // DELETE: /api/courts/1
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteCourt(int id)
    {
        var court = await _context.Courts.FindAsync(id);
        if (court == null)
        {
            return NotFound(new { message = $"Không tìm thấy sân có ID {id} để xóa." });
        }

        _context.Courts.Remove(court);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = $"Đã xóa thành công sân có ID {id}.",
            deletedCourtId = id
        });
    }
}

public class CreateCourtDto
{
    public int VenueId { get; set; } = 1;
    public string Name { get; set; } = string.Empty;
    public string SportType { get; set; } = string.Empty;
    public decimal PricePerHour { get; set; }
}

public class UpdateCourtDto
{
    public int? VenueId { get; set; }
    public string? Name { get; set; }
    public string? SportType { get; set; }
    public decimal? PricePerHour { get; set; }
    public bool? IsActive { get; set; }
}
