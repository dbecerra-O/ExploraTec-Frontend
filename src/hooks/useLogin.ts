import { useState } from 'react';
import { authService } from '../services/authservice';
import type { LoginRequest, AuthResponse } from '../types';

export const useLogin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginRequest): Promise<AuthResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login(credentials);
      return res;
    } catch (err: any) {
      if (err.response) {
        const backendMessage = err.response.data?.detail;
        setError(backendMessage || "Error en el login");
      } else if (err.code === "ECONNABORTED") {
        setError("El servidor no responde (timeout)");
      } else {
        // No hubo respuesta del servidor (backend apagado o caído)
        setError("No se pudo conectar con el servidor");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, login };
};
