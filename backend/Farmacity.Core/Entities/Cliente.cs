namespace Farmacity.Core.Entities;

public class Cliente
{
    public int Id { get; set; }
    public string DNI { get; set; } = string.Empty;
    public string Nombre { set; get; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
}
