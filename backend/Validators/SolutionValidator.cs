
using FluentValidation;
using prid_2324_g06.Models;

namespace prid_2324_g06.Validators;


public class SolutionValidator : AbstractValidator<Solution>
{
    
    private readonly PridContext _context;



    public SolutionValidator(PridContext context) {
        _context = context;

        RuleFor(s => s.Sql)
            .NotEmpty()
            .MinimumLength(3);

    }




    public async Task<FluentValidation.Results.ValidationResult> ValidateOnCreate(Solution solution) {
        return await this.ValidateAsync(solution, o => o.IncludeRuleSets("default", "create"));
    }
}