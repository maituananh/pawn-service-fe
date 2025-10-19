// src/router/router.config.ts
import HomePage from '../pages/HomePage';
import { UserRole } from '../hooks/useAuth'; // Import kiểu UserRole
import LoginPage from '../pages/LoginPage';
import AdminReportsPage from '../pages/AdminReportsPage';
import ProductsPage from '../pages/ProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import RegisterPage from '@/pages/RegisterPage';

export interface RouteConfig {
  path: string;
  label: string;
  component: React.ComponentType;
  showInMenu: boolean;
  requiresLayout: boolean;
  roles?: UserRole[];
}

export const publicRoutes: RouteConfig[] = [
  {
    path: '/',
    label: 'Trang chủ',
    component: HomePage,
    showInMenu: true,
    requiresLayout: true,
  },
  {
    path: '/products',
    label: 'Đang thanh lý',
    component: ProductsPage,
    showInMenu: true,
    requiresLayout: true,
  },
  {
    path: '/login',
    label: 'Đăng nhập',
    component: LoginPage,
    showInMenu: false,
    requiresLayout: false,
  },
  
  {
    path: '/login',
    label: 'Đăng ký',
    component: RegisterPage,
    showInMenu: false,
    requiresLayout: false,
  },
  {
  path: '/products/:id',
  label: 'Chi tiết sản phẩm',
  component: ProductDetailPage,
  showInMenu: false,    
  requiresLayout: true,
}
];

export const privateRoutes: RouteConfig[] = [
  {
    path: '/settings',
    label: 'Cài đặt',
    component: AdminReportsPage,
    showInMenu: true,
    requiresLayout: true,
    roles: ['admin'],
  },
];
