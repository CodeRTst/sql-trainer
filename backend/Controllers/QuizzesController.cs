using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid_2324_g06.Helpers;
using prid_2324_g06.Models;
using prid_2324_g06.Models.DTO;


namespace prid_2324_g06.Controllers;


[Authorize]
[Route("api/[controller]")]
[ApiController]
public class QuizzesController : ControllerBase
{
    private readonly PridContext _context;
    private readonly IMapper _mapper;
    private string CurrentUserPseudo => User.Identity?.Name ?? "";




    public QuizzesController(PridContext context, IMapper mapper) {
        _context = context;
        _mapper = mapper;
    }



    // GET: api/quizzes         
    [Authorized(Role.Teacher, Role.Admin)]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<QuizWithDatabaseDTO>>> GetAll() {
        return _mapper.Map<List<QuizWithDatabaseDTO>>(await _context.Quizzes
                        .Include(q => q.Database)
                        .ToListAsync());
    }




    // GET: api/quizzes/published/test       
    [Authorized(Role.Student)]
    [HttpGet("published/test")]
    public async Task<ActionResult<IEnumerable<QuizWithAttemptDTO>>> GetPublishedTestQuizzes() {
        return await GetPublishedQuizzes(true);
    }



    // GET: api/quizzes/published/training    
    [Authorized(Role.Student)]
    [HttpGet("published/training")]
    public async Task<ActionResult<IEnumerable<QuizWithAttemptDTO>>> GetPublishedTrainingQuizzes() {
        return await GetPublishedQuizzes(false);
    }



    //--> utilisé pour les listes juste au dessus
    [NonAction]
    private async Task<ActionResult<IEnumerable<QuizWithAttemptDTO>>> GetPublishedQuizzes(bool isTest) {
        var quizzes = await _context.Quizzes
                                .Include(q => q.Database)
                                .Include(q => q.Attempts.Where(a => a.Student!.Pseudo == CurrentUserPseudo))
                                .ThenInclude(a => a.Answers)
                                .Include(q => q.Questions)
                                .Where(q => q.IsPublished && q.IsTest == isTest)
                                .ToListAsync();

        return _mapper.Map<List<QuizWithAttemptDTO>>(quizzes);
    }



    // GET: api/quizzes/{id}  
    [Authorized(Role.Teacher)]
    [HttpGet("{quizId}")]
    public async Task<ActionResult<QuizWithQuestionsDTO>> GetQuizById(int quizId) {
        var quiz = await _context.Quizzes
            .Include(q => q.Database)
            .Include(q => q.Questions)
            .ThenInclude(q => q.Solutions)
            .SingleOrDefaultAsync(q => q.Id == quizId);

        if (quiz == null)
            return NotFound();

        return _mapper.Map<QuizWithQuestionsDTO>(quiz);
    }








    // GET: api/quizzes/question/{questionId}  
    [Authorized(Role.Student)]
    [HttpGet("question/{questionId}")]
    public async Task<ActionResult<QuizWithAttemptDTO>> GetQuizByQuestion(int questionId) {
        var res = await _context.Quizzes
                        .Include(q => q.Questions)
                        .Include(q => q.Database)
                        .Include(q => q.Attempts.Where(a => a.Student!.Pseudo == CurrentUserPseudo))
                        .SingleOrDefaultAsync(q => q.Questions.Any(question => question.Id == questionId));

        if (res == null)
            return NotFound();

        return _mapper.Map<QuizWithAttemptDTO>(res);
    }




    // GET: api/quizzes/name/{name} 
    [Authorized(Role.Teacher)]
    [HttpGet("name/{name}")]
    public async Task<ActionResult<QuizDTO>> GetQuizByName(string name) {
        var quiz = await _context.Quizzes.SingleOrDefaultAsync(q => q.Name == name);

        if (quiz == null)
            return NotFound();

        return _mapper.Map<QuizDTO>(quiz);
    }








    // POST: api/quizzes
    [Authorized(Role.Teacher, Role.Admin)]
    [HttpPost]
    public async Task<ActionResult<Quiz>> PostQuiz(QuizWithQuestionsDTO quiz) {
        var newQuiz = _mapper.Map<Quiz>(quiz);

        var result = await new QuizValidator(_context).ValidateOnCreate(newQuiz);
        if (!result.IsValid)
            return BadRequest(result);

       _context.Quizzes.Update(newQuiz);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetQuizById), new { quizId = newQuiz.Id }, _mapper.Map<QuizWithQuestionsDTO>(newQuiz));

    }



    // PUT: api/quizzes
    [Authorized(Role.Teacher, Role.Admin)]
    [HttpPut]
    public async Task<IActionResult> PutQuiz(QuizWithQuestionsDTO dto) {
        var quiz = await _context.Quizzes.Include(q => q.Questions).SingleOrDefaultAsync(q => q.Id == dto.Id);

        if (quiz == null)
            return NotFound();

        // Comparer les questions existantes avec celles du dto
        var questionsToRemove = quiz.Questions
            .Where(q => dto.Questions.All(dtoQ => dtoQ.Id != q.Id));


        // Supprimer les questions qui ne sont plus présentes dans le dto
        _context.Questions.RemoveRange(questionsToRemove);
       

        _mapper.Map<QuizWithQuestionsDTO, Quiz>(dto, quiz);

        var result = await new QuizValidator(_context).ValidateOnUpdate(quiz);
        if (!result.IsValid)
            return BadRequest(result);

       // _context.Update(quiz);
        _context.SaveChanges();

        return CreatedAtAction(nameof(GetQuizById), new { quizId = quiz.Id }, _mapper.Map<QuizWithQuestionsDTO>(quiz));
    }






    // DELETE: api/quizzes/{quizId}
    [Authorized(Role.Teacher, Role.Admin)]
    [HttpDelete("{quizId}")]
    public async Task<IActionResult> DeleteQuiz(int quizId) {
        var quiz = await _context.Quizzes.FindAsync(quizId);

        if (quiz == null)
            return NotFound();

        _context.Quizzes.Remove(quiz);
        await _context.SaveChangesAsync();

        return NoContent();
    }



}