import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(() => {
    const cached = sessionStorage.getItem('isAuth');
    return cached !== null ? JSON.parse(cached) : null;
  });

  useEffect(() => {
    if (isAuth !== null) return; // Already checked
    const checkAuth = async () => {
      try {
        const res = await axios.get('http://localhost:5000/auth/check-auth', {
          withCredentials: true,
        });

        const success = res.data.success === true;
        console.log(res);
        sessionStorage.setItem('isAuth', success);
        setIsAuth(success);
      } catch (err) {
        console.error("Error in ProtectedRoute:", err.message);
        sessionStorage.setItem('isAuth', false);
        setIsAuth(false);
      }
    };

    checkAuth();
  }, [isAuth]);

  if (isAuth === null) return <div>Loading...</div>;

  return isAuth ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
