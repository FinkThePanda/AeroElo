using Microsoft.EntityFrameworkCore;
using AeroElo.Api.Data;
using AeroElo.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactDevServer", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Configure SQLite Database
builder.Services.AddDbContext<AeroEloDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") 
        ?? "Data Source=aeroelo.db"));

// Register services
builder.Services.AddScoped<IEloService, EloService>();

builder.Services.AddControllers();

// Configure Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "AeroElo API v1");
        options.RoutePrefix = string.Empty; // Set Swagger UI at the app's root
        options.DocumentTitle = "AeroElo API Documentation";
    });
}

app.UseHttpsRedirection();

app.UseCors("ReactDevServer");

app.UseAuthorization();

app.MapControllers();

app.Run();
