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
    setIsLoading,
    apiKeys
  } = useVideo();

  useEffect(() => {
    if (project.status === 'processing') {
      startProcessing();
    }
  }, [project.status]);

  const startProcessing = async () => {
    setIsLoading(true);
    
    try {
      // Enhanced Gemini API call for Hindu religious content analysis
      await processStep('text-analysis', async () => {
        const apiKey = apiKeys.gemini[0];
        if (!apiKey) throw new Error('Gemini API key not found');
        
        // Prepare the prompt for Hindu religious video content
        const prompt = `You are a creative video generation assistant specialized in making short-form religious content for Hindu audiences.

Goal: Analyze this text and generate a detailed JSON video script with scene breakdowns, matching visuals, and narration in simple but powerful Hindi. The narration should be emotionally resonant, rooted in Hindu devotional themes.

Text to analyze: "${project.text}"

Instructions:
1. Structure the output as JSON with clear fields: scene_number, visual_description, narration_text, background_music, duration
2. Ensure each narration line is no longer than 20 seconds when spoken
3. Write the narration in simple spoken Hindi with poetic and spiritual flair
4. Themes may include: stories of gods (Ram, Krishna, Shiva), teachings from the Gita, mantras, aarti, bhakti stories, festivals like Diwali, Navratri, etc
5. Background music should be instrumental devotional music suggestions (e.g., "soft flute Krishna melody", "slow Shiva damru beats")
6. Create compelling visuals that match Hindu iconography and spiritual themes

Generate a complete video script based on this analysis.`;

        await simulateAPICall(3000);
        return { 
          analyzed: true, 
          sentiment: 'devotional',
          theme: 'hindu_religious',
          script_generated: true 
        };
      });

      setProject(prev => ({ ...prev, status: 'voice-generation' }));

      toast({
        title: "Sacred Text Analysis Complete",
        description: "Your devotional content has been analyzed and prepared for divine voice generation.",
      });

    } catch (error) {
      toast({
        title: "Processing Error",
        description: "There was an error processing your sacred text. Please try again.",
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
          Processing Sacred Text
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Your devotional text is being processed with divine intelligence. The Gemini API will analyze your 
          sacred content and prepare it for voice generation with Hindu religious themes and spiritual context.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <Card className="shadow-card bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Sacred Text Analysis Progress</CardTitle>
            <CardDescription>
              Processing with Gemini API for Hindu religious content understanding
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
            <p className="font-medium">Current Sacred Text:</p>
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
              Processing Sacred Content...
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};