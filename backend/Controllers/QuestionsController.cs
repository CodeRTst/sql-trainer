
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid_2324_g06.Helpers;
using prid_2324_g06.Models;
using prid_2324_g06.Models.DTO;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using prid_2324_g06.DTO;
using MySqlConnector;
using System.Data;


namespace prid_2324_g06.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class QuestionsController : ControllerBase
{
    private readonly PridContext _context;
    private readonly IMapper _mapper;
    private string CurrentUserPseudo => User.Identity?.Name ?? "";



    public QuestionsController(PridContext context, IMapper mapper) {
        _context = context;
        _mapper = mapper;
    }






    // GET: api/Questions/question/{questionId}/{attemptId}     
    [Authorized(Role.Student)]
    [HttpGet("question/{questionId}/{attemptId}")]
    public async Task<ActionResult<QuestionWithAnswerDTO>> GetQuestionWithAnswerById(int questionId, int attemptId) {
        var question = await _context.Questions
                                .Include(q => q.Answers.Where(a => a.Attempt.Student.Pseudo == CurrentUserPseudo && a.AttemptId == attemptId))
                                .FirstOrDefaultAsync(q => q.Id == questionId);

        if (question == null)
            return NotFound();

        return _mapper.Map<QuestionWithAnswerDTO>(question);
    }



    // GET: api/Questions/firstQuestion/{quizId}     
    [Authorized(Role.Student)]
    [HttpGet("firstQuestion/{quizId}")]
    public async Task<ActionResult<int>> GetFirstQuestionByQuiz(int quizId) {
        var quiz = await _context.Quizzes.Include(q => q.Questions).SingleOrDefaultAsync(q => q.Id == quizId);

        if (quiz == null)
            return NotFound("quiz doesn't exist");

        var question = quiz.Questions.FirstOrDefault();

        if (question == null)
            return NotFound("question doesn't exist");

        return question.Id;
    }




    // GET: api/Questions/solutions/{questionId}        
    [Authorized(Role.Student)]
    [HttpGet("solutions/{questionId}")]
    public async Task<ActionResult<List<SolutionDTO>>> GetSolutionsByQuestion(int questionId) {
        var solutions = await _context.Solutions.Where(s => s.QuestionId == questionId).ToListAsync();

        if (solutions == null)
            return NotFound();

        return _mapper.Map<List<SolutionDTO>>(solutions);
    }



    [Authorized(Role.Student)]
    [HttpPost("answer")]    
    public async Task<ActionResult<QueryDTO>> PostAnswer(AnswerWithAllDTO dto) {
        var student = await _context.Users.SingleOrDefaultAsync(u => u.Pseudo == CurrentUserPseudo);

        if (student == null)
            return NotFound("student not found");

        var answer = _mapper.Map<Answer>(dto);
        _context.Add(answer);
        _context.SaveChanges();

        return Ok(_mapper.Map<AnswerDTO>(answer));
    }



    [Authorized(Role.Student)]
    [HttpPost("query")]    
    public async Task<ActionResult<QueryDTO>> PostQuery(SqlRequestDTO dto) {

        var question = await _context.Questions
                                .Include(q => q.Solutions)
                                .Include(q => q.Quiz)
                                .ThenInclude(q => q.Database)
                                .SingleOrDefaultAsync(q => q.Id == dto.QuestionId);

        if (question == null)
            return NotFound();

        if (dto.CodeSql == null || dto.CodeSql == "")
            return _mapper.Map<QueryDTO>(question.ResultEmpty());

        var database = question.Quiz.Database.Name;
        var solution = question.Solutions.First();

        using MySqlConnection connection = new($"server=localhost;database={database};uid=root;password=");
        DataTable table1;
        DataTable table2;


        try {
            connection.Open();
            MySqlCommand command = new MySqlCommand("SET sql_mode = 'STRICT_ALL_TABLES'; " + dto.CodeSql, connection);
            MySqlDataAdapter adapter = new(command);
            table1 = new DataTable();
            adapter.Fill(table1);

            MySqlCommand command2 = new("SET sql_mode = 'STRICT_ALL_TABLES'; " + solution.Sql, connection);
            MySqlDataAdapter adapter2 = new(command2);
            table2 = new DataTable();
            adapter2.Fill(table2);

            
            var res = question.GetEvaluation(table1, table2);
            return _mapper.Map<QueryDTO>(res);

        } catch (Exception e) {
            string error = e.Message;
            var query = new QueryDTO();
            query.Errors.Add(error);
            return query;
        }


    }


    //-/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

   


    // PUT: api/QuestionsSolutions/question
    [Authorized(Role.Teacher, Role.Admin)]
    [HttpPut("question")]
    public async Task<IActionResult> PutQuestion(Question question) {
        var exists = _context.Questions.Any(q => q.Id == question.Id);

        if (!exists)
            return NotFound();

        _context.Entry(question).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }


    // DELETE: api/QuestionsSolutions/question/{questionId}
    [Authorized(Role.Teacher, Role.Admin)]
    [HttpDelete("question/{questionId}")]
    public async Task<IActionResult> DeleteQuestion(int questionId) {
        var question = await _context.Questions.FindAsync(questionId);

        if (question == null)
            return NotFound();

        _context.Questions.Remove(question);
        await _context.SaveChangesAsync();

        return NoContent();
    }



}