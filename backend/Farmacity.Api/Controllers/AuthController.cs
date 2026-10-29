using Farmacity.Core.DTOs;
using Farmacity.Core.Entities;
using Farmacity.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Farmacity.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly FarmacityDbContext _context;

    public AuthController(FarmacityDbContext context)
    {
        _context = context;
    }

    [HttpGet("sucursales")]
    public async Task<ActionResult<IEnumerable<Sucursal>>> GetSucursales()
    {
        var sucursales = await _context.Sucursales.ToListAsync();
        return Ok(sucursales);
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginRequestDto request)
    {
        var usuario = await _context.Usuarios
            .Include(u => u.Sucursal)
            .FirstOrDefaultAsync(u => u.Username == request.Username && u.SucursalId == request.SucursalId);

        if (usuario == null)
        {
            return Ok(new LoginResponseDto { Exitoso = false, Mensaje = "Usuario o contraseña incorrectos" });
        }

        if (usuario.Bloqueado)
        {
            return Ok(new LoginResponseDto { Exitoso = false, Mensaje = "Usuario bloqueado por intentos fallidos" });
        }

        if (usuario.Password != request.Password)
        {
            usuario.IntentosFallidos++;
            if (usuario.IntentosFallidos >= 3)
            {
                usuario.Bloqueado = true;
            }
            await _context.SaveChangesAsync();
            var intentosRestantes = 3 - usuario.IntentosFallidos;
            if (usuario.Bloqueado)
                return Ok(new LoginResponseDto { Exitoso = false, Mensaje = "Usuario bloqueado tras 3 intentos fallidos" });
            return Ok(new LoginResponseDto { Exitoso = false, Mensaje = $"Contraseña incorrecta. Intentos restantes: {intentosRestantes}" });
        }

        usuario.IntentosFallidos = 0;
        await _context.SaveChangesAsync();

        return Ok(new LoginResponseDto
        {
            Exitoso = true,
            Mensaje = "Login exitoso",
            UsuarioId = usuario.Id,
            NombreCompleto = usuario.NombreCompleto,
            Rol = usuario.Rol.ToString(),
            SucursalId = usuario.SucursalId,
            SucursalNombre = usuario.Sucursal?.Nombre
        });
    }
}
