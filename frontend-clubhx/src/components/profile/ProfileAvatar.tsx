
import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";

interface ProfileAvatarProps {
  avatarUrl: string | null;
  name: string;
  isEditing: boolean;
  onImageSelect: (file: File) => void;
  onRemoveAvatar: (e: React.MouseEvent) => void;
}

export function ProfileAvatar({
  avatarUrl,
  name,
  isEditing,
  onImageSelect,
  onRemoveAvatar
}: ProfileAvatarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initials = name?.split(' ').map(name => name[0]).join('').toUpperCase() || "U";

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <div className="relative w-20 h-20 md:h-32 md:w-32">
      <Avatar
        className="h-20 w-20 md:h-32 md:w-32 border-4 border-background cursor-pointer ring-offset-background transition-all hover:ring-2 hover:ring-ring hover:ring-offset-2"
        onClick={handleAvatarClick}
        tabIndex={isEditing ? 0 : -1}
        role={isEditing ? "button" : undefined}
        aria-label={isEditing ? "Cambiar foto de perfil" : undefined}
      >
        <AvatarImage src={avatarUrl || ""} alt={name} />
        <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
          {initials}
        </AvatarFallback>
        {isEditing && (
          <div
            className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-full opacity-100 hover:opacity-100 transition-opacity pointer-events-none"
            style={{ zIndex: 2 }}
          >
            <Camera className="h-7 w-7 text-white" />
          </div>
        )}
      </Avatar>
      {isEditing && avatarUrl && (
        <Button
          variant="destructive"
          size="icon"
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
          onClick={onRemoveAvatar}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden"
        accept="image/*" 
        onChange={handleFileChange}
        aria-label="Seleccionar imagen de perfil"
      />
    </div>
  );
}

