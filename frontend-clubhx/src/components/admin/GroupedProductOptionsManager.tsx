import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Plus, X, Edit2, Check, Trash2, Image, 
  ChevronDown, ChevronRight, Copy, Package, Layers
} from "lucide-react";
import { ProductOption, calculateLoyaltyPoints } from "@/types/product";
import { toast } from "sonner";
import OptimizedImage from "@/components/ui/optimized-image";
import ImageUploader from "@/components/admin/ImageUploader";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface GroupedProductOptionsManagerProps {
  options: ProductOption[];
  onOptionsChange: (options: ProductOption[]) => void;
  basePrice: number;
}

export default function GroupedProductOptionsManager({ 
  options, 
  onOptionsChange, 
  basePrice 
}: GroupedProductOptionsManagerProps) {
  // Group options by their name/type
  const groupedOptions = options.reduce((acc, option) => {
    if (!acc[option.name]) {
      acc[option.name] = [];
    }
    acc[option.name].push(option);
    return acc;
  }, {} as Record<string, ProductOption[]>);

  const [groups, setGroups] = useState<Record<string, boolean>>(() => {
    const initialGroups: Record<string, boolean> = {};
    Object.keys(groupedOptions).forEach(groupName => {
      initialGroups[groupName] = true; // Open by default
    });
    return initialGroups;
  });

  const [newOption, setNewOption] = useState({
    groupName: "",
    value: "",
    price: basePrice,
    sku: "",
    image: "",
    loyaltyPoints: calculateLoyaltyPoints(basePrice)
  });

  const [editingOption, setEditingOption] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<ProductOption>>({});
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [currentEditingImageOptionId, setCurrentEditingImageOptionId] = useState<string | null>(null);

  const existingGroupNames = Object.keys(groupedOptions);
  const availableGroupNames = ["Color", "Tamaño", "Material", "Presentación", "Volumen", "Tono", "Acabado"];

  const toggleGroup = (groupName: string) => {
    setGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const generateSKU = (groupName: string, value: string) => {
    const cleanValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 3);
    const cleanGroup = groupName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 2);
    return `OPT-${cleanGroup}-${cleanValue}`;
  };

  const handleAddOption = () => {
    if (!newOption.groupName.trim() || !newOption.value.trim()) {
      toast.error("Por favor completa el tipo y valor de la opción");
      return;
    }

    const finalSku = newOption.sku || generateSKU(newOption.groupName, newOption.value);
    
    // Check for duplicate SKU
    if (options.some(opt => opt.sku === finalSku)) {
      toast.error("Ya existe una opción con este SKU");
      return;
    }

    const newOptionObj: ProductOption = {
      id: `option-${Date.now()}`,
      name: newOption.groupName.trim(),
      value: newOption.value.trim(),
      price: newOption.price,
      image: newOption.image || undefined,
      sku: finalSku,
      loyaltyPoints: newOption.loyaltyPoints
    };

    onOptionsChange([...options, newOptionObj]);
    
    // Reset form
    setNewOption({
      groupName: newOption.groupName, // Keep group name for easier multiple additions
      value: "",
      price: basePrice,
      sku: "",
      image: "",
      loyaltyPoints: calculateLoyaltyPoints(basePrice)
    });
    
    toast.success("Opción agregada correctamente");
  };

  const handleDeleteOption = (optionId: string) => {
    onOptionsChange(options.filter(option => option.id !== optionId));
    toast.success("Opción eliminada");
  };

  const handleDeleteGroup = (groupName: string) => {
    onOptionsChange(options.filter(option => option.name !== groupName));
    toast.success(`Grupo "${groupName}" eliminado`);
  };

  const handleEditOption = (option: ProductOption) => {
    setEditingOption(option.id);
    setEditValues({
      name: option.name,
      value: option.value,
      price: option.price,
      image: option.image,
      sku: option.sku,
      loyaltyPoints: option.loyaltyPoints
    });
  };

  const handleSaveEdit = (optionId: string) => {
    const updatedOptions = options.map(option => 
      option.id === optionId 
        ? { ...option, ...editValues }
        : option
    );
    
    onOptionsChange(updatedOptions);
    setEditingOption(null);
    setEditValues({});
    toast.success("Opción actualizada");
  };

  const handleCancelEdit = () => {
    setEditingOption(null);
    setEditValues({});
  };

  const handleImageSelected = (imageUrl: string) => {
    if (currentEditingImageOptionId) {
      if (editingOption === currentEditingImageOptionId) {
        setEditValues({...editValues, image: imageUrl});
      } else {
        const updatedOptions = options.map(option => 
          option.id === currentEditingImageOptionId 
            ? { ...option, image: imageUrl }
            : option
        );
        onOptionsChange(updatedOptions);
      }
    } else {
      setNewOption({...newOption, image: imageUrl});
    }
    setImageDialogOpen(false);
    setCurrentEditingImageOptionId(null);
  };

  const openImageDialog = (optionId?: string) => {
    setCurrentEditingImageOptionId(optionId || null);
    setImageDialogOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("SKU copiado al portapapeles");
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Opciones del producto por grupos
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Organiza las opciones por tipo. Precio base del producto: ${basePrice.toLocaleString()}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Existing Groups */}
          {Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
            <Collapsible
              key={groupName}
              open={groups[groupName]}
              onOpenChange={() => toggleGroup(groupName)}
            >
              <Card className="border-2">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {groups[groupName] ? 
                          <ChevronDown className="h-4 w-4" /> : 
                          <ChevronRight className="h-4 w-4" />
                        }
                        <CardTitle className="text-lg">
                          {groupName}
                        </CardTitle>
                        <Badge variant="secondary">
                          {groupOptions.length} opción{groupOptions.length !== 1 ? 'es' : ''}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteGroup(groupName);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="grid gap-3">
                      {groupOptions.map((option) => (
                        <div key={option.id} className="flex items-center justify-between p-4 border rounded-lg bg-background/50">
                          {editingOption === option.id ? (
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-12 h-12 border rounded overflow-hidden bg-gray-50 flex-shrink-0">
                                {(editValues.image || option.image) ? (
                                  <OptimizedImage
                                    src={editValues.image || option.image || ""}
                                    alt={`${option.name} - ${option.value}`}
                                    className="w-full h-full cursor-pointer"
                                    aspectRatio="square"
                                    onClick={() => openImageDialog(option.id)}
                                  />
                                ) : (
                                  <button
                                    onClick={() => openImageDialog(option.id)}
                                    className="w-full h-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                                  >
                                    <Image className="h-4 w-4 text-gray-400" />
                                  </button>
                                )}
                              </div>
                              <Input
                                placeholder="Valor"
                                value={editValues.value || ""}
                                onChange={(e) => setEditValues({...editValues, value: e.target.value})}
                                className="w-32"
                              />
                              <Input
                                placeholder="SKU"
                                value={editValues.sku || ""}
                                onChange={(e) => setEditValues({...editValues, sku: e.target.value})}
                                className="w-32"
                              />
                               <Input
                                 type="number"
                                 placeholder="Precio"
                                 value={editValues.price || 0}
                                 onChange={(e) => {
                                   const newPrice = Number(e.target.value);
                                   setEditValues({
                                     ...editValues, 
                                     price: newPrice,
                                     loyaltyPoints: calculateLoyaltyPoints(newPrice)
                                   });
                                 }}
                                 className="w-24"
                               />
                               <Input
                                 type="number"
                                 placeholder="Puntos"
                                 value={editValues.loyaltyPoints || 0}
                                 onChange={(e) => setEditValues({...editValues, loyaltyPoints: Number(e.target.value)})}
                                 className="w-20"
                               />
                              <div className="flex gap-1">
                                <Button size="icon" variant="outline" onClick={() => handleSaveEdit(option.id)}>
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="outline" onClick={handleCancelEdit}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-3 flex-1">
                                <div className="w-12 h-12 border rounded overflow-hidden bg-gray-50 flex-shrink-0">
                                  {option.image ? (
                                    <OptimizedImage
                                      src={option.image}
                                      alt={`${option.name} - ${option.value}`}
                                      className="w-full h-full cursor-pointer"
                                      aspectRatio="square"
                                      onClick={() => openImageDialog(option.id)}
                                    />
                                  ) : (
                                    <button
                                      onClick={() => openImageDialog(option.id)}
                                      className="w-full h-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                                    >
                                      <Image className="h-4 w-4 text-gray-400" />
                                    </button>
                                  )}
                                </div>
                                <div className="flex flex-col gap-1">
                                   <div className="flex items-center gap-2">
                                     <span className="font-medium">{option.value}</span>
                                     <span className="text-sm text-emerald-600 font-medium">
                                       ${option.price.toLocaleString()}
                                     </span>
                                     <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                       {option.loyaltyPoints} pts
                                     </span>
                                   </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                      <Package className="h-3 w-3 mr-1" />
                                      {option.sku}
                                    </Badge>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => copyToClipboard(option.sku || "")}
                                      className="h-6 px-2"
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button size="icon" variant="outline" onClick={() => handleEditOption(option)}>
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="outline" onClick={() => handleDeleteOption(option.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}

          {/* Add New Option Form */}
          <Card className="border-dashed border-2">
            <CardHeader>
              <CardTitle className="text-lg">Agregar nueva opción</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-1">
                    <div className="w-12 h-12 border rounded overflow-hidden bg-gray-50">
                      {newOption.image ? (
                        <OptimizedImage
                          src={newOption.image}
                          alt="Nueva opción"
                          className="w-full h-full cursor-pointer"
                          aspectRatio="square"
                          onClick={() => openImageDialog()}
                        />
                      ) : (
                        <button
                          onClick={() => openImageDialog()}
                          className="w-full h-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <Image className="h-4 w-4 text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Select 
                      value={newOption.groupName} 
                      onValueChange={(value) => setNewOption({...newOption, groupName: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableGroupNames.map(name => (
                          <SelectItem key={name} value={name}>{name}</SelectItem>
                        ))}
                        {existingGroupNames.filter(name => !availableGroupNames.includes(name)).map(name => (
                          <SelectItem key={name} value={name}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3">
                    <Input
                      placeholder="Valor (ej: Rojo)"
                      value={newOption.value}
                      onChange={(e) => {
                        const value = e.target.value;
                        setNewOption({
                          ...newOption, 
                          value,
                          sku: newOption.groupName ? generateSKU(newOption.groupName, value) : ""
                        });
                      }}
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      placeholder="SKU"
                      value={newOption.sku}
                      onChange={(e) => setNewOption({...newOption, sku: e.target.value})}
                    />
                  </div>
                   <div className="col-span-2">
                     <Input
                       type="number"
                       placeholder="Precio ($)"
                       value={newOption.price}
                       onChange={(e) => {
                         const newPrice = Number(e.target.value);
                         setNewOption({
                           ...newOption, 
                           price: newPrice,
                           loyaltyPoints: calculateLoyaltyPoints(newPrice)
                         });
                       }}
                     />
                   </div>
                   <div className="col-span-1">
                     <Input
                       type="number"
                       placeholder="Puntos"
                       value={newOption.loyaltyPoints}
                       onChange={(e) => setNewOption({...newOption, loyaltyPoints: Number(e.target.value)})}
                     />
                   </div>
                   <div className="col-span-1">
                     <div className="text-sm pt-2">
                       <div className="font-medium text-emerald-600">
                         ${newOption.price.toLocaleString()}
                       </div>
                       <div className="text-xs text-blue-600">
                         {newOption.loyaltyPoints} pts
                       </div>
                     </div>
                   </div>
                  <div className="col-span-1">
                    <Button onClick={handleAddOption} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                 <div className="text-xs text-muted-foreground">
                   Cada opción tiene su precio directo independiente del precio base del producto. Los puntos se calculan automáticamente (1 punto = $1,800).
                 </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Image Selection Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Seleccionar imagen para la opción</DialogTitle>
          </DialogHeader>
          <ImageUploader 
            onImageSelected={handleImageSelected}
            currentImage={
              currentEditingImageOptionId 
                ? (editingOption === currentEditingImageOptionId 
                   ? editValues.image 
                   : options.find(o => o.id === currentEditingImageOptionId)?.image)
                : newOption.image
            }
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
