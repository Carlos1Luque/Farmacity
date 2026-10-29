import { useAuth } from '@/contexts/AuthContext';
import { Wifi, WifiOff, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export default function Header() {
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
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Farmacity - Sistema de Ventas</h1>
          <span className="text-sm opacity-90">| {usuario?.sucursalNombre}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            {online ? (
              <>
                <Wifi className="w-4 h-4" />
                <span>Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4" />
                <span>Offline</span>
              </>
            )}
          </div>
          <div className="text-sm">
            <span className="font-medium">{usuario?.nombreCompleto}</span>
            <span className="ml-2 opacity-90">({usuario?.rol})</span>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="text-primary-foreground hover:bg-primary-foreground/10">
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar sesión
          </Button>
        </div>
      </div>
    </header>
  );
}
