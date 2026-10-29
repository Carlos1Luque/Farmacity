import { createContext, useContext, useState, ReactNode } from 'react';

interface Usuario {
  usuarioId: number;
  nombreCompleto: string;
  rol: string;
  sucursalId: number;
  sucursalNombre: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  login: (usuario: Usuario) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const stored = localStorage.getItem('farmacity_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (user: Usuario) => {
    setUsuario(user);
    localStorage.setItem('farmacity_user', JSON.stringify(user));
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('farmacity_user');
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, isAuthenticated: !!usuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
