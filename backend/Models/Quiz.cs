using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid_2324_g06.Models;

public class Quiz
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public bool IsPublished { get; set; }
    public bool IsClosed { get; set; }
    public bool IsTest { get; set; }
    public DateTimeOffset? StartDate { get; set; }
    public DateTimeOffset? EndDate { get; set; }



    [Required, ForeignKey(nameof(Database))]
    public int DatabaseId { get; set; }
    [Required]
    public virtual Database Database { get; set; } = null!;



    public virtual ICollection<Question> Questions { get; set; } = new HashSet<Question>();
    public virtual ICollection<Attempt> Attempts { get; set; } = new HashSet<Attempt>();


    public string Status => (EndDate <= DateTimeOffset.Now) ? "CLOTURE" : (IsPublished ? "PUBLIE" : "PAS_PUBLIE");



}