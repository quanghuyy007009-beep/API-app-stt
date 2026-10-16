
namespace SportsBookingAPI.Models;

public class Court
{
    public int Id { get; set; }

    public int VenueId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string SportType { get; set; } = string.Empty;

    public decimal PricePerHour { get; set; }

    public bool IsActive { get; set; } = true;

    public Venue? Venue { get; set; }
}
