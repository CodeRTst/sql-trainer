using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid_2324_g06.Helpers;
using prid_2324_g06.Models;
using prid_2324_g06.Models.DTO;
using System.Collections;


namespace prid_2324_g06.Controllers;


[Authorize]
[Route("api/[controller]")]
[ApiController]
public class AttemptsController : ControllerBase
{



    private readonly PridContext _context;
    private readonly IMapper _mapper;
    private string CurrentUserPseudo => User.Identity?.Name ?? "";




    public AttemptsController(PridContext context, IMapper mapper) {
        _context = context;
        _mapper = mapper;
    }





    //GET /api/attempts
    [Authorized(Role.Student)]
    [HttpGet("{studentId}")]
    public async Task<ActionResult<IEnumerable<AttemptDTO>>> GetAttemptsByStudent(int studentId) {
        var attempts = await _context.Attempts.Where(a => a.StudentId == studentId).ToListAsync();

        if (attempts == null || !attempts.Any())
            return NotFound();

        return _mapper.Map<List<AttemptDTO>>(attempts);
    }





    [HttpPost()]
    public async Task<ActionResult<AttemptWithStatusDTO>> PostAttempt(AttemptWithQuizDTO dto) {
        var student = await _context.Students.SingleOrDefaultAsync(u => u.Pseudo == CurrentUserPseudo);

        if (student == null)
            return NotFound("student not found");

        var attempt = _mapper.Map<Attempt>(dto);
        attempt.Student = student;
        _context.Add(attempt);
        _context.SaveChanges();

        return Ok(_mapper.Map<AttemptWithStatusDTO>(attempt));
    }




    [HttpPost("finish")]
    public async Task<ActionResult<AttemptDTO>> FinishAttempt(AttemptWithQuizDTO dto) {

        if (dto.Id == 0)
            return NotFound("attempt doesn't existe. Must be different of 0");

        var attempt = _context.Attempts.Find(dto.Id);
        attempt!.Finish = dto.Finish;

        var questions = await _context.Questions
                    .Include(q => q.Answers.Where(a => a.AttemptId == dto.Id))
                    .Where(q => q.QuizId == dto.QuizId).ToListAsync();

        if (questions == null)
            return NotFound("there is no questions");

        questions.ForEach(q => {
            if (q.Answers.Count == 0) {
                var Answer = new Answer("", dto.Finish!.Value, false, q.Id, dto.Id);
                q.Answers.Add(Answer);
            }           
        });

        
        _context.SaveChanges();

        return Ok();
    }



}