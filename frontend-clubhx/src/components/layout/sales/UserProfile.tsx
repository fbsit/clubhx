
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types/auth";

type UserProfileProps = {
  user: User | null;
};

export const UserProfile = ({ user }: UserProfileProps) => {
  if (!user) return null;
  
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium">{user.name}</span>
      <Avatar className="h-8 w-8 ring-1 ring-background shadow-sm">
        <AvatarImage src={user?.avatarUrl} alt={user?.name} />
        <AvatarFallback className="bg-primary/10 text-primary">
          {user?.name?.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};
