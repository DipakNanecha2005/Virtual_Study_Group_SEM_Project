import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const [isAuth,setIsAuth] = useState(null);
    useEffect(() => {
        const checkAuth = async() => {
            try{
                const res = await axios.get('http://localhost:5000/auth/check-auth',{
                    withCredentials:true,
                });
                if(res.data.success){
                    setIsAuth(true);
                }else{
                    setIsAuth(false);
                }
            }catch(error){
                setIsAuth(false);
                console.log(error);
            }
        }
        checkAuth();
    },[]);

  if (isAuth === null)  return <div>Loading...</div>;
    return isAuth ? children : <Navigate to="/login" replace/>
};

export default ProtectedRoute;
