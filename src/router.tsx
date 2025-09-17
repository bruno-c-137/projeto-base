import {
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import ProvideLayout, { useLayout } from "@/context/UseLayout";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";
import { lazy } from "react";
const LoginPage = lazy(() => import("@/pages/auth/Login/Login"));
const HomePage = lazy(() => import("@/pages/app/Home/Home"));
const LayoutAuth = lazy(() => import("@/pages/auth/LayoutAuth/LayoutAuth"));
const LayoutApp = lazy(() => import("@/pages/app/LayoutApp/LayoutApp"));
const AboutPage = lazy(() => import("@/pages/app/About/About"));
const LoadingComponent = lazy(() => import("@/components/Loading/Loading"));

function ProtectedLoader() {
  const { token } = useLayout();
  if (!!token) {
    return <Outlet />;
  } else {
    let params = new URLSearchParams();
    const path = new URL(window?.location?.href).pathname;
    if (path != "/") {
      params.set("redirect", new URL(window?.location?.href).pathname);
    }
    return <Navigate to={`/login?${params.toString()}`} replace={true} />;
  }
}

const RouterConfig = createBrowserRouter([
  {
    path: "/",
    Component: ProvideLayout,
    children: [
      /*
       * Páginas logadas
       */
      {
        path: "/",
        Component: ProtectedLoader,
        children: [
          {
            path: "/",
            Component: LayoutApp,
            children: [
              {
                path: "/",
                Component: HomePage,
              },
              {
                path: "/sobre",
                Component: AboutPage,
              },
            ],
          },
        ],
      },
      /*
       * Páginas que não estão logadas
       */
      {
        path: "/",
        Component: LayoutAuth,
        children: [
          {
            path: "/login",
            Component: LoginPage,
          },
        ],
      },
    ],
  },
]);

export default function Router() {
  return (
    <ErrorBoundary>
      <RouterProvider
        router={RouterConfig}
        fallbackElement={<LoadingComponent />}
      />
    </ErrorBoundary>
  );
}
