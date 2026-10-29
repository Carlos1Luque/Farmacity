import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, UserPlus, ArrowLeft, Check } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function Cliente() {
  const navigate = useNavigate();
  const [dni, setDni] = useState('');
  const [clientes, setClientes] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({ dni: '', nombre: '', telefono: '' });

  const buscarCliente = async () => {
    try {
      const res = await api.get(`/clientes?dni=${dni}`);
      setClientes(res.data);
      if (res.data.length === 0) {
        toast.info('Cliente no encontrado. Se puede dar de alta en forma rápida.');
        setNuevoCliente({ ...nuevoCliente, dni });
        setShowForm(true);
      }
    } catch (error) {
      toast.error('Error al buscar cliente');
    }
  };

  const registrarCliente = async () => {
    try {
      const res = await api.post('/clientes', nuevoCliente);
      toast.success('Cliente registrado correctamente');
      localStorage.setItem('cliente_seleccionado', JSON.stringify(res.data));
      navigate('/venta/obra-social');
    } catch (error) {
      toast.error('Error al registrar cliente');
    }
  };

  const seleccionarCliente = (cliente: any) => {
    localStorage.setItem('cliente_seleccionado', JSON.stringify(cliente));
    navigate('/venta/obra-social');
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      <AppHeader />
      <main className="max-w-[1100px] mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/panel')}>
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Volver al panel
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Cliente</h1>
              <p className="text-sm text-[#5B6B7C]">Búsqueda por DNI · Alta rápida inline</p>
            </div>
          </div>
          <div className="text-xs text-[#5B6B7C]">Paso 1 de 3</div>
        </div>

        <div className="bg-white border border-[#E5E9F0] shadow-sm mb-4">
          <div className="px-5 py-4 border-b border-[#EEF1F6]">
            <h2 className="text-base font-semibold">Buscar cliente</h2>
            <p className="text-sm text-[#5B6B7C]">Ingresá el DNI para localizar al cliente</p>
          </div>
          <div className="p-5 flex flex-col md:flex-row gap-2">
            <div className="flex-1">
              <Input
                placeholder="Ej.: 30123456"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && buscarCliente()}
              />
            </div>
            <Button onClick={buscarCliente} className="gap-2">
              <Search className="w-4 h-4" />
              Buscar por DNI
            </Button>
            <Button variant="outline" onClick={() => setShowForm(!showForm)} className="gap-2">
              <UserPlus className="w-4 h-4" />
              Alta rápida inline
            </Button>
          </div>
        </div>

        {clientes.length > 0 && (
          <div className="bg-white border border-[#E5E9F0] shadow-sm mb-4">
            <div className="px-5 py-4 border-b border-[#EEF1F6]">
              <h2 className="text-base font-semibold">Resultados</h2>
              <p className="text-sm text-[#5B6B7C]">Seleccioná el cliente para continuar con la venta</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F7F9FB]">
                    <th className="text-left font-medium px-5 py-2.5">DNI</th>
                    <th className="text-left font-medium px-5 py-2.5">Nombre y apellido</th>
                    <th className="text-left font-medium px-5 py-2.5">Teléfono</th>
                    <th className="text-right font-medium px-5 py-2.5"></th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map(cliente => (
                    <tr key={cliente.id} className="border-t border-[#EEF1F6] h-10 hover:bg-[#F9FBFD]">
                      <td className="px-5 py-2">{cliente.dni}</td>
                      <td className="px-5 py-2 font-medium">{cliente.nombre}</td>
                      <td className="px-5 py-2 text-[#5B6B7C]">{cliente.telefono}</td>
                      <td className="px-5 py-2 text-right">
                        <Button size="sm" onClick={() => seleccionarCliente(cliente)} className="gap-1.5">
                          <Check className="w-4 h-4" />
                          Seleccionar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showForm && (
          <div className="bg-white border border-[#E5E9F0] shadow-sm">
            <div className="px-5 py-4 border-b border-[#EEF1F6]">
              <h2 className="text-base font-semibold">Alta rápida inline</h2>
              <p className="text-sm text-[#5B6B7C]">Completá los datos mínimos para dar de alta y continuar</p>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">DNI</label>
                <Input value={nuevoCliente.dni} onChange={(e) => setNuevoCliente({...nuevoCliente, dni: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Nombre y apellido</label>
                <Input value={nuevoCliente.nombre} onChange={(e) => setNuevoCliente({...nuevoCliente, nombre: e.target.value})} placeholder="Nombre completo" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Teléfono</label>
                <Input value={nuevoCliente.telefono} onChange={(e) => setNuevoCliente({...nuevoCliente, telefono: e.target.value})} placeholder="11-xxxx-xxxx" />
              </div>
            </div>
            <div className="px-5 py-4 border-t border-[#EEF1F6] flex gap-2">
              <Button onClick={registrarCliente} className="gap-2">
                <Check className="w-4 h-4" />
                Guardar y continuar
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
