import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import AdminLayout from "@/layouts/AdminLayout";
import AdminCustomerDetailPage from "@/pages/Admin/AdminCustomerDetailPage";
import AdminCustomersPage from "@/pages/Admin/AdminCustomersPage";
import AdminDashboardPage from "@/pages/Admin/AdminDashboardPage";
import AdminOrderReportPage from "@/pages/Admin/AdminOdersReportPage";
import AdminProductCreatePage from "@/pages/Admin/AdminProductCreatePage";
import AdminProductDetailPage from "@/pages/Admin/AdminProductDetailPage";
import AdminProductsPage from "@/pages/Admin/AdminProductsPage";
import CartPage from "@/pages/CartPage";
import MyProfilePage from "@/pages/MyProfilePage";
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
        element: <PrivateRoute element={<CartPage />} />,
      },
    ],
  },
  {
    path: "/login",
    children: [{ index: true, element: <LoginPage /> }],
  },
  {
    path: "/my-profile",
    element: <MainLayout />,
    children: [{ index: true, element: <MyProfilePage /> }],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "dashboard",
        element: <PrivateRoute element={<AdminDashboardPage />} />,
      },
      {
        path: "customers",
        element: <PrivateRoute element={<AdminCustomersPage />} />,
      },
      {
        path: "customers/:id",
        element: <PrivateRoute element={<AdminCustomerDetailPage />} />,
      },
      {
        path: "products",
        element: <PrivateRoute element={<AdminProductsPage />} />,
      },
      {
        path: "products/:id",
        element: <PrivateRoute element={<AdminProductDetailPage />} />,
      },
      {
        path: "products/create",
        element: <PrivateRoute element={<AdminProductCreatePage />} />,
      },
      {
        path: "orders-report",
        element: <PrivateRoute element={<AdminOrderReportPage />} />,
      },
    ],
  },
]);
