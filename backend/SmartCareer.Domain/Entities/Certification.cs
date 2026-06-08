namespace SmartCareer.Domain.Entities;

public class Certification
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Provider { get; set; } = string.Empty;

    public DateTime? ObtainedAt { get; set; }
}