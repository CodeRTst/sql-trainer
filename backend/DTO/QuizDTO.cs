
namespace prid_2324_g06.Models.DTO;

public class QuizDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string? Description { get; set; }
    public bool IsPublished { get; set; }
    public bool IsClosed { get; set; }
    public bool IsTest { get; set; }
    public DateTimeOffset? StartDate { get; set; }
    public DateTimeOffset? EndDate { get; set; }
    public int NbQuestions { get; set; } = -1;
    public string? Status { get; set; }
}



public class QuizWithDatabaseDTO : QuizDTO 
{
    public DatabaseDTO Database { get; set; } = null!;
}


public class QuizWithAttemptDTO : QuizWithDatabaseDTO 
{
    public AttemptWithAllDTO Attempt { get; set; } = null!;
}


public class QuizWithQuestionsDTO : QuizWithDatabaseDTO 
{
    public ICollection<QuestionWithSolutionsDTO> Questions { get; set; } = new HashSet<QuestionWithSolutionsDTO>();
}




