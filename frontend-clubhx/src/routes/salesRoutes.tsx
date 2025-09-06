
import { RouteObject } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Orders from "@/pages/Orders";
import Events from "@/pages/Events";
import Loyalty from "@/pages/Loyalty";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Clientes from "@/pages/Clientes";
import SalesDashboard from "@/pages/SalesDashboard";
import SalesCalendar from "@/pages/sales/SalesCalendar";
import SalesCustomers from "@/pages/sales/SalesCustomers";
import SalesCustomerDetail from "@/pages/sales/SalesCustomerDetail";
import SalesAnalytics from "@/pages/sales/SalesAnalytics";
import SalesSettings from "@/pages/sales/SalesSettings";
import SalesClientWishlists from "@/pages/sales/SalesClientWishlists";
import SalesEvents from "@/pages/sales/SalesEvents";
import SalesQuotationCheckout from "@/components/quotation/SalesQuotationCheckout";
import OrderDetail from "@/pages/OrderDetail";

export const salesRoutes: RouteObject[] = [
  {
    path: "dashboard",
    element: <Dashboard />,
  },
  {
    path: "sales-dashboard",
    element: <SalesDashboard />,
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
    path: "orders",
    element: <Orders />,
  },
  {
    path: "orders/:id",
    element: <OrderDetail />,
  },
  {
    path: "events",
    element: <Events />,
  },
  {
    path: "loyalty",
    element: <Loyalty />,
  },
  {
    path: "profile",
    element: <Profile />,
  },
  {
    path: "settings",
    element: <Settings />,
  },
  {
    path: "clientes",
    element: <Clientes />,
  },
  {
    path: "sales-quotation-checkout",
    element: <SalesQuotationCheckout />,
  },
  {
    path: "sales",
    children: [
      {
        path: "calendar",
        element: <SalesCalendar />,
      },
      {
        path: "customers",
        element: <SalesCustomers />,
      },
      {
        path: "customers/:id",
        element: <SalesCustomerDetail />,
      },
      {
        path: "wishlists",
        element: <SalesClientWishlists />,
      },
      {
        path: "analytics",
        element: <SalesAnalytics />,
      },
      {
        path: "events",
        element: <SalesEvents />,
      },
      {
        path: "settings",
        element: <SalesSettings />,
      },
    ],
  },
];
