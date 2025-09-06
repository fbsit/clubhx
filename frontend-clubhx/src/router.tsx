
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Root, MainLayoutWrapper } from "./routes/RootLayout";
import { clientRoutes } from "./routes/clientRoutes";
import { adminRoutes } from "./routes/adminRoutes";
import { salesRoutes } from "./routes/salesRoutes";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import RouteLoadingFallback from "@/components/RouteLoadingFallback";

// Create and export the router directly
export const router = createBrowserRouter([
  {
    element: <Root />,
    // Provide a default fallback while nested routes initialize
    errorElement: <RouteLoadingFallback />,
    children: [
      // Authentication routes
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Login />, // Registration is handled within Login component
      },
      {
        path: "/main",
        element: <MainLayoutWrapper />,
        // Avoid 404 flash on first paint: show route fallback instead
        errorElement: <RouteLoadingFallback />,
        children: [
          // Index route that redirects to dashboard
          {
            index: true,
            element: <Navigate to="/main/dashboard" replace />,
          },
          
          // Client routes
          ...clientRoutes,
          
          // Admin routes
          ...adminRoutes,
          
          // Sales routes
          ...salesRoutes,

          // Catch-all for unknown nested routes under /main
          {
            path: "*",
            element: <NotFound />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      }
    ],
  }
]);
