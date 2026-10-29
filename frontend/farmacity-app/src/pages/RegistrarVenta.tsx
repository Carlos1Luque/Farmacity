import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Trash2, ArrowLeft, AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export default function RegistrarVenta() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [cliente, setCliente] = useState<any>(null);
  const [obraSocial, setObraSocial] = useState<any>(null);
  const [productos, setProductos] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [detalles, setDetalles] = useState<any[]>([]);
  const [nroReceta, setNroReceta] = useState('');
  const [recetaChecklist, setRecetaChecklist] = useState({ fisica: false, vigente: false, legible: false });

  useEffect(() => {
    const cli = localStorage.getItem('cliente_seleccionado');
    const os = localStorage.getItem('obra_social_seleccionada');
    if (cli) setCliente(JSON.parse(cli));
    if (os) setObraSocial(JSON.parse(os));
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const res = await api.get(`/productos?sucursalId=${usuario?.sucursalId}&search=${search}`);
      setProductos(res.data);
    } catch (error) {
      toast.error('Error al cargar productos');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => cargarProductos(), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const agregarProducto = (producto: any) => {
    if (producto.stockActual <= 0) {
      toast.error('Sin stock disponible');
      return;
    }
    const existe = detalles.find(d => d.productoId === producto.id);
    if (existe) {
      setDetalles(detalles.map(d => 
        d.productoId === producto.id 
          ? { ...d, cantidad: d.cantidad + 1, subtotal: (d.cantidad + 1) * d.precioUnitario }
          : d
      ));
    } else {
      setDetalles([...detalles, {
        productoId: producto.id,
        productoNombre: producto.nombre,
        cantidad: 1,
        precioUnitario: producto.precio,
        subtotal: producto.precio,
        stockBajo: producto.stockBajo
      }]);
    }
  };

  const eliminarDetalle = (productoId: number) => {
    setDetalles(detalles.filter(d => d.productoId !== productoId));
  };

  const cambiarCantidad = (productoId: number, cantidad: number) => {
    if (cantidad < 1) return;
    setDetalles(detalles.map(d => 
      d.productoId === productoId 
        ? { ...d, cantidad, subtotal: cantidad * d.precioUnitario }
        : d
    ));
  };

  const subtotal = detalles.reduce((sum, d) => sum + d.subtotal, 0);
  const porcentajeCobertura = obraSocial?.porcentajeCobertura || 0;
  const descuento = subtotal * (porcentajeCobertura / 100);
  const total = subtotal - descuento;

  const continuarACobro = async () => {
    if (detalles.length === 0) {
      toast.error('Debe agregar al menos un producto');
      return;
    }
    if (!recetaChecklist.fisica || !recetaChecklist.vigente || !recetaChecklist.legible) {
      toast.error('Debe validar el checklist de receta verificada');
      return;
    }

    try {
      const ventaDto = {
        clienteId: cliente.id,
        obraSocialId: obraSocial?.id,
        usuarioId: usuario?.usuarioId,
        sucursalId: usuario?.sucursalId,
        conReceta: true,
        nroReceta,
        subtotal,
        descuento,
        total,
        detalles: detalles.map(d => ({
          productoId: d.productoId,
          cantidad: d.cantidad,
          precioUnitario: d.precioUnitario,
          subtotal: d.subtotal
        }))
      };

      const res = await api.post('/ventas', ventaDto);
      localStorage.setItem('venta_actual', JSON.stringify(res.data));
      toast.success('Venta registrada correctamente');
      navigate('/venta/cobro');
    } catch (error) {
      toast.error('Error al registrar venta');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      <AppHeader />
      <main className="max-w-[1440px] mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/panel')}>
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Volver al panel
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Registrar venta de medicamentos</h1>
              <p className="text-sm text-[#5B6B7C]">Vista única en tres zonas · Receta verificada · Stock por sucursal</p>
            </div>
          </div>
          <div className="text-xs text-[#5B6B7C]">Paso 3 de 3</div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          <div className="xl:col-span-3 space-y-4">
            <div className="bg-white border border-[#E5E9F0] shadow-sm">
              <div className="px-4 py-3 border-b border-[#EEF1F6]">
                <h2 className="text-sm font-semibold">Datos del cliente</h2>
              </div>
              <div className="p-4 space-y-2 text-sm">
                <div>
                  <div className="text-[#5B6B7C] text-xs">Nombre y apellido</div>
                  <div className="font-medium">{cliente?.nombre}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-[#5B6B7C] text-xs">DNI</div>
                    <div className="font-medium">{cliente?.dni}</div>
                  </div>
                  <div>
                    <div className="text-[#5B6B7C] text-xs">Teléfono</div>
                    <div className="font-medium">{cliente?.telefono}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E5E9F0] shadow-sm">
              <div className="px-4 py-3 border-b border-[#EEF1F6] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#5B6B7C]" />
                <h2 className="text-sm font-semibold">Receta verificada</h2>
              </div>
              <div className="p-4 space-y-3">
                <div className="space-y-2 text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={recetaChecklist.fisica} onChange={(e) => setRecetaChecklist({...recetaChecklist, fisica: e.target.checked})} className="accent-[#12263F]" />
                    <span>Receta física presente</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={recetaChecklist.vigente} onChange={(e) => setRecetaChecklist({...recetaChecklist, vigente: e.target.checked})} className="accent-[#12263F]" />
                    <span>Vigente</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={recetaChecklist.legible} onChange={(e) => setRecetaChecklist({...recetaChecklist, legible: e.target.checked})} className="accent-[#12263F]" />
                    <span>Datos legibles</span>
                  </label>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">N° de receta</label>
                  <Input value={nroReceta} onChange={(e) => setNroReceta(e.target.value)} placeholder="Ingresar N° de receta" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E5E9F0] shadow-sm">
              <div className="px-4 py-3 border-b border-[#EEF1F6]">
                <h2 className="text-sm font-semibold">Obra social con cobertura</h2>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{obraSocial?.nombre || 'Sin obra social'}</div>
                  <div className="text-sm text-[#5B6B7C]">Cobertura: {porcentajeCobertura}%</div>
                </div>
                <Badge variant={porcentajeCobertura > 0 ? 'success' : 'secondary'}>{porcentajeCobertura > 0 ? `Cubre ${porcentajeCobertura}%` : 'Sin cobertura'}</Badge>
              </div>
            </div>
          </div>

          <div className="xl:col-span-6 space-y-4">
            <div className="bg-white border border-[#E5E9F0] shadow-sm">
              <div className="px-4 py-3 border-b border-[#EEF1F6]">
                <h2 className="text-sm font-semibold">Buscador de medicamentos</h2>
                <p className="text-xs text-[#5B6B7C]">Por nombre o principio activo · Stock de la sucursal</p>
              </div>
              <div className="p-4 flex gap-2">
                <div className="flex-1">
                  <Input placeholder="Buscar por nombre o principio activo..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <Button variant="outline" size="icon">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
              <div className="px-4 pb-4 max-h-[280px] overflow-y-auto space-y-2">
                {productos.map(producto => (
                  <div key={producto.id} className="flex items-center justify-between border border-[#E5E9F0] p-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{producto.nombre}</span>
                        {producto.requiereReceta && <Badge variant="outline">Requiere receta</Badge>}
                        {producto.stockBajo && <Badge variant="warning">Stock bajo</Badge>}
                      </div>
                      <div className="text-xs text-[#5B6B7C]">{producto.principioActivo}</div>
                      <div className="flex gap-4 text-xs mt-1">
                        <span>Precio: {formatCurrency(producto.precio)}</span>
                        <span className={producto.stockBajo ? 'text-[#E0A100]' : 'text-[#5B6B7C]'}>Stock: {producto.stockActual}</span>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => agregarProducto(producto)} disabled={producto.stockActual <= 0} className="gap-1.5">
                      <Plus className="w-4 h-4" />
                      Agregar
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#E5E9F0] shadow-sm">
              <div className="px-4 py-3 border-b border-[#EEF1F6]">
                <h2 className="text-sm font-semibold">Detalle de venta</h2>
                <p className="text-xs text-[#5B6B7C]">Cantidad, precio unitario, subtotal</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F7F9FB]">
                      <th className="text-left font-medium px-4 py-2">Producto</th>
                      <th className="text-left font-medium px-4 py-2 w-[90px]">Cantidad</th>
                      <th className="text-right font-medium px-4 py-2 w-[120px]">Precio unitario</th>
                      <th className="text-right font-medium px-4 py-2 w-[120px]">Subtotal</th>
                      <th className="w-[50px]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {detalles.map(det => (
                      <tr key={det.productoId} className="border-t border-[#EEF1F6] h-10">
                        <td className="px-4 py-2">
                          <div className="text-sm font-medium">{det.productoNombre}</div>
                        </td>
                        <td className="px-4 py-2">
                          <Input
                            type="number"
                            value={det.cantidad}
                            onChange={(e) => cambiarCantidad(det.productoId, Number(e.target.value))}
                            className="h-8 w-16 px-2"
                            min="1"
                          />
                        </td>
                        <td className="px-4 py-2 text-right text-[#5B6B7C]">{formatCurrency(det.precioUnitario)}</td>
                        <td className="px-4 py-2 text-right font-medium">{formatCurrency(det.subtotal)}</td>
                        <td className="px-4 py-2 text-right">
                          <Button size="icon" variant="ghost" onClick={() => eliminarDetalle(det.productoId)} className="h-8 w-8">
                            <Trash2 className="w-4 h-4 text-[#C0392B]" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {detalles.length === 0 && (
                <div className="px-4 py-10 text-center text-sm text-[#5B6B7C]">No hay productos agregados al detalle</div>
              )}
            </div>
          </div>

          <div className="xl:col-span-3">
            <div className="bg-white border border-[#E5E9F0] shadow-sm sticky top-6">
              <div className="px-4 py-3 border-b border-[#EEF1F6]">
                <h2 className="text-sm font-semibold">Resumen de venta</h2>
              </div>
              <div className="p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#5B6B7C]">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5B6B7C]">Descuento por cobertura ({porcentajeCobertura}%)</span>
                  <span className="text-[#1E9E7A]">- {formatCurrency(descuento)}</span>
                </div>
                <div className="border-t border-[#EEF1F6] pt-2 flex justify-between text-base font-semibold">
                  <span>Total a pagar</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
              <div className="px-4 py-3 border-t border-[#EEF1F6]">
                <Button onClick={continuarACobro} className="w-full gap-2" disabled={!recetaChecklist.fisica || !recetaChecklist.vigente || !recetaChecklist.legible || detalles.length === 0}>
                  <CheckCircle className="w-4 h-4" />
                  Continuar al cobro
                </Button>
              </div>
              {detalles.some(d => d.stockBajo) && (
                <div className="px-4 py-3 border-t border-[#EEF1F6] bg-[#FFF8E7] text-[#E0A100] text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5" />
                  <span>Algunos productos tienen stock bajo. Se avisará al Encargado de Depósito.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
