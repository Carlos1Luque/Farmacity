namespace Farmacity.Core.Entities;

public class Inventario
{
    public int Id { get; set; }
    public int ProductoId { get; set; }
    public Producto? Producto { get; set; }
    public int SucursalId { get; set; }
    public Sucursal? Sucursal { get; set; }
    public int StockActual { get; set; }
    public int StockMinimo { get; set; }
}
