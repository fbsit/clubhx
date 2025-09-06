
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

interface MobileUserAvatarProps {
  user: {
    name: string;
    avatarUrl?: string;
  };
  className?: string;
}

export default function MobileUserAvatar({ user, className }: MobileUserAvatarProps) {
  return (
    <Link to="/main/profile" className={className}>
      <Avatar className="h-9 w-9">
        <AvatarImage src={user.avatarUrl} alt={user.name} />
        <AvatarFallback className="text-xs bg-primary text-primary-foreground">
          {user.name?.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </Link>
  );
}
