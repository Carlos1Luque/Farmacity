using Farmacity.Core.Entities;
using Farmacity.Core.Enums;
using Microsoft.EntityFrameworkCore;

namespace Farmacity.Infrastructure.Data;

public static class DbInitializer
{
    public static void Initialize(FarmacityDbContext context)
    {
        if (context.Sucursales.Any()) return;

        // Sucursales
        context.Sucursales.AddRange(
            new Sucursal { Id = 1, Nombre = "Av. Sabattini 2200", Direccion = "Av. Sabattini 2200" }
        );

        // Usuarios
        context.Usuarios.AddRange(
            new Usuario { Id = 1, Username = "venta1", Password = "123456", NombreCompleto = "María González (Encargado de Venta)", Rol = RolUsuario.EncargadoDeVenta, SucursalId = 1 },
            new Usuario { Id = 2, Username = "caja1", Password = "123456", NombreCompleto = "Juan Pérez (Encargado de Caja)", Rol = RolUsuario.EncargadoDeCaja, SucursalId = 1 },
            new Usuario { Id = 3, Username = "deposito1", Password = "123456", NombreCompleto = "Carlos López (Encargado de Depósito)", Rol = RolUsuario.EncargadoDeDeposito, SucursalId = 1 },
            new Usuario { Id = 4, Username = "admin", Password = "admin", NombreCompleto = "Administrador", Rol = RolUsuario.Administrador, SucursalId = 1 }
        );

        // Clientes
        context.Clientes.AddRange(
            new Cliente { Id = 1, DNI = "30123456", Nombre = "Ana Rodríguez", Telefono = "11-4567-8901" },
            new Cliente { Id = 2, DNI = "28987654", Nombre = "Pedro Martínez", Telefono = "11-2345-6789" },
            new Cliente { Id = 3, DNI = "33456789", Nombre = "Laura Fernández", Telefono = "11-3456-7890" }
        );

        // Obras Sociales
        context.ObrasSociales.AddRange(
            new ObraSocial { Id = 1, Nombre = "OSDE", PorcentajeCobertura = 60 },
            new ObraSocial { Id = 2, Nombre = "Swiss Medical", PorcentajeCobertura = 70 },
            new ObraSocial { Id = 3, Nombre = "PAMI", PorcentajeCobertura = 90 },
            new ObraSocial { Id = 4, Nombre = "Sin Obra Social", PorcentajeCobertura = 0 }
        );

        // Productos
        context.Productos.AddRange(
            new Producto { Id = 1, Nombre = "Amoxicilina 500mg x 16 comprimidos", PrincipioActivo = "Amoxicilina", RequiereReceta = true, Precio = 2500.00m },
            new Producto { Id = 2, Nombre = "Losartán 50mg x 30 comprimidos", PrincipioActivo = "Losartán potásico", RequiereReceta = true, Precio = 1800.00m },
            new Producto { Id = 3, Nombre = "Atorvastatina 20mg x 30 comprimidos", PrincipioActivo = "Atorvastatina", RequiereReceta = true, Precio = 3200.00m },
            new Producto { Id = 4, Nombre = "Ibuprofeno 600mg x 20 comprimidos", PrincipioActivo = "Ibuprofeno", RequiereReceta = false, Precio = 850.00m },
            new Producto { Id = 5, Nombre = "Paracetamol 500mg x 20 comprimidos", PrincipioActivo = "Paracetamol", RequiereReceta = false, Precio = 650.00m },
            new Producto { Id = 6, Nombre = "Omeprazol 20mg x 14 cápsulas", PrincipioActivo = "Omeprazol", RequiereReceta = false, Precio = 950.00m }
        );

        // Inventario por sucursal
        context.Inventarios.AddRange(
            // Sucursal 1
            new Inventario { Id = 1, ProductoId = 1, SucursalId = 1, StockActual = 25, StockMinimo = 10 },
            new Inventario { Id = 2, ProductoId = 2, SucursalId = 1, StockActual = 8, StockMinimo = 15 }, // Stock bajo
            new Inventario { Id = 3, ProductoId = 3, SucursalId = 1, StockActual = 30, StockMinimo = 10 },
            new Inventario { Id = 4, ProductoId = 4, SucursalId = 1, StockActual = 150, StockMinimo = 30 },
            new Inventario { Id = 5, ProductoId = 5, SucursalId = 1, StockActual = 5, StockMinimo = 25 }, // Stock bajo
            new Inventario { Id = 6, ProductoId = 6, SucursalId = 1, StockActual = 80, StockMinimo = 20 }
        );

        // Turnos
        context.TurnosAtencion.AddRange(
            new TurnoAtencion { Id = 1, NumeroTurno = 45, ClienteNombre = "Carlos Gómez", Estado = "En espera", HoraLlegada = DateTime.Now.AddMinutes(-10) },
            new TurnoAtencion { Id = 2, NumeroTurno = 46, ClienteNombre = "María Torres", Estado = "En espera", HoraLlegada = DateTime.Now.AddMinutes(-5) },
            new TurnoAtencion { Id = 3, NumeroTurno = 47, ClienteNombre = "Roberto Silva", Estado = "Atendiendo", HoraLlegada = DateTime.Now.AddMinutes(-15) }
        );

        context.SaveChanges();
    }
}
