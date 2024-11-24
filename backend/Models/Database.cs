using System.ComponentModel.DataAnnotations;

namespace prid_2324_g06.Models;

public class Database 
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }


    public virtual ICollection<Quiz> Quizzes { get; set; } = new HashSet<Quiz>();


    public Database() {}

}