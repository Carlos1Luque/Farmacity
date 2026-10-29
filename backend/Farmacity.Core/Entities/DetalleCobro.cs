using Farmacity.Core.Enums;

namespace Farmacity.Core.Entities;

public class DetalleCobro
{
    public int Id { get; set; }
    public int CobroId { get; set; }
    public Cobro? Cobro { get; set; }
    public TipoMedioPago MedioPago { get; set; }
    public decimal Importe { get; set; }
    public string? Referencia { get; set; }
}
