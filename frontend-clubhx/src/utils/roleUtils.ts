
interface User {
  role?: string;
}

/**
 * Determines the default tab based on user role with strict separation
 * Admin no longer needs tabs - they see admin views directly
 */
export function getRoleDefaultTab(user?: User | null) {
  if (user?.role === 'admin') return 'admin'; // Keep for backward compatibility
  if (user?.role === 'sales') return 'sales';
  return 'client';
}

/**
 * Checks if a user can access content for a specific role
 */
export function canAccessRole(userRole?: string, targetRole?: string) {
  if (!userRole || !targetRole) return false;
  
  // Admin puede acceder a todo
  if (userRole === 'admin') return true;
  
  // Sales puede acceder a sales y client
  if (userRole === 'sales') return targetRole === 'sales' || targetRole === 'client';
  
  // Client solo puede acceder a client
  if (userRole === 'client') return targetRole === 'client';
  
  return false;
}

/**
 * Gets available tabs for a user based on their role
 * Admin no longer uses tabs in the main interface
 */
export function getAvailableTabs(userRole?: string) {
  const tabs = [];
  
  if (canAccessRole(userRole, 'client')) {
    tabs.push('client');
  }
  
  if (canAccessRole(userRole, 'sales')) {
    tabs.push('sales');
  }
  
  // Admin doesn't use tabs anymore in main interface
  if (userRole === 'admin') {
    return ['admin']; // Return admin only for backward compatibility
  }
  
  return tabs;
}
