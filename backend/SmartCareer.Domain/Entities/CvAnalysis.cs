namespace SmartCareer.Domain.Entities;

public class CvAnalysis
{
    public Guid Id { get; set; }

    public Guid CurriculumId { get; set; }

    public Curriculum? Curriculum { get; set; }

    public int AtsScore { get; set; }

    public string ProfileDetected { get; set; } = string.Empty;

    public string Strengths { get; set; } = string.Empty;

    public string Weaknesses { get; set; } = string.Empty;

    public string Recommendations { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}