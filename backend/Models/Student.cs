


namespace prid_2324_g06.Models;

public class Student : User
{
    public Student() {
        Role = Role.Student;
    }

    public virtual ICollection<Attempt> Attempts { get; set; } = new HashSet<Attempt>(); 
}