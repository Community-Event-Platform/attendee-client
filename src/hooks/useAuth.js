import { useAuthStore } from '../store/authStore';
import { loginApi, logoutApi, registerApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

// Custom hook useAuth - cung cấp auth logic cho components
export const useAuth = () => {
  const navigate = useNavigate();
  const { 
    user, 
    token, 
    isAuthenticated, 
    isLoading,
    login: storeLogin, 
    logout: storeLogout,
    initAuth,
    updateUser
  } = useAuthStore();

  // Login function
  const login = async (email, password) => {
    try {
      const response = await loginApi({ email, password });
      const { user: userData, token: authToken } = response.data;
      storeLogin(userData, authToken);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await registerApi(userData);
      const { user: newUser, token: authToken } = response.data;
      storeLogin(newUser, authToken);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.log('Logout API error:', error);
    } finally {
      storeLogout();
      navigate('/login');
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    initAuth,
    updateUser
  };
};

export default useAuth;