using Microsoft.EntityFrameworkCore;
using SmartCareer.Domain.Entities;

namespace SmartCareer.Infrastructure.Data;

public class SmartCareerDbContext : DbContext
{
    public SmartCareerDbContext(DbContextOptions<SmartCareerDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    public DbSet<Curriculum> Curriculums => Set<Curriculum>();

    public DbSet<Skill> Skills => Set<Skill>();

    public DbSet<Certification> Certifications => Set<Certification>();

    public DbSet<JobOffer> JobOffers => Set<JobOffer>();

    public DbSet<CvAnalysis> CvAnalyses => Set<CvAnalysis>();
}