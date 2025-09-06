
import { Building, Mail } from "lucide-react";
import { ProfileAvatar } from "./ProfileAvatar";

interface ProfileHeaderProps {
  profile: {
    name: string;
    email: string;
    company: string;
    avatarUrl: string;
  };
  selectedImage: string | null;
  isEditing: boolean;
  onImageSelect: (file: File) => void;
  onRemoveAvatar: (e: React.MouseEvent) => void;
}

export function ProfileHeader({
  profile,
  selectedImage,
  isEditing,
  onImageSelect,
  onRemoveAvatar
}: ProfileHeaderProps) {
  const avatarUrl = selectedImage || profile.avatarUrl;

  return (
    <div className="flex flex-col md:flex-row md:items-end gap-2 sm:gap-4 -mt-9 sm:-mt-12 md:-mt-16">
      <ProfileAvatar
        avatarUrl={avatarUrl}
        name={profile.name}
        isEditing={isEditing}
        onImageSelect={onImageSelect}
        onRemoveAvatar={onRemoveAvatar}
      />
      <div className="flex-1 min-w-0">
        <h2 className="text-lg sm:text-2xl font-bold truncate">{profile.name}</h2>
        <p className="text-[13px] sm:text-base text-muted-foreground flex items-center gap-1 truncate">
          <Mail className="h-3.5 w-3.5" /> {profile.email}
        </p>
        {profile.company && (
          <p className="flex items-center gap-1 text-[13px] sm:text-base text-muted-foreground truncate">
            <Building className="h-3.5 w-3.5" /> {profile.company}
          </p>
        )}
      </div>
    </div>
  );
}

