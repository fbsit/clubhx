import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCheck } from "lucide-react";
const vendors: any[] = [];

interface VendorFilterProps {
  selectedVendor: string;
  onVendorChange: (vendorId: string) => void;
}

export default function VendorFilter({ selectedVendor, onVendorChange }: VendorFilterProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-2">
        <UserCheck className="h-4 w-4" />
        Vendedor
      </label>
      
      <Select value={selectedVendor} onValueChange={onVendorChange}>
        <SelectTrigger className="text-xs">
          <SelectValue placeholder="Todos los vendedores" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los vendedores</SelectItem>
          {vendors.map(vendor => (
            <SelectItem key={vendor.id} value={vendor.id}>
              {vendor.name} - {vendor.region}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}