import { Navigate, Outlet } from 'react-router-dom';

const AuthProtectedRoutes = () => {
    const token = localStorage.getItem("token"); 

   

  return token ?  <Outlet/> : <Navigate to="/" />;
}

export default AuthProtectedRoutes
