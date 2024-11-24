
using Microsoft.EntityFrameworkCore;

namespace prid_2324_g06.Models;

public class PridContext : DbContext
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Student> Students => Set<Student>();
    public DbSet<Quiz> Quizzes => Set<Quiz>();
    public DbSet<Question> Questions => Set<Question>();
    public DbSet<Answer> Answers => Set<Answer>();
    public DbSet<Attempt> Attempts => Set<Attempt>();
    public DbSet<Database> Databases => Set<Database>();
    public DbSet<Solution> Solutions => Set<Solution>();



    public PridContext(DbContextOptions<PridContext> options)
        : base(options) {

    }

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        base.OnModelCreating(modelBuilder);

        //ENTITY QUIZ------------------------------------------------------------------/
        modelBuilder.Entity<Quiz>().HasIndex(q => q.Name).IsUnique();

        modelBuilder.Entity<Quiz>()
            .HasMany(q => q.Questions)
            .WithOne(q => q.Quiz)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Quiz>()
            .HasMany(q => q.Attempts)
            .WithOne(a => a.Quiz)
            .OnDelete(DeleteBehavior.Cascade);


        //ENTITY DATABASE---------------------------------------------------------------/
        modelBuilder.Entity<Database>()
            .HasMany(d => d.Quizzes)
            .WithOne(q => q.Database)
            .OnDelete(DeleteBehavior.Cascade);



        //ENTITY USER-------------------------------------------------------------------/
        modelBuilder.Entity<User>()
            .HasDiscriminator(u => u.Role)
            .HasValue<Student>(Role.Student)
            .HasValue<User>(Role.Admin)
            .HasValue<Teacher>(Role.Teacher);

        modelBuilder.Entity<User>().HasIndex(u => u.Pseudo).IsUnique();


        //ENTITY STUDENT----------------------------------------------------------------/
        modelBuilder.Entity<Student>()
            .HasMany(s => s.Attempts)
            .WithOne(a => a.Student)
            .OnDelete(DeleteBehavior.Cascade);

        //ENTITY ATTEMPT----------------------------------------------------------------/
        modelBuilder.Entity<Attempt>()
            .HasMany(a => a.Answers)
            .WithOne(a => a.Attempt)
            .OnDelete(DeleteBehavior.Cascade);

        //ENTITY QUESTION---------------------------------------------------------------/
        modelBuilder.Entity<Question>()
            .HasMany(q => q.Solutions)
            .WithOne(s => s.Question)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Question>()
            .HasMany(q => q.Answers)
            .WithOne(a => a.Question)
            .OnDelete(DeleteBehavior.Cascade);


        new SeedData(modelBuilder);
    }


}

