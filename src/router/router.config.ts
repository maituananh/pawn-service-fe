import AdminCategoriesPage from "@/pages/Admin/AdminCategoriesPage";
import AdminCategoryFormPage from "@/pages/Admin/AdminCategoryFormPage";
import AdminCustomerDetailPage from "@/pages/Admin/AdminCustomerDetailPage";
import AdminCustomersPage from "@/pages/Admin/AdminCustomersPage";
import AdminDashboardPage from "@/pages/Admin/AdminDashboardPage";
import AdminOrdersPage from "@/pages/Admin/AdminOrdersPage";
import AdminProductCreatePage from "@/pages/Admin/AdminProductCreatePage";
import AdminProductDetailPage from "@/pages/Admin/AdminProductDetailPage";
import AdminProductsPage from "@/pages/Admin/AdminProductsPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import MyProfilePage from "@/pages/MyProfilePage";
import OrderDetailPage from "@/pages/OrderDetailPage";
import OrdersPage from "@/pages/OrdersPage";
import PaymentSuccess from "@/pages/PaymentSuccess";
import RegisterPage from "@/pages/RegisterPage";
import { UserRole } from "@/type/user.type";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import ProductsPage from "../pages/ProductsPage";

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
        path: "/",
        label: "Trang chủ",
        component: HomePage,
        showInMenu: true,
        requiresLayout: true
    },
    {
        path: "/products",
        label: "Đang thanh lý",
        component: ProductsPage,
        showInMenu: true,
        requiresLayout: true
    },
    {
        path: "/login",
        label: "Đăng nhập",
        component: LoginPage,
        showInMenu: false,
        requiresLayout: false
    },
    {
        path: "/register",
        label: "Đăng ký",
        component: RegisterPage,
        showInMenu: false,
        requiresLayout: false
    },
    {
        path: "/products/:id",
        label: "Chi tiết sản phẩm",
        component: ProductDetailPage,
        showInMenu: false,
        requiresLayout: true
    }
];

export const privateRoutes: RouteConfig[] = [
    {
        path: "/my-profile",
        label: "Hồ sơ",
        component: MyProfilePage,
        showInMenu: false,
        requiresLayout: true,
        roles: ["ADMIN", "CUSTOMER"]
    },
    {
        path: "/admin/dashboard",
        label: "Dashboard",
        component: AdminDashboardPage,
        showInMenu: true,
        requiresLayout: true,
        roles: ["ADMIN"]
    },
    {
        path: "/admin/customers",
        label: "Khách hàng",
        component: AdminCustomersPage,
        showInMenu: true,
        requiresLayout: true,
        roles: ["ADMIN"]
    },
    {
        path: "/admin/customers/:id",
        label: "Chi tiết khách hàng",
        component: AdminCustomerDetailPage,
        showInMenu: false,
        requiresLayout: true,
        roles: ["ADMIN"]
    },
    {
        path: "/admin/products",
        label: "Quản lý sản phẩm",
        component: AdminProductsPage,
        showInMenu: true,
        requiresLayout: true,
        roles: ["ADMIN"]
    },
    {
        path: "/admin/categories",
        label: "Danh mục",
        component: AdminCategoriesPage,
        showInMenu: true,
        requiresLayout: true,
        roles: ["ADMIN"]
    },

    {
        path: "/admin/categories/new",
        label: "Tạo danh mục",
        component: AdminCategoryFormPage,
        showInMenu: false,
        requiresLayout: true,
        roles: ["ADMIN"]
    },
    {
        path: "/admin/categories/:id",
        label: "Cập nhật danh mục",
        component: AdminCategoryFormPage,
        showInMenu: false,
        requiresLayout: true,
        roles: ["ADMIN"]
    },

    {
        path: "/admin/products/:id",
        label: "Chi tiết sản phẩm",
        component: AdminProductDetailPage,
        showInMenu: false,
        requiresLayout: true,
        roles: ["ADMIN"]
    },
    {
        path: "/admin/products/new",
        label: "Thêm mới sản phẩm",
        component: AdminProductCreatePage,
        showInMenu: false,
        requiresLayout: true,
        roles: ["ADMIN"]
    },
    {
        path: "/admin/orders",
        label: "Quản lý đơn hàng",
        component: AdminOrdersPage,
        showInMenu: true,
        requiresLayout: true,
        roles: ["ADMIN"]
    },
    {
        path: "/admin/orders/:id",
        label: "Chi tiết đơn hàng",
        component: OrderDetailPage,
        showInMenu: false,
        requiresLayout: true,
        roles: ["ADMIN"]
    },
    {
        path: "/mycart",
        label: "Giỏ hàng",
        component: CartPage,
        showInMenu: false,
        requiresLayout: true,
        roles: ["CUSTOMER", "ADMIN"]
    },
    {
        path: "/checkout",
        label: "Thanh toán",
        component: CheckoutPage,
        showInMenu: false,
        requiresLayout: true,
        roles: ["CUSTOMER", "ADMIN"]
    },
    {
        path: "/orders",
        label: "Đơn hàng",
        component: OrdersPage,
        showInMenu: true,
        requiresLayout: true,
        roles: ["CUSTOMER", "ADMIN"]
    },
    {
        path: "/orders/:id",
        label: "Chi tiết đơn hàng",
        component: OrderDetailPage,
        showInMenu: false,
        requiresLayout: true,
        roles: ["CUSTOMER", "ADMIN"]
    },
    {
        path: "/payment-success",
        label: "Thanh toán thành công",
        component: PaymentSuccess,
        showInMenu: false,
        requiresLayout: true,
        roles: ["CUSTOMER", "ADMIN"]
    }
];
