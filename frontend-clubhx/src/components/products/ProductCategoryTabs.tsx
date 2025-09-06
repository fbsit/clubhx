
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ProductCategoryTabsProps {
  currentTab: string;
  onTabChange: (value: string) => void;
}

const ProductCategoryTabs = ({ currentTab, onTabChange }: ProductCategoryTabsProps) => {
  return (
    <div className="mb-4">
      <Tabs defaultValue={currentTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="w-full grid grid-cols-4 h-auto mb-2 bg-background/80 p-1 rounded-xl shadow-sm">
          <TabsTrigger 
            value="all" 
            className={cn(
              "py-2.5 text-xs sm:text-sm rounded-lg transition-all",
              "data-[state=active]:shadow-sm data-[state=active]:bg-white"
            )}
          >
            Todos
          </TabsTrigger>
          <TabsTrigger 
            value="new" 
            className={cn(
              "py-2.5 text-xs sm:text-sm rounded-lg transition-all",
              "data-[state=active]:shadow-sm data-[state=active]:bg-white"
            )}
          >
            Nuevos
          </TabsTrigger>
          <TabsTrigger 
            value="discounts" 
            className={cn(
              "py-2.5 text-xs sm:text-sm rounded-lg transition-all", 
              "data-[state=active]:shadow-sm data-[state=active]:bg-white"
            )}
          >
            Ofertas
          </TabsTrigger>
          <TabsTrigger 
            value="popular" 
            className={cn(
              "py-2.5 text-xs sm:text-sm rounded-lg transition-all",
              "data-[state=active]:shadow-sm data-[state=active]:bg-white"
            )}
          >
            Populares
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ProductCategoryTabs;
