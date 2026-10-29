import { useAuth } from '@/contexts/AuthContext';
import { Wifi, WifiOff, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export default function AppHeader() {
  const { usuario, logout } = useAuth();
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
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
    <header className="bg-[#12263F] text-white shadow">
      <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <img src="/cade-logo.png" alt="C.A.D.E." className="h-7 w-auto object-contain" />
            <div className="leading-tight">
              <div className="text-sm font-semibold">Sistema de Información Farmacity</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-white/80">
            <span className="px-2 py-0.5 rounded-sm bg-white/10">{usuario?.sucursalNombre || 'Av. Sabattini 2200'}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs">
            {online ? (
              <>
                <Wifi className="w-4 h-4" />
                <span>Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4" />
                <span>Sin conexión</span>
              </>
            )}
          </div>
          <div className="text-xs text-white/90">
            <span className="font-medium">{usuario?.nombreCompleto}</span>
            <span className="ml-2 text-white/70">· {usuario?.rol}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="text-white hover:bg-white/10 h-8 px-2">
            <LogOut className="w-4 h-4 mr-1.5" />
            Cerrar sesión
          </Button>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-6 h-8 flex items-center text-[11px] text-white/70">
          Proyecto Farmacity · C.A.D.E. · Prototipo v0.1
        </div>
      </div>
    </header>
  );
}
