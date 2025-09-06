
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Upload, Image, Link } from "lucide-react";
import OptimizedImage from "@/components/ui/optimized-image";

// Mock gallery images - would be replaced with actual stored images
const defaultGallery = [
  "https://images.unsplash.com/photo-1631730359585-38a4935cbea4?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1549921296-3b0f9a35af35?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1556229174-5e42a09e40eb?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1598631753354-c5fc33176296?auto=format&fit=crop&q=80"
];

interface ImageUploaderProps {
  onImageSelected: (imageUrl: string) => void;
  currentImage?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, currentImage }) => {
  const [selectedTab, setSelectedTab] = useState<string>("gallery");
  const [urlInput, setUrlInput] = useState(currentImage || "");
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  
  // In a real app, this would handle actual file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For demo purposes, we'll just use a mock URL
      // In a real app, this would upload the image to storage
      const mockUploadedUrl = defaultGallery[Math.floor(Math.random() * defaultGallery.length)];
      onImageSelected(mockUploadedUrl);
      setIsGalleryOpen(false);
    }
  };

  const handleUrlSelect = () => {
    if (urlInput.trim()) {
      onImageSelected(urlInput);
      setIsGalleryOpen(false);
    }
  };

  const handleGallerySelect = (imageUrl: string) => {
    onImageSelected(imageUrl);
    setIsGalleryOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="relative w-24 h-24 border rounded-md overflow-hidden">
          <OptimizedImage
            src={currentImage || defaultGallery[0]}
            alt="Imagen del producto"
            className="w-full h-full"
            aspectRatio="square"
          />
        </div>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => setIsGalleryOpen(true)}
        >
          <Image className="h-4 w-4" />
          Cambiar imagen
        </Button>
      </div>

      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Seleccionar imagen</DialogTitle>
            <DialogDescription>
              Elige una imagen para tu producto de fidelización
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="gallery" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="gallery">Galería</TabsTrigger>
              <TabsTrigger value="upload">Subir</TabsTrigger>
              <TabsTrigger value="url">URL</TabsTrigger>
            </TabsList>

            <TabsContent value="gallery" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {defaultGallery.map((img, index) => (
                  <div 
                    key={index} 
                    className="aspect-video overflow-hidden rounded-md cursor-pointer border-2 hover:border-primary transition-all"
                    onClick={() => handleGallerySelect(img)}
                  >
                    <OptimizedImage
                      src={img}
                      alt={`Galería imagen ${index + 1}`}
                      className="w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-4">
              <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed rounded-md">
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="mb-4 text-sm text-muted-foreground">Arrastra y suelta una imagen o haz click para seleccionar</p>
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <Input 
                    id="file-upload" 
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button variant="secondary" type="button">
                    Seleccionar archivo
                  </Button>
                </Label>
              </div>
            </TabsContent>

            <TabsContent value="url" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image-url">URL de la imagen</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="image-url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://ejemplo.com/mi-imagen.jpg"
                  />
                  <Button onClick={handleUrlSelect}>
                    <Link className="h-4 w-4 mr-2" />
                    Usar
                  </Button>
                </div>
              </div>
              {urlInput && (
                <div className="mt-4 aspect-video rounded-md overflow-hidden">
                  <OptimizedImage
                    src={urlInput}
                    alt="Vista previa de imagen"
                    className="w-full h-full"
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageUploader;
