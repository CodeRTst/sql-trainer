using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid_2324_g06.Models;

public class Solution 
{
    [Key]
    public int Id { get; set; }
    public int Order { get; set; }
    public string Sql { get; set; } = null!;


    [Required, ForeignKey(nameof(Question))]
    public int QuestionId { get; set; }
    [Required]
    public virtual Question Question { get; set; }
}