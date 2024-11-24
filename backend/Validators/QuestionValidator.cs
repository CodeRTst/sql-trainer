

using FluentValidation;
using prid_2324_g06.Validators;

namespace prid_2324_g06.Models;


public class QuestionValidator : AbstractValidator<Question>
{


    private readonly PridContext _context;



    public QuestionValidator(PridContext context) {
        _context = context;

        RuleFor(q => q.Body)
            .NotEmpty()
            .MinimumLength(3);

        RuleFor(q => q.Solutions)
           .Must(solutions => solutions != null && solutions.Any())
           .WithMessage("'{PropertyName}' doit contenir au moins 1 élément.");



        RuleForEach(q => q.Solutions)
            .SetValidator(new SolutionValidator(_context));

    }




    public async Task<FluentValidation.Results.ValidationResult> ValidateOnCreate(Question question) {
        return await this.ValidateAsync(question, o => o.IncludeRuleSets("default", "create"));
    }

}