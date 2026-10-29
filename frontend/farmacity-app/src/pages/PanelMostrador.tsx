import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Users, Package, ClipboardList, Clock, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import api from '@/lib/api';

export default function PanelMostrador() {
  const navigate = useNavigate();
  const [turnos, setTurnos] = useState<any[]>([]);
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    api.get('/turnos').then(res => setTurnos(res.data));
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      <AppHeader />
      <main className="max-w-[1440px] mx-auto px-6 py-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold">Panel del mostrador</h1>
            <p className="text-sm text-[#5B6B7C]">Atención al cliente · Registro de venta de medicamentos bajo receta</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#5B6B7C] border border-[#E5E9F0] bg-white px-2 py-1">
            {online ? (
              <>
                <Wifi className="w-4 h-4 text-[#1E9E7A]" />
                <span>Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-[#C0392B]" />
                <span>Sin conexión</span>
              </>
            )}
            {!online && (
              <span className="flex items-center gap-1 text-[#E0A100]">
                <RefreshCw className="w-3 h-3" />
                Sincronizando
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white border border-[#E5E9F0] shadow-sm">
              <div className="px-5 py-4 border-b border-[#EEF1F6] flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold">Acciones principales</h2>
                  <p className="text-sm text-[#5B6B7C]">Máximo 3 clics para iniciar la operación</p>
                </div>
                <Button onClick={() => navigate('/venta/nueva')} className="gap-2">
                  <FileText className="w-4 h-4" />
                  Nueva venta con receta
                </Button>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                <button onClick={() => navigate('/clientes')} className="flex items-center gap-3 border border-[#E5E9F0] p-4 text-left hover:bg-[#F7F9FB] transition-colors">
                  <div className="h-9 w-9 flex items-center justify-center border border-[#E5E9F0]">
                    <Users className="w-4 h-4 text-[#5B6B7C]" />
                  </div>
                  <div>
                    <div className="font-medium">Clientes</div>
                    <div className="text-sm text-[#5B6B7C]">Buscar / registrar / modificar</div>
                  </div>
                </button>
                <button onClick={() => navigate('/stock')} className="flex items-center gap-3 border border-[#E5E9F0] p-4 text-left hover:bg-[#F7F9FB] transition-colors">
                  <div className="h-9 w-9 flex items-center justify-center border border-[#E5E9F0]">
                    <Package className="w-4 h-4 text-[#5B6B7C]" />
                  </div>
                  <div>
                    <div className="font-medium">Consulta de stock</div>
                    <div className="text-sm text-[#5B6B7C]">Stock por sucursal · Alertas de stock bajo</div>
                  </div>
                </button>
                <button onClick={() => navigate('/ventas')} className="flex items-center gap-3 border border-[#E5E9F0] p-4 text-left hover:bg-[#F7F9FB] transition-colors">
                  <div className="h-9 w-9 flex items-center justify-center border border-[#E5E9F0]">
                    <ClipboardList className="w-4 h-4 text-[#5B6B7C]" />
                  </div>
                  <div>
                    <div className="font-medium">Listado de ventas con receta</div>
                    <div className="text-sm text-[#5B6B7C]">Filtrar por fecha, cliente, obra social</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white border border-[#E5E9F0] shadow-sm">
              <div className="px-5 py-4 border-b border-[#EEF1F6] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#5B6B7C]" />
                <h2 className="text-base font-semibold">Cola de turnos en espera</h2>
              </div>
              <div className="divide-y divide-[#EEF1F6]">
                {turnos.map(turno => (
                  <div key={turno.id} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">Turno #{turno.numeroTurno}</span>
                        {turno.estado === 'Atendiendo' && <Badge variant="default">Atendiendo</Badge>}
                        {turno.estado === 'En espera' && <Badge variant="secondary">En espera</Badge>}
                      </div>
                      <div className="text-sm text-[#5B6B7C]">{turno.clienteNombre}</div>
                    </div>
                    <div className="text-xs text-[#5B6B7C]">Llegada: {new Date(turno.horaLlegada).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                ))}
                {turnos.length === 0 && (
                  <div className="px-5 py-6 text-center text-sm text-[#5B6B7C]">Sin turnos en espera</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
