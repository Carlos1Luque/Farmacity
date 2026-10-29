import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { AlertCircle, Lock } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/login', { username, password, sucursalId: 1 });
      if (res.data.exitoso) {
        login(res.data);
        toast.success('Inicio de sesión exitoso');
        navigate('/panel');
      } else {
        setError(res.data.mensaje);
      }
    } catch (error) {
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex flex-col">
      <header className="bg-[#12263F] text-white">
        <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/cade-logo.png" alt="C.A.D.E." className="h-7 w-auto object-contain" />
            <div>
              <div className="text-sm font-semibold">Sistema de Información Farmacity</div>
            </div>
          </div>
          <div className="text-xs text-white/80">Sucursal: Av. Sabattini 2200</div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-[1440px] mx-auto px-6 h-8 flex items-center text-[11px] text-white/70">
            Proyecto Farmacity · C.A.D.E. · Prototipo v0.1
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-[420px]">
          <div className="bg-white border border-[#E5E9F0] shadow-sm">
            <div className="px-6 py-5 border-b border-[#EEF1F6]">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#5B6B7C]" />
                <h1 className="text-lg font-semibold">Acceso al sistema</h1>
              </div>
              <p className="mt-1 text-sm text-[#5B6B7C]">Ingresá con tu usuario y contraseña</p>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Usuario</label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="usuario" autoComplete="username" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Contraseña</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" autoComplete="current-password" required />
              </div>
              {error && (
                <div className="flex items-start gap-2 border border-[#F5C6C6] bg-[#FDECEC] text-[#C0392B] px-3 py-2 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Ingresando...' : 'Iniciar sesión'}
              </Button>
            </form>
            <div className="px-6 py-4 border-t border-[#EEF1F6] text-xs text-[#5B6B7C]">
              <div className="font-medium text-[#12263F] mb-1">Usuarios de prueba</div>
              <div>venta1 / 123456 · caja1 / 123456 · deposito1 / 123456 · admin / admin</div>
              <div className="mt-1 text-[#E0A100]">Bloqueo tras 3 intentos fallidos · Estado: "Quedan 2 intentos" / "Cuenta bloqueada"</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
