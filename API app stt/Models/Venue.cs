
namespace SportsBookingAPI.Models;

public class Venue
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;

    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;

    public List<Court> Courts { get; set; } = new();
}
