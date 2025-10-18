export type UserRole = 'admin'|'user';

export const useAuth = () => {
  const token = localStorage.getItem('authToken');
  const role = localStorage.getItem('userRole') as UserRole | null;

  return {
    isAuthenticated: !!token,
    role: role,
    isAdmin: role==='admin',
  }
}

// // src/hooks/useAuth.ts
// import { useState, useEffect } from 'react';

// export type UserRole = 'admin' | 'user' | 'moderator';

// interface AuthContextProps {
//   isAuthenticated: boolean;
//   role?: UserRole;
// }

// export const useAuth = (): AuthContextProps => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [role, setRole] = useState<UserRole | undefined>(undefined);

//   // Giả sử bạn lấy thông tin người dùng từ localStorage hoặc context
//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem('user') || '{}');
//     if (user) {
//       setIsAuthenticated(true);
//       setRole(user.role); // Giả sử role là 'admin', 'user', 'moderator', v.v.
//     }
//   }, []);

//   return { isAuthenticated, role };
// };
