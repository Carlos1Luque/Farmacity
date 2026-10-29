import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { CheckCircle, Printer, Home } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function Comprobante() {
  const navigate = useNavigate();
  const [comprobante, setComprobante] = useState<any>(null);

  useEffect(() => {
    const c = localStorage.getItem('comprobante');
    if (c) {
      setComprobante(JSON.parse(c));
    } else {
      navigate('/panel');
    }
  }, []);

  const imprimir = () => {
    window.print();
  };

  if (!comprobante) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="text-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-700">Cobro Registrado Exitosamente</h2>
          <p className="text-gray-600">Comprobante de pago generado</p>
        </div>

        <div className="bg-white rounded-lg shadow p-8 mb-6 print:shadow-none">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold">FARMACITY S.A.</h1>
            <p className="text-sm text-gray-600">{comprobante.sucursalNombre}</p>
            <p className="text-sm text-gray-600">COMPROBANTE DE PAGO</p>
          </div>

          <div className="border-t border-b py-4 mb-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>N° Venta:</span>
              <span className="font-medium">{comprobante.nroVenta}</span>
            </div>
            <div className="flex justify-between">
              <span>Fecha:</span>
              <span>{formatDate(comprobante.fecha)} {new Date(comprobante.fecha).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex justify-between">
              <span>Cliente:</span>
              <span>{comprobante.clienteNombre}</span>
            </div>
          </div>

          <div className="mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Producto</th>
                  <th className="text-center py-2">Cant.</th>
                  <th className="text-right py-2">P.Unit</th>
                  <th className="text-right py-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {comprobante.detalles.map((det: any, idx: number) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2 text-xs">{det.productoNombre}</td>
                    <td className="text-center py-2">{det.cantidad}</td>
                    <td className="text-right py-2">{formatCurrency(det.precioUnitario)}</td>
                    <td className="text-right py-2">{formatCurrency(det.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between font-bold text-lg">
              <span>TOTAL</span>
              <span>{formatCurrency(comprobante.total)}</span>
            </div>
            <div className="border-t pt-2 space-y-1">
              <p className="font-medium">Medios de Pago:</p>
              {comprobante.mediosPago.map((mp: any, idx: number) => (
                <div key={idx} className="flex justify-between">
                  <span>{getMedioPagoNombre(mp.medioPago)}</span>
                  <span>{formatCurrency(mp.importe)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <span>Monto Cobrado</span>
              <span>{formatCurrency(comprobante.montoCobrado)}</span>
            </div>
            {comprobante.cambio > 0 && (
              <div className="flex justify-between font-medium text-green-600">
                <span>Vuelto</span>
                <span>{formatCurrency(comprobante.cambio)}</span>
              </div>
            )}
          </div>

          <div className="text-center text-xs text-gray-500 mt-6">
            <p>Gracias por su compra</p>
          </div>
        </div>

        <div className="flex gap-3 print:hidden">
          <Button onClick={imprimir} className="flex-1">
            <Printer className="w-4 h-4 mr-2" />
            Imprimir Comprobante
          </Button>
          <Button onClick={() => navigate('/panel')} variant="outline" className="flex-1">
            <Home className="w-4 h-4 mr-2" />
            Volver al Panel
          </Button>
        </div>
      </div>
    </div>
  );
}

function getMedioPagoNombre(medio: number) {
  const map: any = { 1: 'Efectivo', 2: 'Débito', 3: 'Crédito', 4: 'Transferencia' };
  return map[medio] || 'Otro';
}
