
import React from "react";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

interface PointsDisplayProps {
  points: number;
}

export const PointsDisplay: React.FC<PointsDisplayProps> = ({ points }) => {
  return (
    <Card className="p-4 flex items-center gap-3 w-full md:w-auto shadow-sm">
      <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
      <div>
        <p className="text-sm font-medium">Tus puntos disponibles</p>
        <p className="text-2xl font-bold">{points.toLocaleString()}</p>
      </div>
    </Card>
  );
};

export default PointsDisplay;
