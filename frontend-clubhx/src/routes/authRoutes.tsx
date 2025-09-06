
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

// Authentication routes (login, 404, etc.)
const authRoutes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <NotFound />,
  }
];

export { authRoutes };
