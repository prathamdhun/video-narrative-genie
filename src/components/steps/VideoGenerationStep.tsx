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
    setIsLoading,
    apiKeys
  } = useVideo();

  const [videoSteps, setVideoSteps] = useState<VideoGenerationStep[]>([
    {
      id: 'preparation',
      title: 'Preparing Sacred Assets',
      description: 'Organizing divine audio, sacred image, and devotional text',
      status: 'pending',
      progress: 0,
      duration: 2000
    },
    {
      id: 'audio-sync',
      title: 'Devotional Audio Sync',
      description: 'Syncing sacred voiceover with devotional background music',
      status: 'pending',
      progress: 0,
      duration: 3000
    },
    {
      id: 'visual-composition',
      title: 'Divine Visual Composition',
      description: 'Composing sacred background with Hindu religious overlays',
      status: 'pending',
      progress: 0,
      duration: 4000
    },
    {
      id: 'video-rendering',
      title: 'Sacred Video Rendering',
      description: 'Rendering final devotional video with json2video API',
      status: 'pending',
      progress: 0,
      duration: 5000
    },
    {
      id: 'finalization',
      title: 'Divine Finalization',
      description: 'Optimizing spiritual content and preparing for devotees',
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
      const apiKey = apiKeys.json2video[0];
      if (!apiKey) throw new Error('json2video API key not found');

      // Get clean text for OpenAI processing
      const getCleanText = (text: string) => {
        try {
          const parsed = JSON.parse(text);
          if (parsed.content) return parsed.content;
          if (parsed.text) return parsed.text;
          return text;
        } catch {
          return text;
        }
      };

      const cleanText = getCleanText(project.text);

      // Use OpenAI to generate video template
      const openaiApiKey = apiKeys.openai[0];
      if (!openaiApiKey) throw new Error('OpenAI API key not found');

      // Generate video template using OpenAI
      const templateResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a video template generator. Create a JSON template for video generation based on the provided text.'
            },
            {
              role: 'user',
              content: `Create a video template for this text: "${cleanText}". Include visual effects, transitions, and Hindu devotional elements.`
            }
          ],
          max_tokens: 1000
        })
      });

      if (!templateResponse.ok) {
        throw new Error('Failed to generate video template');
      }

      const templateData = await templateResponse.json();
      const videoTemplate = templateData.choices[0].message.content;

      // Real json2video API call with Hindu devotional configuration
      const videoConfig = {
        template: "hindu_devotional",
        scenes: [
          {
            narration: cleanText,
            voice_url: project.audioUrl, // Use the generated voice from ResponsiveVoice
            background_music: project.musicUrl,
            voice_settings: {
              language: project.voiceLanguage,
              gender: project.voiceGender,
              speed: 0.9,
              pitch: 1
            },
            visual_effects: {
              fade_in: true,
              sacred_particles: true,
              golden_glow: true,
              divine_transitions: true,
              om_symbol_overlay: true
            },
            religious_enhancements: {
              lotus_petals: true,
              sacred_geometry: true,
              temple_bells: true,
              divine_light_rays: true
            }
          }
        ],
        output: {
          format: "mp4",
          quality: "1080p",
          duration: project.videoDuration || 30,
          aspect_ratio: project.videoAspectRatio || "16:9",
          theme: "hindu_devotional"
        }
      };

      for (let i = 0; i < videoSteps.length; i++) {
        setCurrentStepIndex(i);
        await processVideoStep(i, videoConfig);
      }

      // Real json2video API call
      const response = await fetch('https://api.json2video.com/v2/movies', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(videoConfig)
      });

      if (!response.ok) {
        // Try with second API key
        const secondApiKey = apiKeys.json2video[1];
        if (secondApiKey) {
          const retryResponse = await fetch('https://api.json2video.com/v2/movies', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${secondApiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(videoConfig)
          });
          
          if (!retryResponse.ok) throw new Error('Both json2video API keys failed');
          
          const data = await retryResponse.json();
          setProject(prev => ({
            ...prev,
            videoUrl: data.url,
            status: 'completed',
            updatedAt: new Date(),
          }));
        } else {
          throw new Error('json2video API call failed');
        }
      } else {
        const data = await response.json();
        setProject(prev => ({
          ...prev,
          videoUrl: data.url,
          status: 'completed',
          updatedAt: new Date(),
        }));
      }

      toast({
        title: "Divine Video Created Successfully! 🙏",
        description: "Your sacred Hindu devotional video has been blessed and is ready for devotees to watch.",
      });

    } catch (error) {
      toast({
        title: "Video Generation Failed",
        description: "There was an error creating your divine video. Please try again with different settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const processVideoStep = async (stepIndex: number, config: any) => {
    const step = videoSteps[stepIndex];
    
    // Update step to processing
    setVideoSteps(prev => prev.map((s, i) => 
      i === stepIndex 
        ? { ...s, status: 'processing', progress: 0 }
        : s
    ));

    // Simulate progress with divine blessings
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
        title: "Divine Video Generation In Progress",
        description: "Please wait for the sacred video creation to complete with divine blessings.",
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
          Divine Video Creation
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We're almost done! We will now create your sacred Hindu devotional video, integrating the divine voiceover, 
          sacred background imagery, and devotional music with special Hindu religious effects and spiritual blessings.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="shadow-card bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Divine Video Generation Progress</CardTitle>
            <CardDescription>
              Creating your sacred video with json2video API and Hindu devotional enhancements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overall Sacred Progress</span>
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
                      <p className="text-sm text-destructive">Error processing this divine step</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Sacred Video Components</CardTitle>
            <CardDescription>
              Divine assets being blessed and integrated into your devotional video
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Mic className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Divine Voiceover</p>
                  <p className="text-sm text-muted-foreground">
                    {project.voiceGender} Hindi voice
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <ImageIcon className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Sacred Background</p>
                  <p className="text-sm text-muted-foreground">
                    Hindu religious imagery
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Music className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Devotional Music</p>
                  <p className="text-sm text-muted-foreground">
                    {project.musicUrl ? 'Sacred audio' : 'Divine instrumental'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-accent/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Video className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">Video Settings</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>Duration: {project.videoDuration} seconds</div>
                <div>Aspect Ratio: {project.videoAspectRatio}</div>
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
                  Divine Video Blessed and Ready! 🙏
                </h3>
                <p className="text-muted-foreground mb-4">
                  Your sacred Hindu devotional video has been created with divine blessings and is ready 
                  for preview and sharing with fellow devotees.
                </p>
                <Button variant="outline" size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  Preview Sacred Video
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
