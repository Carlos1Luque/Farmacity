import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search } from 'lucide-react';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function VentasListado() {
  const navigate = useNavigate();
  const [ventas, setVentas] = useState<any[]>([]);
  const [nroVenta, setNroVenta] = useState('');
  const [cliente, setCliente] = useState('');

  const buscarVentas = async () => {
    try {
      const res = await api.get(`/ventas?nroVenta=${nroVenta}&cliente=${cliente}`);
      setVentas(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    buscarVentas();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/panel')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Listado de Ventas con Receta</h2>
            <p className="text-gray-600">Consultar y filtrar ventas</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              placeholder="N° de Venta"
              value={nroVenta}
              onChange={(e) => setNroVenta(e.target.value)}
            />
            <Input
              placeholder="Cliente"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
            />
            <Button onClick={buscarVentas}>
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">N° Venta</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Fecha</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Cliente</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Obra Social</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Total</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map(venta => (
                <tr key={venta.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{venta.nroVenta}</td>
                  <td className="px-4 py-3 text-sm">{formatDate(venta.fecha)}</td>
                  <td className="px-4 py-3">{venta.clienteNombre}</td>
                  <td className="px-4 py-3 text-sm">{venta.obraSocialNombre || '-'}</td>
                  <td className="px-4 py-3 font-medium">{formatCurrency(venta.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      venta.estado === 'Cobrado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {venta.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
