
namespace prid_2324_g06.Models.DTO;

public class QuestionDTO 
{
    public int Id { get; set; }
    public int Order { get; set; }
    public string Body { get; set; } = "";
}



public class QuestionWithAnswerDTO : QuestionDTO
{
    public AnswerDTO Answer { get; set; } = null!;
}



public class QuestionWithSolutionsDTO : QuestionDTO
{
    public ICollection<SolutionDTO> Solutions { get; set; } = new HashSet<SolutionDTO>();

}