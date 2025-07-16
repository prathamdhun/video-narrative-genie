import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Brain, Loader2, CheckCircle, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useVideo } from '@/contexts/VideoContext';
import { toast } from '@/hooks/use-toast';

export const ProcessingStep: React.FC = () => {
  const { 
    project, 
    setProject, 
    processingSteps, 
    setProcessingSteps, 
    currentStep, 
    setCurrentStep,
    isLoading,
    setIsLoading 
  } = useVideo();

  useEffect(() => {
    if (project.status === 'processing') {
      startProcessing();
    }
  }, [project.status]);

  const startProcessing = async () => {
    setIsLoading(true);
    
    try {
      // Simulate Gemini API text analysis
      await processStep('text-analysis', async () => {
        // Here you would integrate with Gemini API
        await simulateAPICall(2000);
        return { success: true, message: 'Text analyzed successfully' };
      });

      // Mark as ready for next step
      setProject(prev => ({
        ...prev,
        status: 'voice-generation',
        updatedAt: new Date(),
      }));

      toast({
        title: "Processing Complete",
        description: "Text analysis completed successfully. Ready for voice generation.",
      });

    } catch (error) {
      toast({
        title: "Processing Error",
        description: "There was an error processing your text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const processStep = async (stepId: string, processor: () => Promise<any>) => {
    // Update step to processing
    setProcessingSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status: 'processing', progress: 0 }
        : step
    ));

    // Simulate progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setProcessingSteps(prev => prev.map(step => 
        step.id === stepId 
          ? { ...step, progress: i }
          : step
      ));
    }

    try {
      const result = await processor();
      
      // Mark as completed
      setProcessingSteps(prev => prev.map(step => 
        step.id === stepId 
          ? { ...step, status: 'completed', progress: 100 }
          : step
      ));

      return result;
    } catch (error) {
      // Mark as error
      setProcessingSteps(prev => prev.map(step => 
        step.id === stepId 
          ? { ...step, status: 'error', errorMessage: error.message }
          : step
      ));
      throw error;
    }
  };

  const simulateAPICall = (duration: number) => {
    return new Promise(resolve => setTimeout(resolve, duration));
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-5 h-5 animate-spin text-primary" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-video-success" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return <div className="w-5 h-5 rounded-full bg-muted" />;
    }
  };

  const isProcessingComplete = processingSteps.every(step => 
    step.id === 'text-analysis' ? step.status === 'completed' : true
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mx-auto shadow-glow animate-pulse-glow">
          <Brain className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Processing Your Text
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Your text is being processed. The Gemini API will analyze your text and prepare 
          it for voice generation. Please hold on for a moment while we process your text.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <Card className="shadow-card bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Text Analysis Progress</CardTitle>
            <CardDescription>
              Processing with Gemini API for natural language understanding
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {processingSteps
                .filter(step => step.id === 'text-analysis')
                .map(step => (
                <div key={step.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStepIcon(step.status)}
                      <div>
                        <p className="font-medium">{step.title}</p>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      {step.progress}%
                    </div>
                  </div>
                  
                  <Progress value={step.progress} className="w-full" />
                  
                  {step.status === 'error' && step.errorMessage && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                      <p className="text-sm text-destructive">{step.errorMessage}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 bg-muted/50 border-border/50">
          <div className="text-sm space-y-2">
            <p className="font-medium">Current Text:</p>
            <p className="text-muted-foreground line-clamp-3">
              {project.text}
            </p>
          </div>
        </Card>

        {isProcessingComplete && (
          <div className="flex justify-between pt-4 animate-scale-in">
            <Button
              onClick={handlePrevious}
              variant="outline"
              size="lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              size="lg"
              variant="hero"
              className="min-w-32"
            >
              Next Step
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {!isProcessingComplete && (
          <div className="flex justify-between pt-4">
            <Button
              onClick={handlePrevious}
              variant="outline"
              size="lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <Button
              size="lg"
              variant="outline"
              disabled
            >
              Processing...
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};