namespace Farmacity.Core.Entities;

public class Venta
{
    public int Id { get; set; }
    public string NroVenta { get; set; } = string.Empty;
    public DateTime Fecha { get; set; } = DateTime.Now;
    public int ClienteId { get; set; }
    public Cliente? Cliente { get; set; }
    public int? ObraSocialId { get; set; }
    public ObraSocial? ObraSocial { get; set; }
    public int UsuarioId { get; set; }
    public Usuario? Usuario { get; set; }
    public int SucursalId { get; set; }
    public Sucursal? Sucursal { get; set; }
    public bool ConReceta { get; set; } = true;
    public decimal Subtotal { get; set; }
    public decimal Descuento { get; set; }
    public decimal Total { get; set; }
    public string Estado { get; set; } = "Pendiente"; // Pendiente, Cobrado, Entregado, Anulado
    public string? NroReceta { get; set; }
    public List<DetalleVenta> Detalles { get; set; } = new();
    public Cobro? Cobro { get; set; }
}
