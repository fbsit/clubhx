
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { handleError } from "@/utils/errorUtils";

export interface ProfileFormData {
  name: string;
  email: string;
  company: string;
  address: string;
  city: string;
  region: string;
  zipCode: string;
  avatarUrl: string;
}

const DEFAULT_PROFILE: ProfileFormData = {
  name: "",
  email: "",
  company: "",
  address: "",
  city: "",
  region: "Metropolitana",
  zipCode: "",
  avatarUrl: ""
};

export function useProfileForm() {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileFormData>(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Load user data on initial render
  useEffect(() => {
    try {
      if (user) {
        setProfile({
          name: user.name || "",
          email: user.email || "",
          company: user.company || "",
          address: user.address || "",
          city: user.city || "",
          region: user.region || "Metropolitana",
          zipCode: user.zipCode || "",
          avatarUrl: user.avatarUrl || ""
        });
      }
    } catch (error) {
      handleError(error, "Loading profile data");
      setHasError(true);
    } finally {
      // Delay to prevent flicker
      setTimeout(() => {
        setIsLoading(false);
      }, 200);
    }
  }, [user]);

  // Reset form if user changes
  useEffect(() => {
    if (hasError && user) {
      setHasError(false);
      // Retry loading
      try {
        setProfile({
          name: user.name || "",
          email: user.email || "",
          company: user.company || "",
          address: user.address || "",
          city: user.city || "",
          region: user.region || "Metropolitana",
          zipCode: user.zipCode || "",
          avatarUrl: user.avatarUrl || ""
        });
      } catch (error) {
        console.error("Error retrying profile data load:", error);
      }
    }
  }, [user, hasError]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const { name, value } = e.target;
      setProfile(prev => ({ ...prev, [name]: value }));
    } catch (error) {
      handleError(error, "Changing profile field");
    }
  };

  // Handle file selection for avatar
  const handleFileSelect = (file: File) => {
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      handleError(error, "Selecting profile image");
      toast.error("No se pudo cargar la imagen", {
        description: "Por favor, intente con otra imagen"
      });
    }
  };

  // Handle avatar removal
  const handleRemoveAvatar = (e: React.MouseEvent) => {
    try {
      e.stopPropagation();
      setSelectedImage(null);
      setProfile(prev => ({ ...prev, avatarUrl: "" }));
    } catch (error) {
      handleError(error, "Removing profile image");
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (user) {
        updateUserProfile({
          ...user,
          ...profile,
          avatarUrl: selectedImage || profile.avatarUrl
        });
        
        toast.success("Perfil actualizado correctamente");
      }
      
      setIsEditing(false);
    } catch (error) {
      handleError(error, "Updating profile");
      toast.error("Error al actualizar el perfil", {
        description: "Por favor, intente nuevamente"
      });
    }
  };

  return {
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
    isLoading,
    hasError
  };
}
