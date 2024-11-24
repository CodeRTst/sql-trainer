
namespace prid_2324_g06.Models.DTO;

public class AttemptDTO
{
    public int Id { get ; set; }
    public DateTimeOffset? Start { get; set; }
    public DateTimeOffset? Finish { get; set; } 
}


public class AttemptWithQuizDTO : AttemptDTO
{
    public int QuizId { get; set; }
}



public class AttemptWithStatusDTO : AttemptDTO
{
    public string Status { get; set; } = "PAS_COMMENCE";
}



public class AttemptWithAllDTO : AttemptWithStatusDTO { 
    public double Evaluation { get; set; } = -1;

}

