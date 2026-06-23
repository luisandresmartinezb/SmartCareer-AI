using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartCareer.Domain.Entities;
using SmartCareer.Infrastructure.Data;

namespace SmartCareer.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CvAnalysisController : ControllerBase
{
    private readonly SmartCareerDbContext _context;

    public CvAnalysisController(SmartCareerDbContext context)
    {
        _context = context;
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetHistory()
    {
        var analyses = await _context.CvAnalyses
            .Include(a => a.Curriculum)
            .OrderByDescending(a => a.CreatedAt)
            .Select(a => new
            {
                a.Id,
                FileName = a.Curriculum != null ? a.Curriculum.FileName : "",
                a.AtsScore,
                a.ProfileDetected,
                Strengths = a.Strengths.Split(" | ", StringSplitOptions.RemoveEmptyEntries),
                Weaknesses = a.Weaknesses.Split(" | ", StringSplitOptions.RemoveEmptyEntries),
                Recommendations = a.Recommendations.Split(" | ", StringSplitOptions.RemoveEmptyEntries),
                a.CreatedAt
            })
            .ToListAsync();

        return Ok(analyses);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateCvAnalysisRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.FullName))
        {
            return BadRequest("El nombre completo es obligatorio.");
        }

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return BadRequest("El email es obligatorio.");
        }

        if (string.IsNullOrWhiteSpace(request.FileName))
        {
            return BadRequest("El nombre del archivo es obligatorio.");
        }

        if (request.AtsScore < 0 || request.AtsScore > 100)
        {
            return BadRequest("La puntuación ATS debe estar entre 0 y 100.");
        }

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null)
        {
            user = new User
            {
                Id = Guid.NewGuid(),
                FullName = request.FullName,
                Email = request.Email,
                PasswordHash = "demo-password",
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
        }

        var curriculum = new Curriculum
        {
            Id = Guid.NewGuid(),
            FileName = request.FileName,
            FilePath = $"uploads/{request.FileName}",
            UploadedAt = DateTime.UtcNow,
            UserId = user.Id
        };

        _context.Curriculums.Add(curriculum);

        var analysis = new CvAnalysis
        {
            Id = Guid.NewGuid(),
            CurriculumId = curriculum.Id,
            AtsScore = request.AtsScore,
            ProfileDetected = request.ProfileDetected,
            Strengths = string.Join(" | ", request.Strengths),
            Weaknesses = string.Join(" | ", request.Weaknesses),
            Recommendations = string.Join(" | ", request.Recommendations),
            CreatedAt = DateTime.UtcNow
        };

        _context.CvAnalyses.Add(analysis);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            analysis.Id,
            curriculum.FileName,
            analysis.AtsScore,
            analysis.ProfileDetected,
            Strengths = request.Strengths,
            Weaknesses = request.Weaknesses,
            Recommendations = request.Recommendations,
            analysis.CreatedAt
        });
    }
}

public class CreateCvAnalysisRequest
{
    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string FileName { get; set; } = string.Empty;

    public int AtsScore { get; set; }

    public string ProfileDetected { get; set; } = string.Empty;

    public List<string> Strengths { get; set; } = new();

    public List<string> Weaknesses { get; set; } = new();

    public List<string> Recommendations { get; set; } = new();
}