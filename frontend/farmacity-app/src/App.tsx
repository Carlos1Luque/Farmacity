import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'sonner';
import Login from './pages/Login';
import PanelMostrador from './pages/PanelMostrador';
import Cliente from './pages/Cliente';
import ObraSocial from './pages/ObraSocial';
import RegistrarVenta from './pages/RegistrarVenta';
import Cobro from './pages/Cobro';
import Comprobante from './pages/Comprobante';
import Stock from './pages/Stock';
import VentasListado from './pages/VentasListado';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/panel" element={<PrivateRoute><PanelMostrador /></PrivateRoute>} />
      <Route path="/venta/cliente" element={<PrivateRoute><Cliente /></PrivateRoute>} />
      <Route path="/venta/obra-social" element={<PrivateRoute><ObraSocial /></PrivateRoute>} />
      <Route path="/venta/registrar" element={<PrivateRoute><RegistrarVenta /></PrivateRoute>} />
      <Route path="/venta/nueva" element={<Navigate to="/venta/cliente" />} />
      <Route path="/venta/cobro" element={<PrivateRoute><Cobro /></PrivateRoute>} />
      <Route path="/venta/comprobante" element={<PrivateRoute><Comprobante /></PrivateRoute>} />
      <Route path="/clientes" element={<PrivateRoute><Cliente /></PrivateRoute>} />
      <Route path="/stock" element={<PrivateRoute><Stock /></PrivateRoute>} />
      <Route path="/ventas" element={<PrivateRoute><VentasListado /></PrivateRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
