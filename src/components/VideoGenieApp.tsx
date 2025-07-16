import React from 'react';
import { VideoProvider, useVideo } from '@/contexts/VideoContext';
import { StepIndicator } from '@/components/shared/StepIndicator';
import { TextInputStep } from '@/components/steps/TextInputStep';
import { ProcessingStep } from '@/components/steps/ProcessingStep';
import { VoiceGenerationStep } from '@/components/steps/VoiceGenerationStep';
import { ImageGenerationStep } from '@/components/steps/ImageGenerationStep';
import { MusicUploadStep } from '@/components/steps/MusicUploadStep';
import { VideoGenerationStep } from '@/components/steps/VideoGenerationStep';
import { PreviewStep } from '@/components/steps/PreviewStep';
import { Card } from '@/components/ui/card';
import { Video, Sparkles, Wand2 } from 'lucide-react';

const steps = [
  { id: 'text-input', title: 'Text Input', description: 'Enter your content' },
  { id: 'processing', title: 'Processing', description: 'AI analysis' },
  { id: 'voice', title: 'Voice', description: 'Generate audio' },
  { id: 'image', title: 'Image', description: 'Create visuals' },
  { id: 'music', title: 'Music', description: 'Add soundtrack' },
  { id: 'video', title: 'Video', description: 'Generate final video' },
  { id: 'preview', title: 'Preview', description: 'Download & share' },
];

const VideoGenieContent: React.FC = () => {
  const { currentStep } = useVideo();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <TextInputStep />;
      case 1:
        return <ProcessingStep />;
      case 2:
        return <VoiceGenerationStep />;
      case 3:
        return <ImageGenerationStep />;
      case 4:
        return <MusicUploadStep />;
      case 5:
        return <VideoGenerationStep />;
      case 6:
        return <PreviewStep />;
      default:
        return (
          <div className="text-center py-12">
            <Wand2 className="w-12 h-12 mx-auto mb-4 text-primary animate-float" />
            <h3 className="text-xl font-semibold mb-2">Step Not Found</h3>
            <p className="text-muted-foreground">Please navigate to a valid step</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <Video className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Video Narrative Genie
            </h1>
            <Sparkles className="w-8 h-8 text-primary animate-float" />
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Transform your text into stunning videos with AI-powered voice generation, 
            dynamic visuals, and professional editing. All powered by cutting-edge APIs.
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          completedSteps={Array.from({ length: currentStep }, (_, i) => i)}
        />

        {/* Main Content */}
        <Card className="max-w-6xl mx-auto shadow-elegant bg-gradient-card border-border/50 min-h-[600px]">
          <div className="p-8">
            {renderCurrentStep()}
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Powered by Gemini API • Google Text-to-Speech • OpenAI • json2video</p>
        </div>
      </div>
    </div>
  );
};

export const VideoGenieApp: React.FC = () => {
  return (
    <VideoProvider>
      <VideoGenieContent />
    </VideoProvider>
  );
};