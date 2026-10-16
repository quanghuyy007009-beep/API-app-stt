
using Microsoft.EntityFrameworkCore;
using SportsBookingAPI.Models;

namespace SportsBookingAPI.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(
        DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Venue> Venues => Set<Venue>();

    public DbSet<Court> Courts => Set<Court>();

    protected override void OnModelCreating(
        ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Court>()
            .Property(c => c.PricePerHour)
            .HasPrecision(12, 2);

        modelBuilder.Entity<Court>()
            .HasOne(c => c.Venue)
            .WithMany(v => v.Courts)
            .HasForeignKey(c => c.VenueId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
