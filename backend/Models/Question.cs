
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;

namespace prid_2324_g06.Models;

public class Question
{
    [Key]
    public int Id { get; set; } 
    public int Order { get; set; }
    public string Body { get; set; } = null!;


    [Required, ForeignKey(nameof(Quiz))]
    public int QuizId { get; set; }
    [Required]
    public virtual Quiz Quiz { get; set; }



    public virtual ICollection<Solution> Solutions { get; set; } = new HashSet<Solution>();
    public virtual ICollection<Answer> Answers { get; set; } = new HashSet<Answer>();


    public Query GetEvaluation(DataTable answer, DataTable solution) {
        Query query = new(answer, solution);
        query.Evaluate();
        return query;
    }


    public Query ResultEmpty() {
        return new Query();
    }
}