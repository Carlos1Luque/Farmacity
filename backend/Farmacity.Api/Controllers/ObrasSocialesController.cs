using Farmacity.Core.Entities;
using Farmacity.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Farmacity.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ObrasSocialesController : ControllerBase
{
    private readonly FarmacityDbContext _context;

    public ObrasSocialesController(FarmacityDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ObraSocial>>> GetAll()
    {
        return Ok(await _context.ObrasSociales.ToListAsync());
    }

    [HttpPost]
    public async Task<ActionResult<ObraSocial>> Create([FromBody] ObraSocial obraSocial)
    {
        _context.ObrasSociales.Add(obraSocial);
        await _context.SaveChangesAsync();
        return Ok(obraSocial);
    }
}
