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
  const login = async (email, password, showToast) => {
    try {
      const response = await loginApi({ email, password });
      const userData = response.data.data;
      const authToken = response.data.access_token;
      storeLogin(userData, authToken);
      sessionStorage.setItem("justLoggedIn", "true");
      return { success: true, showToast };
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Email hoặc mật khẩu không đúng!";
      if (showToast) showToast(errorMsg, "error");
      return { 
        success: false, 
        error: errorMsg,
        showToast 
      };
    }
  };

  // Register function
  const register = async (userData, showToast) => {
    try {
      const response = await registerApi(userData);
      const { user: newUser, token: authToken } = response.data;
      storeLogin(newUser, authToken);
      sessionStorage.setItem("justLoggedIn", "true");
      return { success: true, showToast };
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Đăng ký thất bại!";
      if (showToast) showToast(errorMsg, "error");
      return { 
        success: false, 
        error: errorMsg,
        showToast 
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