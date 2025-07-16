import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Video, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  ArrowLeft,
  Play,
  Wand2,
  Layers,
  Music,
  Mic,
  Image as ImageIcon
} from 'lucide-react';
import { useVideo } from '@/contexts/VideoContext';
import { toast } from '@/hooks/use-toast';

interface VideoGenerationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  duration: number;
}

export const VideoGenerationStep: React.FC = () => {
  const { 
    project, 
    setProject, 
    currentStep, 
    setCurrentStep,
    isLoading,
    setIsLoading 
  } = useVideo();

  const [videoSteps, setVideoSteps] = useState<VideoGenerationStep[]>([
    {
      id: 'preparation',
      title: 'Preparing Assets',
      description: 'Organizing audio, image, and text components',
      status: 'pending',
      progress: 0,
      duration: 2000
    },
    {
      id: 'audio-sync',
      title: 'Audio Synchronization',
      description: 'Syncing voiceover with background music',
      status: 'pending',
      progress: 0,
      duration: 3000
    },
    {
      id: 'visual-composition',
      title: 'Visual Composition',
      description: 'Composing background image with text overlays',
      status: 'pending',
      progress: 0,
      duration: 4000
    },
    {
      id: 'video-rendering',
      title: 'Video Rendering',
      description: 'Rendering final video with json2video API',
      status: 'pending',
      progress: 0,
      duration: 5000
    },
    {
      id: 'finalization',
      title: 'Finalization',
      description: 'Optimizing and preparing for download',
      status: 'pending',
      progress: 0,
      duration: 2000
    }
  ]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    if (project.status === 'video-generation') {
      startVideoGeneration();
    }
  }, [project.status]);

  const startVideoGeneration = async () => {
    setIsLoading(true);
    
    try {
      for (let i = 0; i < videoSteps.length; i++) {
        setCurrentStepIndex(i);
        await processVideoStep(i);
      }

      // Mark video as completed
      const videoUrl = `/videos/generated-${Date.now()}.mp4`;
      setProject(prev => ({
        ...prev,
        videoUrl,
        status: 'completed',
        updatedAt: new Date(),
      }));

      toast({
        title: "Video Generated Successfully!",
        description: "Your video has been created and is ready for preview and download.",
      });

    } catch (error) {
      toast({
        title: "Video Generation Failed",
        description: "There was an error generating your video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const processVideoStep = async (stepIndex: number) => {
    const step = videoSteps[stepIndex];
    
    // Update step to processing
    setVideoSteps(prev => prev.map((s, i) => 
      i === stepIndex 
        ? { ...s, status: 'processing', progress: 0 }
        : s
    ));

    // Simulate progress
    const progressIncrement = 100 / (step.duration / 100);
    for (let progress = 0; progress <= 100; progress += progressIncrement) {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setVideoSteps(prev => prev.map((s, i) => 
        i === stepIndex 
          ? { ...s, progress: Math.min(progress, 100) }
          : s
      ));

      // Update overall progress
      const completedSteps = stepIndex;
      const currentStepProgress = Math.min(progress, 100);
      const totalProgress = ((completedSteps * 100) + currentStepProgress) / videoSteps.length;
      setOverallProgress(totalProgress);
    }

    // Mark step as completed
    setVideoSteps(prev => prev.map((s, i) => 
      i === stepIndex 
        ? { ...s, status: 'completed', progress: 100 }
        : s
    ));
  };

  const getStepIcon = (status: string, stepId: string) => {
    if (status === 'processing') {
      return <Loader2 className="w-5 h-5 animate-spin text-primary" />;
    } else if (status === 'completed') {
      return <CheckCircle className="w-5 h-5 text-video-success" />;
    } else if (status === 'error') {
      return <AlertCircle className="w-5 h-5 text-destructive" />;
    }

    // Return specific icons for each step
    switch (stepId) {
      case 'preparation':
        return <Layers className="w-5 h-5 text-muted-foreground" />;
      case 'audio-sync':
        return <Mic className="w-5 h-5 text-muted-foreground" />;
      case 'visual-composition':
        return <ImageIcon className="w-5 h-5 text-muted-foreground" />;
      case 'video-rendering':
        return <Video className="w-5 h-5 text-muted-foreground" />;
      case 'finalization':
        return <Wand2 className="w-5 h-5 text-muted-foreground" />;
      default:
        return <div className="w-5 h-5 rounded-full bg-muted" />;
    }
  };

  const handleNext = () => {
    if (!project.videoUrl) {
      toast({
        title: "Video Generation In Progress",
        description: "Please wait for the video generation to complete.",
        variant: "destructive",
      });
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const isGenerationComplete = project.videoUrl && project.status === 'completed';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mx-auto shadow-glow animate-pulse-glow">
          <Video className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Video Generation
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We're almost done! We will now generate your video, integrating the voiceover, 
          background image, and music. Please hold on while we create your video.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="shadow-card bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Video Generation Progress</CardTitle>
            <CardDescription>
              Creating your video with json2video API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm font-medium">{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="w-full h-2" />
            </div>

            <div className="space-y-4">
              {videoSteps.map((step, index) => (
                <div key={step.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStepIcon(step.status, step.id)}
                      <div>
                        <p className={`font-medium ${
                          step.status === 'processing' ? 'text-primary' :
                          step.status === 'completed' ? 'text-video-success' :
                          'text-foreground'
                        }`}>
                          {step.title}
                        </p>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      {step.progress}%
                    </div>
                  </div>
                  
                  <Progress value={step.progress} className="w-full" />
                  
                  {step.status === 'error' && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                      <p className="text-sm text-destructive">Error processing this step</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Video Components</CardTitle>
            <CardDescription>
              Assets being integrated into your video
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Mic className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Voiceover</p>
                  <p className="text-sm text-muted-foreground">
                    {project.voiceGender} voice
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <ImageIcon className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Background</p>
                  <p className="text-sm text-muted-foreground">
                    AI-generated image
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Music className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Music</p>
                  <p className="text-sm text-muted-foreground">
                    {project.musicUrl ? 'Custom audio' : 'No music'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {isGenerationComplete && (
          <Card className="shadow-card bg-video-success/10 border-video-success/20 animate-scale-in">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-video-success mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-video-success mb-2">
                  Video Generated Successfully!
                </h3>
                <p className="text-muted-foreground mb-4">
                  Your video has been created and is ready for preview and download.
                </p>
                <Button variant="outline" size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  Preview Video
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
            onClick={handleNext}
            size="lg"
            variant="hero"
            disabled={!isGenerationComplete}
          >
            Next Step
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};