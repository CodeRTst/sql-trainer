
namespace prid_2324_g06.Models.DTO;


public class AnswerDTO
{
    public int Id { get; set; }
    public string Sql { get; set; } = null!;
    public DateTimeOffset Timestamp { get; set; }
    public bool IsCorrect { get; set; }


}


public class AnswerWithAllDTO : AnswerDTO
{
    public int QuestionId { get; set; }
    public int AttemptId { get; set; }
}