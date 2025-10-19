import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { privateRoutes, publicRoutes } from './router.config';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {publicRoutes.map((route) => {
          const Component = route.component;
          const element = route.requiresLayout ? (
            <MainLayout>
              <Component />
            </MainLayout>
          ) : (
            <Component />
          );
          return <Route key={route.path} path={route.path} element={element} />;
        })}
        {privateRoutes.map((route) => {
          const Component = route.component;
          const elementWithLayout = route.requiresLayout ? (
            <MainLayout>
              <Component />
            </MainLayout>
          ) : (
            <Component />
          );
          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                <ProtectedRoute allowedRoles={route.roles}>
                  {elementWithLayout}
                </ProtectedRoute>
              }
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;