
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using prid_2324_g06.Models;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using prid_2324_g06.Helpers;


namespace prid_2324_g06.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly PridContext _context;
    private readonly IMapper _mapper;


    public UsersController(PridContext context, IMapper mapper) {
        _context = context;
        _mapper = mapper;
    }



    [AllowAnonymous]
    [HttpPost("authenticate")]
    public async Task<ActionResult<UserDTO>> Authenticate(UserWithPasswordDTO dto) {
        var user = await Authenticate(dto.Pseudo, dto.Password);

        var result = await new UserValidator(_context).ValidateForAuthenticate(user);
        if (!result.IsValid)
            return BadRequest(result);

        return Ok(_mapper.Map<UserDTO>(user));
    }



    private async Task<User?> Authenticate(string pseudo, string password) {
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Pseudo == pseudo);

        if (user == null)
            return null;

        if (user.Password == password) {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("my-super-secret-key");
            var tokenDescriptor = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity(new Claim[] {
                    new Claim(ClaimTypes.Name, user.Pseudo),
                    new Claim(ClaimTypes.Role, user.Role.ToString())
                }),
                IssuedAt = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddMinutes(10),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            user.Token = tokenHandler.WriteToken(token);
        }

        return user;
    }





    // GET /api/users
    [Authorized(Role.Teacher, Role.Admin)]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDTO>>> GetAll() {
        return _mapper.Map<List<UserDTO>>(await _context.Users.ToListAsync());
    }


    

}