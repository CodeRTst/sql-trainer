using Microsoft.AspNetCore.Authorization;
using prid_2324_g06.Models;

namespace prid_2324_g06.Helpers;

public class AuthorizedAttribute : AuthorizeAttribute
{
    public AuthorizedAttribute(params Role[] roles) : base() {
        var rolesNames = new List<string>();
        var names = Enum.GetNames(typeof(Role));
        foreach (var role in roles) {
            rolesNames.Add(names[(int)role-1]);
        }
        Roles = String.Join(",", rolesNames);
    }
}
