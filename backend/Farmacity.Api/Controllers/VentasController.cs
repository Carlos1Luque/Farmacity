using Farmacity.Core.DTOs;
using Farmacity.Core.Entities;
using Farmacity.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Farmacity.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VentasController : ControllerBase
{
    private readonly FarmacityDbContext _context;

    public VentasController(FarmacityDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<VentaDto>>> GetAll([FromQuery] string? nroVenta, [FromQuery] string? cliente, [FromQuery] DateTime? fecha)
    {
        var query = _context.Ventas
            .Include(v => v.Cliente)
            .Include(v => v.ObraSocial)
            .AsQueryable();

        if (!string.IsNullOrEmpty(nroVenta))
            query = query.Where(v => v.NroVenta.Contains(nroVenta));
        if (!string.IsNullOrEmpty(cliente))
            query = query.Where(v => v.Cliente!.Nombre.Contains(cliente));
        if (fecha.HasValue)
            query = query.Where(v => v.Fecha.Date == fecha.Value.Date);

        var ventas = await query.OrderByDescending(v => v.Fecha).ToListAsync();

        var result = ventas.Select(v => new VentaDto
        {
            Id = v.Id,
            NroVenta = v.NroVenta,
            Fecha = v.Fecha,
            ClienteNombre = v.Cliente?.Nombre ?? "",
            ObraSocialNombre = v.ObraSocial?.Nombre,
            Estado = v.Estado,
            Total = v.Total,
            ConReceta = v.ConReceta
        }).ToList();

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Venta>> GetById(int id)
    {
        var venta = await _context.Ventas
            .Include(v => v.Cliente)
            .Include(v => v.ObraSocial)
            .Include(v => v.Detalles)
                .ThenInclude(d => d.Producto)
            .Include(v => v.Cobro)
                .ThenInclude(c => c!.DetallesCobro)
            .FirstOrDefaultAsync(v => v.Id == id);

        if (venta == null) return NotFound();
        return Ok(venta);
    }

    [HttpPost]
    public async Task<ActionResult<Venta>> Create([FromBody] CrearVentaDto dto)
    {
        var venta = new Venta
        {
            NroVenta = $"V-{DateTime.Now:yyyyMMdd}-{new Random().Next(1000, 9999)}",
            Fecha = DateTime.Now,
            ClienteId = dto.ClienteId,
            ObraSocialId = dto.ObraSocialId,
            UsuarioId = dto.UsuarioId,
            SucursalId = dto.SucursalId,
            ConReceta = dto.ConReceta,
            NroReceta = dto.NroReceta,
            Subtotal = dto.Subtotal,
            Descuento = dto.Descuento,
            Total = dto.Total,
            Estado = "Pendiente"
        };

        _context.Ventas.Add(venta);
        await _context.SaveChangesAsync();

        foreach (var det in dto.Detalles)
        {
            var detalle = new DetalleVenta
            {
                VentaId = venta.Id,
                ProductoId = det.ProductoId,
                Cantidad = det.Cantidad,
                PrecioUnitario = det.PrecioUnitario,
                Subtotal = det.Subtotal
            };
            _context.DetalleVentas.Add(detalle);

            // Descontar stock
            var inventario = await _context.Inventarios
                .FirstOrDefaultAsync(i => i.ProductoId == det.ProductoId && i.SucursalId == dto.SucursalId);
            if (inventario != null)
            {
                inventario.StockActual -= det.Cantidad;
            }
        }

        await _context.SaveChangesAsync();
        return Ok(venta);
    }
}
