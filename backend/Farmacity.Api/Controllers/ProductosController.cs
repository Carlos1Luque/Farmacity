using Farmacity.Core.DTOs;
using Farmacity.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Farmacity.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductosController : ControllerBase
{
    private readonly FarmacityDbContext _context;

    public ProductosController(FarmacityDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductoDto>>> GetAll([FromQuery] int sucursalId = 1, [FromQuery] string? search = null)
    {
        var query = from p in _context.Productos
                    join inv in _context.Inventarios on p.Id equals inv.ProductoId
                    where inv.SucursalId == sucursalId
                    select new { p, inv };

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(x => x.p.Nombre.Contains(search) || x.p.PrincipioActivo.Contains(search));
        }

        var result = await query.ToListAsync();

        var productosDto = result.Select(x => new ProductoDto
        {
            Id = x.p.Id,
            Nombre = x.p.Nombre,
            PrincipioActivo = x.p.PrincipioActivo,
            RequiereReceta = x.p.RequiereReceta,
            Precio = x.p.Precio,
            StockActual = x.inv.StockActual,
            StockMinimo = x.inv.StockMinimo,
            StockBajo = x.inv.StockActual <= x.inv.StockMinimo
        }).ToList();

        return Ok(productosDto);
    }
}
