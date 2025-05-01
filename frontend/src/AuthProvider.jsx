import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null); // null = loading

  const checkAuth = async () => {
    try {
      const res = await axios.get('http://localhost:5000/auth/check-auth', {
        withCredentials: true,
      });
      setIsAuth(res.data.success);
    } catch (error) {
      setIsAuth(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
