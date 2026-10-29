import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, AlertTriangle } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/lib/utils';

export default function Stock() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [productos, setProductos] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const res = await api.get(`/productos?sucursalId=${usuario?.sucursalId}&search=${search}`);
      setProductos(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => cargarProductos(), 300);
    return () => clearTimeout(timer);
  }, [search]);

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
            <h2 className="text-2xl font-bold">Consulta de Stock</h2>
            <p className="text-gray-600">Stock por sucursal - Alertas de stock bajo</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-2">
            <Input
              placeholder="Buscar por nombre o principio activo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button onClick={cargarProductos}>
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Producto</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Principio Activo</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Precio</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Stock Actual</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Stock Mínimo</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(producto => (
                <tr key={producto.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{producto.nombre}</p>
                    {producto.requiereReceta && <span className="text-xs text-orange-600">Requiere receta</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{producto.principioActivo}</td>
                  <td className="px-4 py-3">{formatCurrency(producto.precio)}</td>
                  <td className="px-4 py-3 font-medium">{producto.stockActual}</td>
                  <td className="px-4 py-3">{producto.stockMinimo}</td>
                  <td className="px-4 py-3">
                    {producto.stockBajo ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                        <AlertTriangle className="w-3 h-3" />
                        Stock Bajo
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        Normal
                      </span>
                    )}
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
