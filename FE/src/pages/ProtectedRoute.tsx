// src/components/ProtectedRoute.tsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "@/redux/store/store";

const ProtectedRoute = () => {
  const {user, userLoading} = useSelector((state: RootState) => state.auth);

 if (userLoading) {
    return <div className="text-white p-8">Loading...</div>; 
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
