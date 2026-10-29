using Farmacity.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Farmacity.Infrastructure.Data;

public class FarmacityDbContext : DbContext
{
    public FarmacityDbContext(DbContextOptions<FarmacityDbContext> options) : base(options)
    {
    }

    public DbSet<Sucursal> Sucursales => Set<Sucursal>();
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Cliente> Clientes => Set<Cliente>();
    public DbSet<ObraSocial> ObrasSociales => Set<ObraSocial>();
    public DbSet<Producto> Productos => Set<Producto>();
    public DbSet<Inventario> Inventarios => Set<Inventario>();
    public DbSet<Venta> Ventas => Set<Venta>();
    public DbSet<DetalleVenta> DetalleVentas => Set<DetalleVenta>();
    public DbSet<Cobro> Cobros => Set<Cobro>();
    public DbSet<DetalleCobro> DetalleCobros => Set<DetalleCobro>();
    public DbSet<TurnoAtencion> TurnosAtencion => Set<TurnoAtencion>();
}
