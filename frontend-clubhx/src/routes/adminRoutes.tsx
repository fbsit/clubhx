
import { RouteObject } from "react-router-dom";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import AdminProductAnalytics from "@/pages/admin/AdminProductAnalytics";
import AdminProductEdit from "@/pages/admin/AdminProductEdit";
import AdminProductPreview from "@/pages/admin/AdminProductPreview";
import AdminCustomers from "@/pages/admin/AdminCustomers";
import AdminCustomerProfile from "@/pages/admin/AdminCustomerProfile";
import AdminLoyaltyProducts from "@/pages/admin/AdminLoyaltyProducts";

import AdminVendors from "@/pages/admin/AdminVendors";
import AdminVendorProfile from "@/pages/admin/AdminVendorProfile";
import AdminSalesCalendar from "@/pages/admin/AdminSalesCalendar";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminCreditRequests from "@/pages/admin/AdminCreditRequests";
import AdminShippingZones from "@/pages/admin/AdminShippingZones";
import AdminRegistrationRequests from "@/pages/admin/AdminRegistrationRequests";
import AdminWishlistAnalytics from "@/pages/admin/AdminWishlistAnalytics";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export const adminRoutes: RouteObject[] = [
  {
    path: "admin",
    children: [
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "analytics",
        element: <AdminAnalytics />,
      },
      {
        path: "product-analytics",
        element: <AdminProductAnalytics />,
      },
      {
        path: "products/new",
        element: <AdminProductEdit />,
      },
      {
        path: "products/:id",
        element: <AdminProductEdit />,
      },
      {
        path: "products/:id/preview",
        element: <AdminProductPreview />,
      },
      {
        path: "categories",
        element: <AdminCategories />,
      },
      {
        path: "shipping-zones",
        element: <AdminShippingZones />,
      },
      {
        path: "customers",
        element: <AdminCustomers />,
      },
      {
        path: "customers/:id",
        element: <AdminCustomerProfile />,
      },
      {
        path: "credit-requests",
        element: <AdminCreditRequests />,
      },
      {
        path: "loyalty-products", 
        element: <AdminLoyaltyProducts />,
      },
      {
        path: "vendors",
        element: <AdminVendors />,
      },
      {
        path: "vendors/:id",
        element: <AdminVendorProfile />,
      },
      {
        path: "sales-calendar",
        element: <AdminSalesCalendar />,
      },
      {
        path: "registration-requests",
        element: <AdminRegistrationRequests />,
      },
      {
        path: "wishlist-analytics",
        element: <AdminWishlistAnalytics />,
      },
    ],
  },
];
