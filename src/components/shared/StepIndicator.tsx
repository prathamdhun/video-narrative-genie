import React from 'react';
import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  completedSteps,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center space-y-2">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  completedSteps.includes(index)
                    ? "bg-video-success border-video-success text-white"
                    : currentStep === index
                    ? "bg-primary border-primary text-primary-foreground animate-pulse-glow"
                    : "bg-muted border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {completedSteps.includes(index) ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <Circle className={cn(
                    "w-6 h-6",
                    currentStep === index ? "animate-pulse" : ""
                  )} />
                )}
              </div>
              <div className="text-center max-w-24">
                <p className={cn(
                  "text-sm font-medium",
                  currentStep === index
                    ? "text-primary"
                    : completedSteps.includes(index)
                    ? "text-video-success"
                    : "text-muted-foreground"
                )}>
                  {step.title}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-px mx-4 bg-gradient-to-r from-muted via-muted-foreground/30 to-muted" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};