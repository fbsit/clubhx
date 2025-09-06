
import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/main/dashboard" className="flex items-center">
      <div className="relative">
        <div className="dark:bg-white dark:rounded transition-colors absolute inset-2"></div>
        <img 
          src="/lovable-uploads/730d2d10-1b04-479a-b7e6-67d179d2624a.png" 
          alt="CLUB HX - Schwarzkopf Professional" 
          className="h-16 relative z-10"
        />
      </div>
    </Link>
  );
}
