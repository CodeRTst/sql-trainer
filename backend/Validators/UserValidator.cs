
using FluentValidation;
using prid_tuto.Helpers;

namespace prid_2324_g06.Models;


public class UserValidator : AbstractValidator<User>
{
    private readonly PridContext _context;

    public UserValidator(PridContext context) {
        _context = context;

        RuleFor(u => u.Pseudo)
            .NotEmpty()
            .MinimumLength(3);

        RuleFor(u => u.Password)
            .NotEmpty()
            .MinimumLength(3);

        RuleFor(u => u.Role)
            .IsInEnum();


        RuleSet("authenticate", () => {
            RuleFor(u => u.Token)
                .NotNull().OverridePropertyName("Password").WithMessage("Incorrect password.");
        });
    }



    public async Task<FluentValidation.Results.ValidationResult> ValidateForAuthenticate(User? user) {
        if (user == null)
            return ValidatorHelper.CustomError("User not found.", "Pseudo");
        return await this.ValidateAsync(user!, o => o.IncludeRuleSets("authenticate"));
    }

}