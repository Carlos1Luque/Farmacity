using Farmacity.Core.Entities;
using Farmacity.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Farmacity.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TurnosController : ControllerBase
{
    private readonly FarmacityDbContext _context;

    public TurnosController(FarmacityDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TurnoAtencion>>> GetAll()
    {
        return Ok(await _context.TurnosAtencion.OrderBy(t => t.NumeroTurno).ToListAsync());
    }
}
