
using FluentValidation;
using Google.Protobuf.WellKnownTypes;
using Microsoft.EntityFrameworkCore;

namespace prid_2324_g06.Models;


public class QuizValidator : AbstractValidator<Quiz>
{
    private readonly PridContext _context;


    public QuizValidator(PridContext context) {
        _context = context;


        RuleFor(q => q.Name)
            .NotEmpty()
            .MinimumLength(3);


        RuleSet("create", () => {
            RuleFor(q => q.Name)
                .MustAsync(BeUniqueName)
                .WithMessage("'{PropertyName}' doit être unique.");
        });


        RuleFor(q => q.StartDate)
            .GreaterThanOrEqualTo(DateTime.Today).When(q => q.IsTest);

        RuleFor(q => q.EndDate)
            .GreaterThanOrEqualTo(q => q.StartDate).When(q => q.IsTest);



        RuleFor(q => q.Description)
            .MinimumLength(3).When(q => q.Description?.Length > 0);

        RuleFor(q => q.Questions)
           .Must(questions => questions != null && questions.Any())
           .WithMessage("'{PropertyName}' doit contenir au moins 1 élément.");


        RuleForEach(q => q.Questions)
            .SetValidator(new QuestionValidator(_context));
    }




    public async Task<FluentValidation.Results.ValidationResult> ValidateOnCreate(Quiz quiz) {
        return await this.ValidateAsync(quiz, o => o.IncludeRuleSets("default", "create"));
    }


    public async Task<FluentValidation.Results.ValidationResult> ValidateOnUpdate(Quiz quiz) {
        return await this.ValidateAsync(quiz, o => o.IncludeRuleSets("default"));
    }


    private async Task<bool> BeUniqueName(string name, CancellationToken token) {
        return await _context.Quizzes.AllAsync(other => name != other.Name, token);

    }



}