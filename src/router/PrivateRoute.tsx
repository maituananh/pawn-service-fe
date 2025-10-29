import useAuth from "@/hooks/useAuth";
import { UserRole } from "@/type/user.type";
import { Navigate } from "react-router-dom";

export const PrivateRoute: React.FC<{
  roles?: UserRole[];
  element: React.ReactNode;
}> = ({ roles, element }) => {
  const { role, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <>{element}</>;
};
