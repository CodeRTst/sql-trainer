

namespace prid_2324_g06.DTO;

public class QueryDTO
{
    public List<string> Errors { get; set; } = new List<string>();
    public string[][]? QueryAnswer { get; set; } = null!;

}