

using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid_2324_g06.Models;
using prid_2324_g06.Models.DTO;

namespace prid_2324_g06.Controllers;


[Route("api/[controller]")]
[ApiController]
public class DatabasesController : ControllerBase
{

    private readonly PridContext _context;
    private readonly IMapper _mapper;


    public DatabasesController(PridContext context, IMapper mapper) {
        _context = context;
        _mapper = mapper;
    }



    // GET: api/database
    [HttpGet]
    public async Task<ActionResult<IEnumerable<DatabaseDTO>>> GetAll() {
        return _mapper.Map<List<DatabaseDTO>>(await _context.Databases.ToListAsync());
    }
}