import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export default function Cobro() {
  const navigate = useNavigate();
  const [venta, setVenta] = useState<any>(null);
  const [mediosPago, setMediosPago] = useState<any[]>([]);
  const [medioActual, setMedioActual] = useState('Efectivo');
  const [importeActual, setImporteActual] = useState('');

  useEffect(() => {
    const v = localStorage.getItem('venta_actual');
    if (v) {
      setVenta(JSON.parse(v));
    } else {
      navigate('/panel');
    }
  }, []);

  const agregarMedioPago = () => {
    const importe = parseFloat(importeActual);
    if (isNaN(importe) || importe <= 0) {
      toast.error('Ingrese un importe válido');
      return;
    }
    const totalMedios = mediosPago.reduce((sum, m) => sum + m.importe, 0);
    if (totalMedios + importe > venta.total + 0.01) {
      toast.error('El importe supera el total a cobrar');
      return;
    }
    setMediosPago([...mediosPago, { medioPago: getMedioPagoEnum(medioActual), tipo: medioActual, importe }]);
    setImporteActual('');
  };

  const eliminarMedioPago = (index: number) => {
    setMediosPago(mediosPago.filter((_, i) => i !== index));
  };

  const getMedioPagoEnum = (tipo: string) => {
    const map: any = { 'Efectivo': 1, 'Debito': 2, 'Credito': 3, 'Transferencia': 4 };
    return map[tipo];
  };

  const totalMedios = mediosPago.reduce((sum, m) => sum + m.importe, 0);
  const saldo = venta ? venta.total - totalMedios : 0;
  const montoCobrado = totalMedios;
  const cambio = saldo < 0 ? Math.abs(saldo) : 0;

  const confirmarCobro = async () => {
    if (Math.abs(saldo) > 0.01) {
      toast.error('Debe cubrir el total con los medios de pago');
      return;
    }

    try {
      const cobroDto = {
        ventaId: venta.id,
        importeTotal: venta.total,
        montoCobrado,
        cambio,
        detallesCobro: mediosPago.map(m => ({
          medioPago: m.medioPago,
          importe: m.importe,
          referencia: ''
        }))
      };

      const res = await api.post('/cobros', cobroDto);
      localStorage.setItem('comprobante', JSON.stringify(res.data));
      localStorage.removeItem('venta_actual');
      localStorage.removeItem('cliente_seleccionado');
      localStorage.removeItem('obra_social_seleccionada');
      toast.success('Cobro registrado exitosamente');
      navigate('/venta/comprobante');
    } catch (error) {
      toast.error('Error al registrar cobro');
    }
  };

  if (!venta) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/venta/registrar')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Cobro</h2>
            <p className="text-gray-600">Pagos combinados - Varios medios de pago</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Resumen</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-lg">
                  <span>N° Venta</span>
                  <span className="font-medium">{venta.nroVenta}</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-2">
                  <span>Total a Cobrar</span>
                  <span className="text-primary">{formatCurrency(venta.total)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Agregar Medio de Pago</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Medio de Pago</label>
                  <select
                    value={medioActual}
                    onChange={(e) => setMedioActual(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input"
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="Debito">Débito</option>
                    <option value="Credito">Crédito</option>
                    <option value="Transferencia">Transferencia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Importe</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={importeActual}
                      onChange={(e) => setImporteActual(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                    />
                    <Button onClick={agregarMedioPago}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Medios de Pago Agregados</h3>
              <div className="space-y-2 mb-4">
                {mediosPago.length === 0 && (
                  <p className="text-center text-gray-500 py-4">Sin medios de pago agregados</p>
                )}
                {mediosPago.map((m, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{m.tipo}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{formatCurrency(m.importe)}</span>
                      <Button size="sm" variant="ghost" onClick={() => eliminarMedioPago(index)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Total Cobrado</span>
                  <span className="font-medium">{formatCurrency(totalMedios)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Saldo</span>
                  <span className={`font-medium ${saldo > 0 ? 'text-red-600' : saldo < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                    {formatCurrency(Math.abs(saldo))}
                  </span>
                </div>
                {cambio > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Vuelto</span>
                    <span>{formatCurrency(cambio)}</span>
                  </div>
                )}
              </div>
            </div>

            <Button 
              onClick={confirmarCobro} 
              className="w-full" 
              size="lg"
              disabled={Math.abs(saldo) > 0.01 || mediosPago.length === 0}
            >
              Confirmar Cobro y Emitir Comprobante
            </Button>
          </div>
                        </div>
      </div>
    </div>
  );
}
