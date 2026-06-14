using Microsoft.EntityFrameworkCore;
using SmartCareer.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<SmartCareerDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAngular");

app.MapControllers();

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
            "Clean Architecture"
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