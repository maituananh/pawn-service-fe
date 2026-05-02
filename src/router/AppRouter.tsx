import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import AdminLayout from "@/layouts/AdminLayout";
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
import MyProductsPage from "@/pages/MyProductsPage";
import MyProfilePage from "@/pages/MyProfilePage";
import OrderDetailPage from "@/pages/OrderDetailPage";
import OrdersPage from "@/pages/OrdersPage";
import PaymentSuccess from "@/pages/PaymentSuccess";
import ProductDetailPage from "@/pages/ProductDetailPage";
import ProductsPage from "@/pages/ProductsPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import { PrivateRoute } from "./PrivateRoute";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "products", element: <ProductsPage /> },
            { path: "products/:id", element: <ProductDetailPage /> },
            {
                path: "mycart",
                element: <PrivateRoute element={<CartPage />} />
            },
            {
                path: "payment-success",
                element: <PrivateRoute element={<PaymentSuccess />} />
            },
            {
                path: "checkout",
                element: <PrivateRoute element={<CheckoutPage />} />
            },
            {
                path: "orders",
                element: <PrivateRoute element={<OrdersPage />} />
            },
            {
                path: "my-products",
                element: <PrivateRoute element={<MyProductsPage />} />
            },
            {
                path: "orders/:id",
                element: <PrivateRoute element={<OrderDetailPage />} />
            }
        ]
    },
    {
        path: "/login",
        children: [{ index: true, element: <LoginPage /> }]
    },
    {
        path: "/my-profile",
        element: <MainLayout />,
        children: [{ index: true, element: <MyProfilePage /> }]
    },
    {
        path: "*",
        element: <NotFoundPage />
    },
    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            { index: true, element: <HomePage /> },
            {
                path: "dashboard",
                element: <PrivateRoute element={<AdminDashboardPage />} />
            },
            {
                path: "customers",
                element: <PrivateRoute element={<AdminCustomersPage />} />
            },
            {
                path: "customers/:id",
                element: <PrivateRoute element={<AdminCustomerDetailPage />} />
            },
            {
                path: "products",
                element: <PrivateRoute element={<AdminProductsPage />} />
            },

            {
                path: "categories",
                element: <PrivateRoute element={<AdminCategoriesPage />} />
            },

            {
                path: "categories/new",
                element: <PrivateRoute element={<AdminCategoryFormPage />} />
            },

            {
                path: "categories/:id",
                element: <PrivateRoute element={<AdminCategoryFormPage />} />
            },

            {
                path: "products/:id",
                element: <PrivateRoute element={<AdminProductDetailPage />} />
            },
            {
                path: "products/create",
                element: <PrivateRoute element={<AdminProductCreatePage />} />
            },
            {
                path: "orders",
                element: <PrivateRoute element={<AdminOrdersPage />} />
            },
            {
                path: "orders/:id",
                element: <PrivateRoute element={<OrderDetailPage />} />
            }
        ]
    }
]);
