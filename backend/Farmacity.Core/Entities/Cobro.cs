using Farmacity.Core.Enums;

namespace Farmacity.Core.Entities;

public class Cobro
{
    public int Id { get; set; }
    public int VentaId { get; set; }
    public Venta? Venta { get; set; }
    public DateTime Fecha { get; set; } = DateTime.Now;
    public decimal ImporteTotal { get; set; }
    public decimal MontoCobrado { get; set; }
    public decimal Cambio { get; set; }
    public string Estado { get; set; } = "Cobrado";
    public List<DetalleCobro> DetallesCobro { get; set; } = new();
}
