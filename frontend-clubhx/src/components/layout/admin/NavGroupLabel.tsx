
type NavGroupLabelProps = { 
  children: React.ReactNode; 
  collapsed?: boolean; 
};

export const NavGroupLabel = ({ children, collapsed = false }: NavGroupLabelProps) => {
  if (collapsed) return null;
  
  return (
    <div className="px-4 py-1 text-xs font-medium text-muted-foreground tracking-wider uppercase">
      {children}
    </div>
  );
};
