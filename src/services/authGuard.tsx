import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const useAuth = () => {
  const token = (localStorage.getItem('token'))
  //console.log("user",token)
  return token;
  //return true;
}

function AuthGuard() {
  const token = useAuth();
  return (token) ? <Outlet /> : <Navigate to="/auth" />;
}

export default AuthGuard;