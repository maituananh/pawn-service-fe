import { Navigate } from 'react-router-dom';
import { useAuth, type UserRole } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[]; // Prop mới để nhận các vai trò được phép
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, role } = useAuth();

  // 1. Kiểm tra đăng nhập trước tiên
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Nếu route này yêu cầu vai trò cụ thể
  if (allowedRoles && allowedRoles.length > 0) {
    // Kiểm tra xem vai trò của người dùng có nằm trong danh sách được phép không
    if (!role || !allowedRoles.includes(role)) {
      // Nếu không có quyền, chuyển hướng về trang chủ hoặc trang "403 Forbidden"
      return <Navigate to="/" replace />;
    }
  }

  // Nếu đăng nhập và có đủ quyền (hoặc route không yêu cầu quyền cụ thể), cho phép truy cập
  return <>{children}</>;
};

export default ProtectedRoute;