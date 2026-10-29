using Farmacity.Core.Enums;

namespace Farmacity.Core.Entities;

public class Usuario
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string NombreCompleto { get; set; } = string.Empty;
    public RolUsuario Rol { get; set; }
    public int SucursalId { get; set; }
    public Sucursal? Sucursal { get; set; }
    public int IntentosFallidos { get; set; }
    public bool Bloqueado { get; set; }
}
