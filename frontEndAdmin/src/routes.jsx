import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import AuthGuard from 'components/Guard/AuthGuard';
import CheckLoginGuard from 'components/Guard/CheckLoginGuard';
import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';
import { BASE_URL } from './config/constant';

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            key={i}
            path={route.path}
            element={
              <Guard>
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element props={true} />}</Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

const routes = [
  {
    exact: 'true',
    path: '/',
    // element: <AuthGuard>{lazy(() => import('./views/auth/signin/SignIn1'))}</AuthGuard>
    element: lazy(() => import('./views/auth/signin/SignIn1')),
    guard: CheckLoginGuard
  },
  {
    exact: 'true',
    path: '/login',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },

  {
    exact: 'true',
    path: '/signup',
    element: lazy(() => import('./views/auth/signup/SignUp1'))
  },
  {
    path: '*',
    layout: AdminLayout,
    routes: [
      {
        exact: 'true',
        path: '/dashboard',
        element: lazy(() => import('./views/dashboard')),
        guard: AuthGuard
      },
      {
        exact: 'true',
        path: '/categories',
        element: lazy(() => import('./views/categories')),
        guard: AuthGuard
      },
      {
        exact: 'true',
        path: '/tags',
        element: lazy(() => import('./views/tags')),
        guard: AuthGuard
      },
      {
        exact: 'true',
        path: '/deliveryPrice',
        element: lazy(() => import('./views/deliveryPrice')),
        guard: AuthGuard
      },
      {
        exact: 'true',
        path: '/products',
        element: lazy(() => import('./views/products')),
        guard: AuthGuard
      },
      {
        exact: 'true',
        path: '/orders',
        element: lazy(() => import('./views/order')),
        guard: AuthGuard
      },
      {
        exact: 'true',
        path: '/report',
        element: lazy(() => import('./views/report')),
        guard: AuthGuard
      },
      {
        exact: 'true',
        path: '/users',
        element: lazy(() => import('./views/users')),
        guard: AuthGuard
      },
      {
        exact: 'true',
        path: '/basic/button',
        element: lazy(() => import('./views/ui-elements/basic/BasicButton')),
        guard: AuthGuard
      },
      {
        exact: 'true',
        path: '/basic/badges',
        element: lazy(() => import('./views/ui-elements/basic/BasicBadges')),
        guard: AuthGuard
      },
      {
        exact: 'true',
        path: '/basic/breadcrumb-paging',
        element: lazy(() => import('./views/ui-elements/basic/BasicBreadcrumb')),
        guard: AuthGuard
      },
      {
        exact: 'true',
        path: '/basic/collapse',
        element: lazy(() => import('./views/ui-elements/basic/BasicCollapse')),
        guard: AuthGuard
      },
      {
        exact: 'true',
        path: '/basic/tabs-pills',
        element: lazy(() => import('./views/ui-elements/basic/BasicTabsPills')),
        guard: AuthGuard
      },
      {
        exact: 'true',
        path: '/basic/typography',
        element: lazy(() => import('./views/ui-elements/basic/BasicTypography')),
        guard: AuthGuard
      },
      {
        exact: 'true',
        path: '/forms/form-basic',
        element: lazy(() => import('./views/forms/FormsElements'))
      },
      {
        exact: 'true',
        path: '/tables/bootstrap',
        element: lazy(() => import('./views/tables/BootstrapTable'))
      },
      {
        exact: 'true',
        path: '/charts/nvd3',
        element: lazy(() => import('./views/charts/nvd3-chart'))
      },
      {
        exact: 'true',
        path: '/maps/google-map',
        element: lazy(() => import('./views/maps/GoogleMaps'))
      },
      {
        exact: 'true',
        path: '/sample-page',
        element: lazy(() => import('./views/extra/SamplePage'))
      },
      {
        path: '*',
        exact: 'true',
        element: () => <Navigate to={BASE_URL} />
      }
    ]
  }
];

export default routes;
