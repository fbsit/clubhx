
const ProductDetailSkeleton = () => {
  return (
    <div className="container max-w-7xl py-6 animate-fade-in">
      <div className="h-10 w-32 mb-6 rounded-xl bg-muted/30 animate-pulse"></div>
      <div className="flex flex-col md:flex-row gap-8 rounded-xl border border-border/30 p-4 sm:p-6 bg-background/70 shadow-sm">
        <div className="w-full md:w-1/3 aspect-square rounded-xl bg-muted/30 animate-pulse"></div>
        <div className="w-full md:w-2/3 space-y-4">
          <div className="h-6 w-1/3 rounded-lg bg-muted/30 animate-pulse"></div>
          <div className="h-8 w-2/3 rounded-lg bg-muted/30 animate-pulse"></div>
          <div className="h-4 w-1/4 rounded-lg bg-muted/30 animate-pulse"></div>
          <div className="h-24 w-full rounded-lg bg-muted/30 animate-pulse"></div>
          <div className="h-10 w-1/2 rounded-lg bg-muted/30 animate-pulse"></div>
        </div>
      </div>
      <div className="mt-8 rounded-xl border border-border/30 p-4 sm:p-6 bg-background/70 shadow-sm">
        <div className="h-6 w-1/3 mb-4 rounded-lg bg-muted/30 animate-pulse"></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="aspect-square rounded-xl bg-muted/30 animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
