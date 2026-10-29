namespace Farmacity.Core.Entities;

public class TurnoAtencion
{
    public int Id { get; set; }
    public int NumeroTurno { get; set; }
    public string ClienteNombre { get; set; } = string.Empty;
    public string Estado { get; set; } = "En espera"; // En espera, Atendiendo, Atendido
    public DateTime HoraLlegada { get; set; } = DateTime.Now;
}
