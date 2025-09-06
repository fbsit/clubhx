
import { useLocation } from "react-router-dom";
import { NavItem } from "./NavItem";
import { NavGroupLabel } from "./NavGroupLabel";
import { useAdminNavigationGroups } from "./AdminNavigationData";

type AdminNavigationGroupsProps = {
  collapsed: boolean;
};

export const AdminNavigationGroups = ({ collapsed }: AdminNavigationGroupsProps) => {
  const location = useLocation();
  const adminNavigationGroups = useAdminNavigationGroups();

  // Determine if a route is active
  const isActive = (path: string) => {
    if (location.pathname === path) return true;
    if (path !== '/' && location.pathname.startsWith(path + '/')) return true;
    return false;
  };

  return (
    <div className="space-y-6 mt-2">
      {adminNavigationGroups.map((group) => (
        <div key={group.label} className="space-y-1">
          <NavGroupLabel collapsed={collapsed}>{group.label}</NavGroupLabel>
          <nav className="space-y-1">
            {group.items.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                label={item.label}
                icon={item.icon}
                isActive={isActive(item.to)}
                collapsed={collapsed}
                alert={item.alert}
              />
            ))}
          </nav>
        </div>
      ))}
    </div>
  );
};
