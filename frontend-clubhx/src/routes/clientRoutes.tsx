
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Dashboard from "@/pages/Dashboard";
import Orders from "@/pages/Orders";
import OrderDetail from "@/pages/OrderDetail";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Loyalty from "@/pages/Loyalty";
import PointsDetail from "@/pages/PointsDetail";
import Events from "@/pages/Events";
import Wishlist from "@/pages/Wishlist";
import ClientSchedule from "@/pages/ClientSchedule";
import QuotationCheckout from "@/components/quotation/QuotationCheckout";

export const clientRoutes = [
  {
    path: "dashboard",
    element: <Dashboard />,
  },
  {
    path: "products",
    element: <Products />,
  },
  {
    path: "products/:id",
    element: <ProductDetail />,
  },
  {
    path: "quotation-checkout",
    element: <QuotationCheckout />,
  },
  {
    path: "orders",
    element: <Orders />,
  },
  {
    path: "orders/:id",
    element: <OrderDetail />,
  },
  {
    path: "loyalty",
    element: <Loyalty />,
  },
  {
    path: "points-detail",
    element: <PointsDetail />,
  },
  {
    path: "schedule",
    element: <ClientSchedule />,
  },
  {
    path: "events",
    element: <Events />,
  },
  {
    path: "wishlist",
    element: <Wishlist />,
  },
  {
    path: "profile",
    element: <Profile />,
  },
  {
    path: "settings",
    element: <Settings />,
  },
];
