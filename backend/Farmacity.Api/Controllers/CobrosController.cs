using Farmacity.Core.DTOs;
using Farmacity.Core.Entities;
using Farmacity.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Farmacity.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CobrosController : ControllerBase
{
    private readonly FarmacityDbContext _context;

    public CobrosController(FarmacityDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult<ComprobanteDto>> RegistrarCobro([FromBody] CobroDto dto)
    {
        var venta = await _context.Ventas
            .Include(v => v.Cliente)
            .Include(v => v.Sucursal)
            .Include(v => v.Detalles)
                .ThenInclude(d => d.Producto)
            .FirstOrDefaultAsync(v => v.Id == dto.VentaId);

        if (venta == null) return NotFound("Venta no encontrada");

        var cobro = new Cobro
        {
            VentaId = dto.VentaId,
            Fecha = DateTime.Now,
            ImporteTotal = dto.ImporteTotal,
            MontoCobrado = dto.MontoCobrado,
            Cambio = dto.Cambio,
            Estado = "Cobrado"
        };

        _context.Cobros.Add(cobro);
        await _context.SaveChangesAsync();

        foreach (var det in dto.DetallesCobro)
        {
            var detalleCobro = new DetalleCobro
            {
                CobroId = cobro.Id,
                MedioPago = det.MedioPago,
                Importe = det.Importe,
                Referencia = det.Referencia
            };
            _context.DetalleCobros.Add(detalleCobro);
        }

        venta.Estado = "Cobrado";
        await _context.SaveChangesAsync();

        var comprobante = new ComprobanteDto
        {
            NroVenta = venta.NroVenta,
            Fecha = cobro.Fecha,
            ClienteNombre = venta.Cliente?.Nombre ?? "",
            SucursalNombre = venta.Sucursal?.Nombre ?? "",
            Total = venta.Total,
            MontoCobrado = cobro.MontoCobrado,
            Cambio = cobro.Cambio,
            MediosPago = dto.DetallesCobro,
            Detalles = venta.Detalles.Select(d => new DetalleVentaDto
            {
                ProductoId = d.ProductoId,
                ProductoNombre = d.Producto?.Nombre,
                Cantidad = d.Cantidad,
                PrecioUnitario = d.PrecioUnitario,
                Subtotal = d.Subtotal
            }).ToList()
        };

        return Ok(comprobante);
    }
}
