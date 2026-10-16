using Microsoft.EntityFrameworkCore;
using SportsBookingAPI.Data;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString(
            "DefaultConnection"
        )
    )
);
// Add services to the container.

builder.Services.AddControllers();
// Configure CORS for web API tester frontend
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Phục vụ giao diện Web Tester từ thư mục wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

// Enable CORS middleware before Authorization and MapControllers
app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();
