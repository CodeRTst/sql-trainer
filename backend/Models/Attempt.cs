
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid_2324_g06.Models;

public class Attempt
{
    [Key]
    public int Id { get; set; }
    public DateTimeOffset? Start { get; set; }
    public DateTimeOffset? Finish { get; set; }



    [Required, ForeignKey(nameof(Quiz))]
    public int QuizId { get; set; }
    [Required]
    public virtual Quiz? Quiz { get; set; }

    [Required, ForeignKey(nameof(Student))]
    public int StudentId { get; set; }
    [Required]
    public virtual Student Student { get; set; } = null!;



    public virtual ICollection<Answer> Answers { get; set; } = new HashSet<Answer>();



    public double Evaluation => Quiz!.IsTest ? ((double)Answers.Where(a => a.IsCorrect).Count() * 10 / Quiz.Questions.Count) : -1;
    public string Status => Quiz?.EndDate != null && Quiz.EndDate <= DateTimeOffset.Now ? "CLOTURE" : (Finish == null ? "EN_COURS" : "FINI");



    public Attempt() {}

    public Attempt(DateTimeOffset start, int quizId, int studentId) {
        Start = start;
        QuizId = quizId;
        StudentId = studentId;
    }



}