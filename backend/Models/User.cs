
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid_2324_g06.Models;

public enum Role {
    Admin = 1,
    Teacher = 2,
    Student = 3
}


public class User 
{
    [Key]
    public int Id { get; set; }
    public string Pseudo { get; set; } = null!;
    public string? Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string? FirstName {get; set; }
    public string? LastName { get; set; }
    public DateTimeOffset? BirthDate { get; set; }
    public Role Role { get; protected set; } = Role.Admin;
    [NotMapped]
    public string? Token { get; set; }
}