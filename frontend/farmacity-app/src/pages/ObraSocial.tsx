import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, Plus, AlertTriangle, XCircle } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function ObraSocial() {
  const navigate = useNavigate();
  const [obrasSociales, setObrasSociales] = useState<any[]>([]);
  const [cliente, setCliente] = useState<any>(null);
  const [resultado, setResultado] = useState<string | null>(null);

  useEffect(() => {
    const cli = localStorage.getItem('cliente_seleccionado');
    if (cli) setCliente(JSON.parse(cli));
    api.get('/obrassociales').then(res => setObrasSociales(res.data));
  }, []);

  const seleccionarObraSocial = (obra: any) => {
    localStorage.setItem('obra_social_seleccionada', JSON.stringify(obra));
    if (obra.porcentajeCobertura > 0) {
      setResultado(`Cubre ${obra.porcentajeCobertura}%`);
      toast.success(`Verificación: Cubre ${obra.porcentajeCobertura}% con ${obra.nombre}`);
    } else if (obra.nombre.toLowerCase().includes('sin')) {
      setResultado('No cubre');
      toast.info('Sin cobertura');
    } else {
      setResultado('Rechazada');
      toast.error('Cobertura rechazada');
    }
    setTimeout(() => navigate('/venta/registrar'), 600);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      <AppHeader />
      <main className="max-w-[1100px] mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/venta/cliente')}>
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Volver
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Obra social</h1>
              <p className="text-sm text-[#5B6B7C]">Selección, verificación de cobertura y alta rápida</p>
            </div>
          </div>
          <div className="text-xs text-[#5B6B7C]">Paso 2 de 3</div>
        </div>

        {cliente && (
          <div className="bg-white border border-[#E5E9F0] shadow-sm mb-4 px-5 py-3 flex items-center justify-between">
            <div className="text-sm">
              <span className="text-[#5B6B7C]">Cliente:</span> <span className="font-medium">{cliente.nombre}</span>
              <span className="mx-2 text-[#C9D1DC]">|</span>
              <span className="text-[#5B6B7C]">DNI:</span> <span className="font-medium">{cliente.dni}</span>
            </div>
            {resultado && (
              <Badge variant={resultado.includes('Cubre') ? 'success' : resultado === 'No cubre' ? 'warning' : 'destructive'}>
                {resultado}
              </Badge>
            )}
          </div>
        )}

        <div className="bg-white border border-[#E5E9F0] shadow-sm mb-4">
          <div className="px-5 py-4 border-b border-[#EEF1F6] flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Obras sociales disponibles</h2>
              <p className="text-sm text-[#5B6B7C]">Verificación con resultado: cubre X% / no cubre / rechazada</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Alta de obra social nueva
            </Button>
          </div>
          <div className="divide-y divide-[#EEF1F6]">
            {obrasSociales.map(obra => (
              <div key={obra.id} className="px-5 py-3 flex items-center justify-between hover:bg-[#F9FBFD]">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 flex items-center justify-center border border-[#E5E9F0]">
                    {obra.porcentajeCobertura > 0 ? <CheckCircle className="w-4 h-4 text-[#1E9E7A]" /> : obra.nombre.toLowerCase().includes('sin') ? <AlertTriangle className="w-4 h-4 text-[#E0A100]" /> : <XCircle className="w-4 h-4 text-[#C0392B]" />}
                  </div>
                  <div>
                    <div className="font-medium">{obra.nombre}</div>
                    <div className="text-sm text-[#5B6B7C]">Cobertura: {obra.porcentajeCobertura}%</div>
                  </div>
                </div>
                <Button size="sm" onClick={() => seleccionarObraSocial(obra)}>Verificar y seleccionar</Button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
