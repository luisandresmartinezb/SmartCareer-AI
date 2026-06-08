using Microsoft.EntityFrameworkCore;
using SmartCareer.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.AddDbContext<SmartCareerDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapGet("/", () => "SmartCareer API is running");

app.MapGet("/api/dashboard", () =>
{
    return Results.Ok(new
    {
        project = "SmartCareer AI",
        status = "Demo funcional",
        description = "Plataforma inteligente para análisis de currículums, habilidades y certificaciones.",
        technologies = new[]
        {
            "Angular",
            "ASP.NET Core",
            "SQL Server",
            "Entity Framework Core",
            "Clean Architecture",
            "Azure"
        },
        metrics = new
        {
            users = 1,
            curriculums = 1,
            skills = 5,
            certifications = 2
        }
    });
});

app.Run();