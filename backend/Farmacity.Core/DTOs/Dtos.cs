using Farmacity.Core.Enums;

namespace Farmacity.Core.DTOs;

public class LoginRequestDto
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public int SucursalId { get; set; }
}

public class LoginResponseDto
{
    public bool Exitoso { get; set; }
    public string? Mensaje { get; set; }
    public int? UsuarioId { get; set; }
    public string? NombreCompleto { get; set; }
    public string? Rol { get; set; }
    public int? SucursalId { get; set; }
    public string? SucursalNombre { get; set; }
}

public class ClienteDto
{
    public int Id { get; set; }
    public string DNI { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
}

public class ObraSocialDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public decimal PorcentajeCobertura { get; set; }
}

public class ProductoDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string PrincipioActivo { get; set; } = string.Empty;
    public bool RequiereReceta { get; set; }
    public decimal Precio { get; set; }
    public int StockActual { get; set; }
    public int StockMinimo { get; set; }
    public bool StockBajo { get; set; }
}

public class DetalleVentaDto
{
    public int ProductoId { get; set; }
    public string? ProductoNombre { get; set; }
    public int Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
    public decimal Subtotal { get; set; }
}

public class CrearVentaDto
{
    public int ClienteId { get; set; }
    public int? ObraSocialId { get; set; }
    public int UsuarioId { get; set; }
    public int SucursalId { get; set; }
    public bool ConReceta { get; set; } = true;
    public string? NroReceta { get; set; }
    public decimal Subtotal { get; set; }
    public decimal Descuento { get; set; }
    public decimal Total { get; set; }
    public List<DetalleVentaDto> Detalles { get; set; } = new();
}

public class VentaDto
{
    public int Id { get; set; }
    public string NroVenta { get; set; } = string.Empty;
    public DateTime Fecha { get; set; }
    public string ClienteNombre { get; set; } = string.Empty;
    public string? ObraSocialNombre { get; set; }
    public string Estado { get; set; } = string.Empty;
    public decimal Total { get; set; }
    public bool ConReceta { get; set; }
}

public class DetalleCobroDto
{
    public TipoMedioPago MedioPago { get; set; }
    public decimal Importe { get; set; }
    public string? Referencia { get; set; }
}

public class CobroDto
{
    public int VentaId { get; set; }
    public decimal ImporteTotal { get; set; }
    public decimal MontoCobrado { get; set; }
    public decimal Cambio { get; set; }
    public List<DetalleCobroDto> DetallesCobro { get; set; } = new();
}

public class ComprobanteDto
{
    public string NroVenta { get; set; } = string.Empty;
    public DateTime Fecha { get; set; }
    public string ClienteNombre { get; set; } = string.Empty;
    public string SucursalNombre { get; set; } = string.Empty;
    public decimal Total { get; set; }
    public decimal MontoCobrado { get; set; }
    public decimal Cambio { get; set; }
    public List<DetalleCobroDto> MediosPago { get; set; } = new();
    public List<DetalleVentaDto> Detalles { get; set; } = new();
}
