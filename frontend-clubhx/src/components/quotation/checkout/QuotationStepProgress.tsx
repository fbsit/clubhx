
import { FC } from "react";

type StepProgressProps = {
  currentStep: 1 | 2 | 3;
};

const QuotationStepProgress: FC<StepProgressProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center mb-6 px-4 sm:px-6">
      <div className={`flex flex-col items-center ${currentStep >= 1 ? "text-primary" : "text-muted-foreground"}`}>
        <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${currentStep >= 1 ? "border-primary bg-primary/10" : "border-muted-foreground"}`}>
          <span className="text-sm font-medium">1</span>
        </div>
        <span className="text-xs mt-1">Revisar</span>
      </div>
      <div className={`flex-1 h-0.5 mx-2 ${currentStep >= 2 ? "bg-primary" : "bg-muted"}`}></div>
      <div className={`flex flex-col items-center ${currentStep >= 2 ? "text-primary" : "text-muted-foreground"}`}>
        <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${currentStep >= 2 ? "border-primary bg-primary/10" : "border-muted-foreground"}`}>
          <span className="text-sm font-medium">2</span>
        </div>
        <span className="text-xs mt-1">Entrega</span>
      </div>
      <div className={`flex-1 h-0.5 mx-2 ${currentStep >= 3 ? "bg-primary" : "bg-muted"}`}></div>
      <div className={`flex flex-col items-center ${currentStep >= 3 ? "text-primary" : "text-muted-foreground"}`}>
        <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${currentStep >= 3 ? "border-primary bg-primary/10" : "border-muted-foreground"}`}>
          <span className="text-sm font-medium">3</span>
        </div>
        <span className="text-xs mt-1">Confirmar</span>
      </div>
    </div>
  );
};

export default QuotationStepProgress;
