import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error al verificar estado de autenticación:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      
      // Simulación de login con Google - datos ficticios
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simular delay de red
      
      const userData = {
        id: 'google_123456',
        name: 'Usuario Google',
        email: 'usuario@gmail.com',
        photo: 'https://via.placeholder.com/150',
        role: 'admin',
        loginMethod: 'google'
      };
      
      // Guardar datos del usuario
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Error en login con Google:', error);
      return { success: false, error: 'Error al iniciar sesión con Google' };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      
      // Simulación de login - en producción esto sería una llamada a la API
      const mockUsers = [
        {
          id: '1',
          email: 'admin@admindocentes.com',
          password: 'admin123',
          name: 'Administrador',
          role: 'admin',
          phone: '0999999999',
          city: 'Quito',
          loginMethod: 'email'
        }
      ];

      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        const userData = { ...user };
        delete userData.password; // No guardar la contraseña
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true, user: userData };
      } else {
        return { success: false, error: 'Credenciales inválidas' };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: 'Error al iniciar sesión' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Simulación de logout - delay para simular proceso
      await new Promise(resolve => setTimeout(resolve, 300));
      
      await AsyncStorage.removeItem('user');
      setUser(null);
      
      console.log('Logout exitoso - usuario desautenticado');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuth = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Error al limpiar autenticación:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    login,
    loginWithGoogle,
    logout,
    clearAuth,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
