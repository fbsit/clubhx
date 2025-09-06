
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useProfileForm } from "@/hooks/useProfileForm";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { handleError } from "@/utils/errorUtils";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react"; // Icono para el botón cerrar sesión

export default function Profile() {
  const navigate = useNavigate();
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const { logout } = useAuth();
  
  const { 
    profile, 
    isEditing, 
    setIsEditing, 
    activeTab, 
    setActiveTab,
    selectedImage, 
    handleChange,
    handleFileSelect, 
    handleRemoveAvatar, 
    handleSubmit,
    isLoading
  } = useProfileForm();

  // Ensure the component is fully loaded before rendering
  useEffect(() => {
    try {
      const timer = setTimeout(() => {
        setIsPageLoaded(true);
      }, 100);
      
      return () => clearTimeout(timer);
    } catch (error) {
      handleError(error, "Profile page initialization");
    }
  }, []);

  if (!isPageLoaded || isLoading) {
    return (
      <div className="container max-w-4xl py-4 sm:py-6 space-y-5 sm:space-y-8 px-2 sm:px-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-4">
          <Skeleton className="h-8 sm:h-10 w-36 sm:w-48" />
          <Skeleton className="h-8 sm:h-10 w-24 sm:w-32" />
        </div>
        <div className="grid gap-4 sm:gap-6">
          <Card className="overflow-hidden rounded-xl sm:rounded-2xl">
            <div className="bg-gradient-to-r from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800 h-20 sm:h-32"></div>
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 relative">
              <div className="flex flex-col md:flex-row md:items-end gap-2 sm:gap-4 -mt-9 sm:-mt-12 md:-mt-16">
                <Skeleton className="h-16 w-16 sm:h-24 sm:w-24 md:h-32 md:w-32 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-6 sm:h-7 w-28 sm:w-40 mb-2" />
                  <Skeleton className="h-3 sm:h-4 w-32 sm:w-56 mb-1" />
                  <Skeleton className="h-3 sm:h-4 w-24 sm:w-48" />
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <div className="p-4 sm:p-6">
              <Skeleton className="h-7 w-full mb-5 sm:mb-6" />
              <div className="space-y-3 sm:space-y-4">
                <Skeleton className="h-9 sm:h-10 w-full" />
                <Skeleton className="h-9 sm:h-10 w-full" />
                <Skeleton className="h-9 sm:h-10 w-full" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-4 sm:py-6 space-y-5 sm:space-y-8 px-2 sm:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Mi Perfil</h1>
        {!isEditing && (
          <Button 
            onClick={() => setIsEditing(true)} 
            className="w-full sm:w-auto h-9 sm:h-10 px-6 sm:px-8 text-base sm:text-lg rounded-lg sm:rounded-xl"
            size="sm"
          >
            Editar Perfil
          </Button>
        )}
      </div>
      <div className="grid gap-4 sm:gap-6">
        <Card className="overflow-hidden rounded-xl sm:rounded-2xl border border-border/30 shadow-sm sm:shadow-md">
          <div className="bg-gradient-to-r from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800 h-20 sm:h-32"></div>
          <div className="px-4 sm:px-6 pb-4 sm:pb-6 relative">
            <ProfileHeader 
              profile={profile}
              selectedImage={selectedImage}
              isEditing={isEditing}
              onImageSelect={handleFileSelect}
              onRemoveAvatar={handleRemoveAvatar}
            />
          </div>
        </Card>
        <ProfileForm 
          profile={profile}
          isEditing={isEditing}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => setIsEditing(false)}
        />
        {/* Botón cerrar sesión (Logout) */}
        <div className="flex justify-center mt-2 sm:mt-4">
          <Button
            onClick={logout}
            variant="outline"
            className="w-full max-w-xs rounded-lg h-10 text-[17px] font-semibold gap-2"
          >
            <LogOut className="h-5 w-5" /> Cerrar sesión
          </Button>
        </div>
      </div>
    </div>
  );
}

