import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('http://localhost:5000/auth/check-auth', {
          withCredentials: true,
        });
        setIsAuth(res.data.success); // true = authenticated
      } catch (error) {
        setIsAuth(false); // not authenticated
      }
    };
    checkAuth();
  }, []);

  if (isAuth === null) return <div>Loading...</div>;
  return isAuth ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;
