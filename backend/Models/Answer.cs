using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid_2324_g06.Models;

public class Answer
{
    [Key]
    public int Id { get; set; }
    public string Sql { get; set; } = null!;
    public DateTimeOffset Timestamp { get; set; }
    public bool IsCorrect { get; set; }



    [Required, ForeignKey(nameof(Question))]
    public int QuestionId { get; set; }
    [Required]
    public virtual Question Question { get; set; } = null!;
    
    [Required, ForeignKey(nameof(Attempt))]
    public int AttemptId { get; set; }
    [Required]
    public virtual Attempt Attempt { get; set; } = null!;


    public Answer() {}


    public Answer(string sql, DateTimeOffset timestamp, bool isCorrect, int questionId, int attemptId) {
        Sql = sql;
        Timestamp = timestamp;
        IsCorrect = isCorrect;
        QuestionId = questionId;
        AttemptId = attemptId;
    }



}