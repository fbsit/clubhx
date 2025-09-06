
import { Outlet } from "react-router-dom";
import { AppProviders } from "@/components/providers/AppProviders";
import MainLayout from "@/components/layout/MainLayout";

// Root element with providers
export const Root = () => (
  <AppProviders>
    <Outlet />
  </AppProviders>
);

// Layout with main wrapper
export const MainLayoutWrapper = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);
