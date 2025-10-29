import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import ProductsPage from '../pages/ProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import RegisterPage from '@/pages/RegisterPage';
import { UserRole } from '@/type/user.type';
import AdminDashboardPage from '@/pages/Admin/AdminDashboardPage';
import AdminCustomersPage from '@/pages/Admin/AdminCustomersPage';
import AdminCustomerDetailPage from '@/pages/Admin/AdminCustomerDetailPage';
import AdminProductsPage from '@/pages/Admin/AdminProductsPage';
import AdminProductDetailPage from '@/pages/Admin/AdminProductDetailPage';
import AdminProductCreatePage from '@/pages/Admin/AdminProductCreatePage';
import AdminOrderReportPage from '@/pages/Admin/AdminOdersReportPage';

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
    path: '/register',
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
    path: '/admin/dashboard',
    label: 'Dashboard',
    component: AdminDashboardPage,
    showInMenu: true,
    requiresLayout: true,
    roles: ['admin'],
  },
  {
    path: '/admin/customers',
    label: 'Khách hàng',
    component: AdminCustomersPage,
    showInMenu: true,
    requiresLayout: true,
    roles: ['admin'],
  },
  {
    path: '/admin/customers/:id',
    label: 'Chi tiết khách hàng',
    component: AdminCustomerDetailPage,
    showInMenu: true,
    requiresLayout: true,
    roles: ['admin'],
  }, {
    path: '/admin/products',
    label: 'Quản lý sản phẩm',
    component: AdminProductsPage,
    showInMenu: true,
    requiresLayout: true,
    roles: ['admin'],
  }, {
    path: '/admin/products/:id',
    label: 'Chi tiết sản phẩm',
    component: AdminProductDetailPage,
    showInMenu: true,
    requiresLayout: true,
    roles: ['admin'],
  }, {
    path: '/admin/products/new',
    label: 'Thêm mới sản phẩm',
    component: AdminProductCreatePage,
    showInMenu: true,
    requiresLayout: true,
    roles: ['admin'],
  }, {
    path: '/admin/oders-report',
    label: 'Quản lý đơn',
    component: AdminOrderReportPage,
    showInMenu: true,
    requiresLayout: true,
    roles: ['admin'],
  },
];
