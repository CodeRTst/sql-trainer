
using AutoMapper;
using prid_2324_g06.DTO;
using prid_2324_g06.Models.DTO;
using System.Linq;

namespace prid_2324_g06.Models;

public class MappingProfile : Profile
{
    private PridContext _context;


    public MappingProfile(PridContext context) {
        _context = context;


        //---------USER---------------------------------//
        CreateMap<User, UserDTO>();
        CreateMap<UserDTO, User>();

        CreateMap<User, UserWithPasswordDTO>();
        CreateMap<UserWithPasswordDTO, User>();


        //----------QUIZ--------------------------------//
        CreateMap<QuizDTO, Quiz>();
        CreateMap<Quiz, QuizDTO>();

        CreateMap<Quiz, QuizWithQuestionsDTO>();
        CreateMap<QuizWithQuestionsDTO, Quiz>();

        CreateMap<Quiz, QuizWithDatabaseDTO>();
        CreateMap<QuizWithDatabaseDTO, Quiz>();

        CreateMap<QuizWithAttemptDTO, Quiz>();
        CreateMap<Quiz, QuizWithAttemptDTO>()
                .ForMember(dest => dest.Attempt, opt => opt.MapFrom(src => src.Attempts.OrderBy(a => a.Id).LastOrDefault()))
                .AfterMap((src, dest) => {
                    dest.NbQuestions = src.Questions.Count;
                    if (dest.Attempt == null) {
                        dest.Attempt = new AttemptWithAllDTO();
                        if (src.EndDate <= DateTimeOffset.Now)
                            dest.Attempt.Status = "CLOTURE";
                    }
                });



        //---------DATABASE-----------------------------//
        CreateMap<Database, DatabaseDTO>();
        CreateMap<DatabaseDTO, Database>();


        //---------ATTEMPT------------------------------//
        CreateMap<Attempt, AttemptDTO>();
        CreateMap<AttemptDTO, Attempt>();

        CreateMap<Attempt, AttemptWithStatusDTO>();

        CreateMap<AttemptWithAllDTO, Attempt>();
        CreateMap<Attempt, AttemptWithAllDTO>();

        CreateMap<Attempt, AttemptWithQuizDTO>();
        CreateMap<AttemptWithQuizDTO, Attempt>();


        //---------QUESTION-----------------------------//
        CreateMap<Question, QuestionWithSolutionsDTO>();
        CreateMap<QuestionWithSolutionsDTO, Question>();

        CreateMap<QuestionWithAnswerDTO, Question>();
        CreateMap<Question, QuestionWithAnswerDTO>()
                .ForMember(dest => dest.Answer, opt => opt.MapFrom(src => src.Answers.OrderBy(a => a.Id).LastOrDefault()));


        //---------ANSWER-------------------------------//
        CreateMap<Answer, AnswerDTO>();
        CreateMap<AnswerDTO, Answer>();

        CreateMap<AnswerWithAllDTO, Answer>();

        
        //---------SOLUTION-----------------------------//
        CreateMap<Solution, SolutionDTO>();
        CreateMap<SolutionDTO, Solution>();


        //---------QUERY--------------------------//
        CreateMap<Query, QueryDTO>();
        CreateMap<QueryDTO, Query>();
    }
}