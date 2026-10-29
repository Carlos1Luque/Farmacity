namespace Farmacity.Core.Entities;

public class Producto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string PrincipioActivo { get; set; } = string.Empty;
    public bool RequiereReceta { get; set; }
    public decimal Precio { get; set; }
}
